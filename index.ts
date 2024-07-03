import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import { Select } from "selenium-webdriver/common/"
import chrome from "selenium-webdriver/chrome";
let data = {"creds":[Math.floor(Date.now()*(Math.random()*10)).toString(16),"Spam123456!"],"email":`spam${Date.now()}@xitroo.com`,"phone":[1,"123456789"]}

  let options = new chrome.Options()
  options.addArguments("--disable-dev-shm-usage","no-sandbox","disable-infobars","--disable-extensions")
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  await driver.get('https://porkbun.com/account/login')

  // Checkboxes
  await driver.findElement(By.id('tosAgreement')).click();
  await driver.findElement(By.id('newAccountSubscribeNo')).click();

  // Login details
  await driver.findElement(By.id('newAccountUsername')).sendKeys(data.creds[0]);
  await driver.findElement(By.id('newAccountPassword')).sendKeys(data.creds[1]);

  // Whois/legal information
  await driver.findElement(By.id('newAccountEmail')).sendKeys(data.email);
  await driver.findElement(By.css('#newAccountCountry > option:nth-child(2)')).click();
  