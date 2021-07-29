/*
 *
 *   Title : Utilities
 *   Description: Application all utilities are here.
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 14/07/2021
 *
 */

// dependencies
const environment = require('../environment')
const crypto = require('crypto');
// module scaffolding
const utilities = {};

// parse json to object
utilities.parsedJSON = (jsonstring) => {
    let parsedmaidata = {};
    try {
        parsedmaidata = JSON.parse(jsonstring);
    } catch (error) {
        parsedmaidata = {};
    }
     return parsedmaidata;
};

utilities.makeHash = (str)=>{
    if (typeof str === 'string' && str.length >0) {
    const hmac = crypto
    .createHmac('sha256', environment.skey)
    .update(str)
    .digest('hex')
        return hmac
    }
    else{
        return false;
    }
}

utilities.genToken = (tokenlength)=>{
    let tokenstr =  typeof tokenlength === 'number' && tokenlength > 0
   ? tokenlength : false

   if (tokenstr) {
       const tokenkey = 'abcdefghijklmnopqrstuvxyz0124356789';
       let output = ''
       for (let i = 1; i <=tokenstr; i++) {
          let token = tokenkey.charAt(Math.floor(Math.random() * tokenkey.length))
          output += token;
           
       }
       return output
   }
   else {return false}

}


// module export
module.exports = utilities;
