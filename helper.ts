import * as readline from 'node:readline/promises';  // This uses the promise-based APIs
import { stdin as input, stdout as output } from 'node:process';
const timeout = (delay: number | undefined) => new Promise(resolve => setTimeout(resolve, delay));
export function generateString(length:number) {
    const characters ='abcdefghijklmnopqrstuvwxyz';
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
  
      return result;
  }
  export function generatePassword(length:number) {
    const characters ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }
  
  export async function getLatestXitroo(address:string) {
    while (true) {
      
    let mail = await (await fetch(`https://api.xitroo.com/v1/mails?locale=en&mailAddress=${address}&mailsPerPage=1&minTimestamp=0&maxTimestamp=${Date.now() / 1000}`)).json();
    if (!mail["totalMails"]) {await timeout(2000);continue;}
    let email = await (await fetch(`https://api.xitroo.com/v1/mail?locale=en&id=${mail.mails[0]._id}`)).json()
    return atob(email["bodyHtmlStrict"])
    }
  }
  
  export async function prompt(ask:string) {
    const rl = readline.createInterface({ input, output });
    let res = await rl.question(ask);
    rl.close();
    return res;
  }
  