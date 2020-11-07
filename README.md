# Modem Health Check

Alas, living in the capital city of Saint Paul, there is a dearth of fiber connectivity. Living in the bare copper wire, I use an older modem. It delivers _acceptable_ results, but keeping some statistics on the DSL lines' various factors could reveal underlying issues.

## Tech

* Node
* Playwright
* dotenv

Playwright can headlessly and programmatically interact with a webpage, clicking buttins and reading text.

## How to

```
yarn

yarn start
```

This likely won't work for your setup. Your modem is much better than mine.

## What does it do?

1. Navigate to modem IP address
2. Log in
3. Navigate to status screen
4. Navigate to DSL status
5. Collect data
6. Write data out to `./data.log`
7. Wait for a random-ish time interval