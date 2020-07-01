const puppeteer = require("puppeteer");

require("dotenv").config();
const exec = require("child_process").exec;

const slackNotification = (message) => {
  if (process.env.HOOK_URL) {
    return exec(
      `curl -X POST -H 'Content-type: application/json' --data '{"text":"${message}"}' ${process.env.HOOK_URL}`
    );
  } else {
    console.log(message);
  }
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  try {
    await page.goto(process.env.URL, { waitUntil: "networkidle2" });
    await page.waitFor("input[name=USER]");
    await page.type("#USERNAME", username);
    await page.waitFor("input[name=Password]");
    await page.type("#PASSWORD", password);
    await page.click(".signinButtonDiv");
    await page.waitFor(3000);
    await page.goto(
      "https://applications.labor.ny.gov/Individual/UIES/UIESConnectivity?DEST=UI&LOCALE=en_US"
    );
    await page.waitFor(3000);
    await page.evaluate(
      (input) => document.querySelector(input).click(),
      "input[type=submit]"
    );
    await page.waitFor(3000);

    try {
      await page.evaluate(
        (input) => document.querySelector(input).click(),
        "input[type=submit]"
      );
      await page.waitFor(3000);
      await page.evaluate(
        (button) => document.querySelector(button).click(),
        "button[type=submit]"
      );
      await page.waitFor(3000);

      await page.click("#G05_REFUSE_OFFER0");
      await page.select("select#G05_TOTAL_DAYS_WORKED", "0");
      await page.click("#G05_EXCEEDED_MAX_EARNINGS0");
      await page.select("select#G05_DAYS_NOT_RWA", "0");
      await page.select("select#G05_VACATION_PAY_DAYS", "0");
      await page.select("select#G05_HOLIDAY_PAY_DAYS", "0");
      await page.click("#G05_RETURNED_FULL_TIME0");
      await page.click(".cui-button-primary");
      await page.waitFor(3000);
      await page.click(".cui-button-primary");
      await page.waitFor(3000);
      result = await page.title();
      slackNotification("Claim Complete");
      await browser.close();
    } catch {
      slackNotification("Claim submitted. Closing");
    }
  } catch (error) {
    slackNotification(`Failure:\n${error}`);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
})();
