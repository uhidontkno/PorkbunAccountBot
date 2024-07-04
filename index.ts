import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { JSDOM } from "jsdom";
const characters ='abcdefghijklmnopqrstuvwxyz';

function generateString(length:number) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
const timeout = (delay: number | undefined) => new Promise(resolve => setTimeout(resolve, delay));
async function getLatestXitroo(address:string) {
  while (true) {
    await timeout(2000)
  let mail = await (await fetch(`https://api.xitroo.com/v1/mails?locale=en&mailAddress=${address}&mailsPerPage=1&minTimestamp=0&maxTimestamp=${Date.now() / 1000}`)).json();
  if (!mail["totalMails"]) {continue;}
  let email = await (await fetch(`https://api.xitroo.com/v1/mail?locale=en&id=${mail.mails[0]._id}`)).json()
  return atob(email["bodyHtmlStrict"])
  }
}


let data = {"creds":[generateString(16),"Spam123456!"],"email":`spam${generateString(12)}@xitroo.com`}

  let options = new chrome.Options()
  options.addArguments("--disable-dev-shm-usage","no-sandbox","disable-infobars","--disable-extensions","--incognito","--remote-debugging-port=9222","--disable-dev-shm-using")
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  await driver.get('https://porkbun.com/account/login');
  await timeout(1000);
  if (await driver.getTitle() == "Human Verification") {
    console.error("Porkbun flagged us. Exiting!");
    process.exit(1);
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
  await driver.findElement(By.id('newAccountFirstName')).sendKeys(generateString(10));
  await driver.findElement(By.id('newAccountAddress1')).sendKeys(generateString(32));
  await driver.findElement(By.id('newAccountCity')).sendKeys(generateString(10));
  await driver.findElement(By.id('newAccountZip')).sendKeys((Date.now()*Math.random()).toString().substring(0,5));
  await driver.findElement(By.css('#newAccountState > option:nth-child(2)')).click();
  await driver.findElement(By.id('newAccountPhone')).sendKeys("555-155-4761");
  await driver.findElement(By.css('#newAccountPhoneCode > option:nth-child(2)')).click();
  driver.executeScript(`accountCreateCheck();`)

// Email verification
await timeout(500);
let email = await getLatestXitroo(data.email);
let d = new JSDOM(email).window.document;
let code = d.querySelector("p")?.textContent?.split("verification code is:")[1]
console.log(code)
// @ts-expect-error
await driver.findElement(By.id("modal_verifySessionEmail_code")).sendKeys(code);
driver.executeScript("verifySessionEmail();")