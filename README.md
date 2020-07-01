# Unemployment

Submits an Unemployment Benefits Claim to NYS Department of Labor

Environment Variables (.env)

```
HOOK_URL=<Slack Hook URL> - Optional
URL=https://www.labor.ny.gov/signin
USERNAME=<DOL Username>
PASSWORD=<DOL Password>
```

Run Steps

`npm install && node app.js`

If you added a Slack Hook URL you will get a notification when the claim is complete, the claim has already been submitted, or an error.

This application is only built for New York State as that's all I need to apply for!
