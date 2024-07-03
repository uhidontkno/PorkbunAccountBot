// Replace the data variable with your info. The legal/whois information are not validated so you can just put in bogus.
let data = {"creds":["testingSpam123","testingSp@m1233"],"email":"spam@rare1k.dev","legal":{"firstName":"test","address":"123 Testing Lane","country":1,"city":"Test","state":4,"zipCode":"123456"},"phone":[1,"123456789"]}
document.querySelector("#tosAgreement").checked = true;
document.querySelector("#newAccountSubscribeNo").checked = true;
document.querySelector("#newAccountUsername").value = data.creds[0];
document.querySelector("#newAccountPassword").value = data.creds[1];
document.querySelector("#newAccountEmail").value = data.email;
document.querySelector("#newAccountFirstName").value = data.legal.firstName;
document.querySelector("#newAccountAddress1").value = data.legal.address;
document.querySelector("#newAccountCountry").selectedIndex = data.legal.country;
processCountry(document.querySelector("#newAccountCountry"), 'newAccountState');
document.querySelector("#newAccountCity").value = data.legal.city;
setTimeout(()=>{
    document.querySelector("#newAccountState").selectedIndex = data.legal.state;
},500)
document.querySelector("#newAccountZip").value = data.legal.zipCode;
document.querySelector("#newAccountPhoneCode").selectedIndex = data.phone[0];
document.querySelector("#newAccountPhone").value = data.phone[1];
accountCreateCheck();
