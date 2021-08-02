/*
 *
 *   Title : Notication helper function
 *   Description: For notyfying user when their website will be down.
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 01/07/2021
 *
 */

//Dependencies
    const https = require('https')
    const {twilo} = require('../environment');
    const querystring = require('querystring');
// Module Scaffolding
const notification = {};

notification.twilosmsSend = (userphone, usermessage, callback) => {
     const phone = typeof userphone === 'string' && userphone.trim().length == 11
     ?userphone.trim(): false;
     const message = typeof usermessage === 'string' && usermessage.trim().length <=1600
     ?usermessage :false;

     if(phone && message) {
         //user payload
        const payload = {
            From    : twilo.phone,
            To      : `+88${phone}`,
            Body    : message
        }
        const stringifiedPayload = querystring.stringify(payload)
        // https details
        console.log(stringifiedPayload);
        const httpsDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `2010-04-01/Accounts/${twilo.accountSID}/Messages.json`,
            auth:`${twilo.accountSID}:${twilo.authToken}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }
     const req = https.request(httpsDetails, (res) => {

            const status = res.statusCode;
            if (status===200 || status=== 201 || status===300 || status===301) {
                callback(false)
            }
            else {callback(`error status code is ${status}`)}
        }) 
        req.on('error', (err) => {
            callback(err)
        })
        req.write(stringifiedPayload)
        req.end()     
     }
     else {callback('invalid parameters given')}

     
}

module.exports = notification;