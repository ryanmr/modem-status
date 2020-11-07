require("dotenv").config();
const { chromium } = require("playwright");
const fs = require("fs");
const delay = require("delay");

async function getInfoFromModem() {
  console.info("starting collection");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  async function getText(id) {
    const value = await page.evaluate(
      async (el) => el.innerText,
      await page.$(`#${id}`)
    );
    return value;
  }

  await page.goto(process.env.INITIAL_ROUTE);

  await page.fill("#admin_user_name", process.env.USERNAME);
  await page.fill("#admin_password", process.env.PASSWORD);

  await page.click("#apply_btn");

  await page.click('text="Modem Status"');

  await page.click("#wanstatus");

  // lets the page load
  await page.waitForTimeout(1000);

  const downspeed = await getText("Downstream");
  const upspeed = await getText("Upstream");
  const retrains = await getText("retains_num_last24H");

  const snrDown = await getText("snr_margin");
  const snrUp = await getText("snr_margin_u");

  const attDown = await getText("attenuation");
  const attUp = await getText("attenuation_u");

  const powerDown = await getText("down_power");
  const powerUp = await getText("up_power");

  // NEAR means near to the DSLAM
  const crcErrorsNear = await getText("Near_endCRC_cnt");
  const crcErrorsFar = await getText("Far_endCRC_cnt");

  // NEAR means near to the DSLAM
  const fecErrorsNear = await getText("Near_endFEC");
  const fecErrorsFar = await getText("Far_endFEC");

  const data = {
    downspeed,
    upspeed,
    retrains,
    snrDown,
    snrUp,
    attDown,
    attUp,
    powerDown,
    powerUp,
    crcErrorsNear,
    crcErrorsFar,
    fecErrorsNear,
    fecErrorsFar,
  };

  // you can turn this on if you want to see where you are in the process
  // await page.screenshot({ path: `./screenshot-${Date.now()}.png` });

  // show table
  console.table(data);

  // write json
  fs.appendFileSync("./data.json", JSON.stringify(data) + "\n");

  await browser.close();

  console.info("ending collection");
  return;
}

// run for 100 rounds
// in an ideal setup, the exit code would reclaim the container this runs in
// and then it would be restarted
// this could help eliminate long lived bugs
// w/r/t headless browsers and friends
(async () => {
  const max = 7;
  const min = 2;
  for (let i = 0; i < 100; i++) {
    await getInfoFromModem();
    const window = Math.round(Math.random() * (max - min) + min);
    console.info(`see you in ${window} minutes`);
    await delay(1000 * 60 * window);
  }

  console.info("all done");
  process.exit(0);
})();
