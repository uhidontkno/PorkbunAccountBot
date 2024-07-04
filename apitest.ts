import { getLatestXitroo,getCSRFToken } from "./helper.ts"
import { JSDOM } from "jsdom";
function generateString(length:number) {
    const characters ='abcdefghijklmnopqrstuvwxyz';
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
  
      return result;
  }
function generatePassword(length:number) {
    const characters ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

async function initalSignup(username:string,email:string,csrf:string): Promise<(string | Response)[]> {
let r = await fetch("https://porkbun.com/api/user/accountCreateCheck", {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      "cookie": `csrf_pb=${csrf}`
    },
    "body": `username=${username}&email=${encodeURIComponent(email)}&country=US&isajax=true&csrf_pb=${csrf}`,
    "method": "POST"
  });
  let cookies = r.headers.getSetCookie();
  let newCsrf = ""
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith("csrf")) {newCsrf = cookies[i].split(";")[0].split("=")[1]}
  }
  return [newCsrf,r]
}
async function verifyEmail(email:string,code:string,csrf:string): Promise<(string | Response)[]> {
    let r = await fetch("https://porkbun.com/api/user/checkEmailSessionVerificationCode", {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          "cookie": `csrf_pb=${csrf}`
        },
        "body": `email=${encodeURIComponent(email)}&code=${code}&isajax=true&csrf_pb=${csrf}`,
        "method": "POST"
      });
      let cookies = r.headers.getSetCookie();
  let newCsrf = ""
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith("csrf")) {newCsrf = cookies[i].split(";")[0].split("=")[1]}
  }
  return [newCsrf,r]
}
async function signup(username:string,password:string,email:string,csrf:string): Promise<(string | Response)[]> {
    let r = await fetch("https://porkbun.com/account/login", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "content-type": "application/x-www-form-urlencoded",
          "cookie": `csrf_pb=${csrf}`
        },
        "body": `login=1&clientFingerprint=27870f8acf0b769042946002e205bafa&clientFingersha=c405078025381c5db9f8ba0d82ad27180a7600fc2b571ed956882d1cd8447305&redir=&usePasskey=0&passkeyData=&newAccountUsername=${username}&newAccountPassword=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}&emailBackup=&firstName=${generateString(12)}&lastName=&companyName=&address1=${generateString(24)}&address2=&address3=&country=US&city=Melbourne&state=Florida&zip=329${Math.floor(Math.random()*99)}&phoneCode=1%3AUS&phone=%28321%29+${Math.floor(Math.random()*999)}-1${Math.floor(Math.random()*999)}&tosAgreement=YES&newAccountSubscribe=NO&csrf_pb=${csrf}`,
        "method": "POST"
      });
      let cookies = r.headers.getSetCookie();
      let newCsrf = ""
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("csrf")) {newCsrf = cookies[i].split(";")[0].split("=")[1]}
      }
      return [newCsrf,r]
}

let csrf = await getCSRFToken();
let email = `spam${generateString(10)}@xitroo.com`;
let creds = [generateString(12),generatePassword(12)]
let initial = await initalSignup(creds[0],email,csrf || "");
csrf = String(initial[0]);
// @ts-expect-error
console.log(initial[1].status,await initial[1].text())
let em = await getLatestXitroo(email);
let emDoc = new JSDOM(em).window.document;
let code = emDoc.querySelector("p")?.textContent?.split("verification code is:")[1];
// @ts-expect-error
let emailVerif = await verifyEmail(email,code,csrf || "");
csrf = String(emailVerif[0]);
// @ts-expect-error
console.log(code,emailVerif[1].status,await emailVerif[1].text())
let created = await signup(creds[0],creds[1],email,csrf)
// @ts-expect-error
console.log(created[1].redirected)