/*
*
*   Title : worker file
*   Description: worker file for working in background
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 02/08/2021
*
*/

//Dependencies
const url = require('url');
const https = require('https');
const http = require('http');
const data= require('../lib/database');
const {parsedJSON} = require('../helpers/utitities');
const {twilosmsSend} = require('../helpers/notification')



// server module - scaffolding
const worker = {}

//init worker
worker.gatherallChecks =()=>{

    //list checks from database
    data.listing('check', (err, lists)=>{
        if (!err && lists && lists.length > 0) {
           lists.forEach(list=>{
               data.readfile('check', list, (err1, originalCheckData)=>{
                    if(!err1 && originalCheckData){
                        //validate check data
                        worker.validateCheck(parsedJSON(originalCheckData))
                    }
                    else{(console.log(`Unabale to read this ${list}`))}
               })
           })
    
        }
        else {console.log(err);}
    })
 //validate each check data
worker.validateCheck = (originalCheckData)=>{
    const realcheckdata = originalCheckData;
    if (realcheckdata && realcheckdata.checkId) {
        realcheckdata.status = typeof realcheckdata.status === 'string' && ['up', 'down'].indexOf(realcheckdata.status)
        ?realcheckdata.status : 'down';
        realcheckdata.lastChecked = typeof realcheckdata.lastChecked === 'number' && realcheckdata.lastChecked.length > 0 ? realcheckdata.lastChecked: false;

        //call performance check function
        worker.performanfceCheck(realcheckdata)
    }
    else{
                console.log('check data is missing');
     }
        }

//performance check function description
worker.performanfceCheck =(realcheckdata)=>{
    //initilize of statements
    let outcomesent = false;
    let checkoutcome = {
        error: false,
        responsesCode: false
    }
    //url parse 
    const parseurl= url.parse(realcheckdata.protocal+'://'+realcheckdata.url, true);
    const hostname= parseurl.hostname;
    const path= parseurl.path;
    //request details
    const requestDetails= {
        protocol: `${realcheckdata.protocal}:`,
        hostname: hostname,
        method: realcheckdata.method.toUpperCase(),
        path: path,
        timeout: realcheckdata.timeoutSeconds*1000
    }
    
    const protocolToUse= realcheckdata.protocal === 'http'? 'http' : 'https';
    const protocol= parseurl.protocol
    
    const req = https.request(requestDetails, (res) => {
        status = res.statusCode;
        checkoutcome.responsesCode = status;
        if (!outcomesent) {
            //next method call (processOutcome)
            worker.processOutcome(realcheckdata, checkoutcome)
            outcomesent = true;
        }

    })
    req.on('error', (err) =>{
        checkoutcome = {
            error: true,
            value: err
        }
        if (!outcomesent) {
            //next method call (processOutcome)
            worker.processOutcome(realcheckdata, checkoutcome)
            outcomesent = true;
        }

    })

    req.on('timeout', ()=>{
        checkoutcome = {
            error: true,
            value: 'timeout'
        }
        if (!outcomesent) {
            //next method call (processOutcome)
            worker.processOutcome(realcheckdata, checkoutcome)
            outcomesent = true;
        }
    })
    req.end()
}

//processoutcome method description

worker.processOutcome =(realcheckdata, checkoutcome) => {
    const newCheckData= realcheckdata;
    const state= !checkoutcome.error && checkoutcome.responsesCode && newCheckData.successCode.indexOf(checkoutcome.responsesCode)>-1
    ? 'up': 'down'

    //cehcking is alert needed?
    const alert= newCheckData.lastChecked && newCheckData.status !== state ? true : false;
    
    newCheckData.status = state;
    newCheckData.lastChecked = Date.now();
    data.update('check', newCheckData.checkId,newCheckData,(err)=>{
        if (!err) {
            if (alert) {
            //call alert function
                worker.alertuser(newCheckData)
            }
        }
        else {console.log('error happend to update check data');}
    } )
}
// alert user by sending twilio SMS message
worker.alertuser =(newCheckData)=>{
    const msg= `alert: your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocal}://${newCheckData.url} is now ${newCheckData.status} `
    twilosmsSend(newCheckData.phone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        } else {
            console.log('There was a problem sending sms to one of the user!');
        }
    })
}
//looping worker 
worker.loop= ()=>{
    setInterval(() => {
        worker.gatherallChecks()
    }, 5000);
}
}
worker.init = ()=>{
    worker.gatherallChecks()
    worker.loop()
}

module.exports = worker;