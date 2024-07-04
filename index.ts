import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { JSDOM } from "jsdom";
import { generatePassword,generateString,getLatestXitroo,prompt } from "./helper.ts";
const timeout = (delay: number | undefined) => new Promise(resolve => setTimeout(resolve, delay));

if (!await Bun.file("accs.txt").exists()) {
  Bun.write("accs.txt","",{createPath:true})
}

let am:any = undefined;
if (!Number(process.argv[2])) {
am = await prompt("Amount of accounts? ")
if (!Number(am)) {
  console.error("Not a valid number.");process.exit(1);
}
} else {
  am = Number(process.argv[2]);
}
let globStart = Date.now();
console.log(`Generating ${am} accounts...\n`);
let estimate = 17*am;
let eDisplay = `${estimate}s`;
if (estimate > 59) {eDisplay = `${estimate / 60}m`}
if (estimate > (60*60)-1) {eDisplay = `${estimate / (60*60)}h`}
console.log(`Estimate until completed: ${eDisplay}\n`)
let ua = ["Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.99 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/114.1 Mobile/15E148 Safari/605.1.15",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 YaBrowser/23.5.6.403.10 SA/3 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/21.0 Chrome/110.0.5481.154 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 OPR/99.0.0.0",
"Opera/9.80 (Android; Opera Mini/7.5.33942/191.308; U; en) Presto/2.12.423 Version/12.16",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/534.24 XiaoMi/MiuiBrowser/13.30.1-gn",
"Mozilla/5.0 (Linux; Android 10; JNY-LX1; HMSCore 6.11.0.302) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 HuaweiBrowser/13.0.5.303 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 11; en-us; itel P661W Build/RP1A.201005.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36 PHX/12.9",
"Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36 EdgA/113.0.1774.63",
"Mozilla/5.0 (Linux; arm_64; Android 12; CPH2205) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 YaBrowser/23.3.3.86.00 SA/3 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 4.4.2; en-US; HM NOTE 1W Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/11.0.5.850 U3/0.8.0 Mobile Safari/534.30",
"Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36 VivoBrowser/10.4.2.0",
"Mozilla/5.0 (Linux; U; Android 13; vi-vn; CPH2159 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36 HeyTapBrowser/45.9.5.1.1",
"Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0",
"Mozilla/5.0 (Linux; Android 5.1.1; KFSUWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/108.4.6 like Chrome/108.0.5359.220 Safari/537.36"
]

for (let i = 0; i < Number(am);i++) {
let data = {"creds":[generateString(12),generatePassword(12)],"email":`spam${generateString(12)}@xitroo.com`}
  let options = new chrome.Options()
  options.addArguments("--disable-dev-shm-usage","no-sandbox","disable-infobars","--disable-extensions","--remote-debugging-port=9222","--disable-dev-shm-using",`user-agent=${ua[Math.floor(Math.random()*ua.length)]}`)
  if (!process.argv.includes("--debug")) {options.addArguments("headless")}
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  await driver.get('https://porkbun.com/account/login');
  let start = Date.now();
  await timeout(250);
  await driver.wait(until.elementLocated(By.id('tosAgreement')), 30000);
  if (await driver.getTitle() == "Human Verification") {
    driver.executeScript("window.location.reload(true);")
  }
  // Checkboxes
  await driver.findElement(By.id('tosAgreement')).click();
  await driver.findElement(By.id('newAccountSubscribeNo')).click();
  // Login details
  await driver.findElement(By.id('newAccountUsername')).sendKeys(data.creds[0]);
  await driver.findElement(By.id('newAccountPassword')).sendKeys(data.creds[1]);

  // Whois/legal information
  await driver.findElement(By.id('newAccountEmail')).sendKeys(data.email);
  await driver.findElement(By.css('#newAccountCountry > option:nth-child(2)')).click();
  await driver.findElement(By.id('newAccountFirstName')).sendKeys(generateString(12));
  await driver.findElement(By.id('newAccountAddress1')).sendKeys(generateString(32));
  await driver.findElement(By.id('newAccountCity')).sendKeys("Roseland");
  await driver.findElement(By.id('newAccountZip')).sendKeys("32957");
  await driver.findElement(By.css('#newAccountState > option:nth-child(10)')).click();
  await driver.findElement(By.id('newAccountPhone')).sendKeys(`321-5${Math.round((Math.random()+1)*40)}-${Math.round((Math.random()+1)*40)}${Math.round((Math.random()+1)*40)}`); // phone number likely does not exist
  await driver.findElement(By.css('#newAccountPhoneCode > option:nth-child(2)')).click();
  driver.executeScript(`accountCreateCheck();`)

// Email verification
await timeout(500);
let email = await getLatestXitroo(data.email);
let d = new JSDOM(email).window.document;
let code = d.querySelector("p")?.textContent?.split("verification code is:")[1]
// @ts-expect-error
await driver.findElement(By.id("modal_verifySessionEmail_code")).sendKeys(code);
await driver.executeScript("verifySessionEmail();")
await timeout(500);
await driver.findElement(By.id('tosAgreement')).click();
await driver.executeScript(`accountCreateCheck();`)
await driver.wait(until.urlIs("https://porkbun.com/account"), 10000);
// Account created.
//if (!process.argv.includes("--debug")) {
//await driver.stop_client()
await driver.close()
await driver.quit()
//}
console.log(`${data.creds[0]}:${data.creds[1]} [Took ${Math.round(((Date.now()-start)/1000)*100)/100}s]`);
let f = "";
try {
  f = await (Bun.file("accs.txt")).text()
} catch {}
Bun.write("accs.txt",`${f}${data.creds[0]}:${data.creds[1]}\n`);
if (process.platform != "win32") {
  if (process.argv.includes("--debug")) {console.log("Making sure remote debugging port is closed...")}
  try {
  await Bun.$`kill -9 $(lsof -t -i:9222) > /dev/null 2> /dev/null` // Make sure remote debugging port is closed
  } catch {
    // Remote debugging port is already closed. Nothing to do!
  }
}
}
console.log(`\nGenerated ${am} accounts in ${Math.round(((Date.now()-globStart)/1000)*100)/100}s`);