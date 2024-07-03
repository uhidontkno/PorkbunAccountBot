import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
  
  let options = new chrome.Options()
  options.addArguments("--disable-dev-shm-usage","no-sandbox")
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  try {
    await driver.get('https://www.google.com/ncr')
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000)
  } finally {
    await driver.quit()
  }