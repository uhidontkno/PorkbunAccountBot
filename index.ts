import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
let data = {"creds":[Math.floor(Date.now()*(Math.random()*10)).toString(16),"Spam123456!"],"email":`spam${Date.now()}@xitroo.com`,"legal":{"firstName":"test","address":"123 Testing Lane","country":1,"city":"Test","state":4,"zipCode":"123456"},"phone":[1,"123456789"]}

  let options = new chrome.Options()
  options.addArguments("--disable-dev-shm-usage","no-sandbox","disable-infobars","--disable-extensions")
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  await driver.get('https://porkbun.com/account/login')