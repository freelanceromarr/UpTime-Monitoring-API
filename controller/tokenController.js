/*
 *
 *   Title : token Controller
 *   Description: token controller for token routes
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 27/07/2021
 *
 */

// dependencies
const data = require('../lib/database');
const {genToken, parsedJSON, makeHash} = require('../helpers/utitities');

// scaffoldings
const controller= {}

controller.tokenController= (request, callback) => {
    const permittedMethods = ["get", "post", "put", "delete"];
    if (permittedMethods.indexOf(request.method) > -1) {
        controller._token[request.method](request, callback)
    }
    else{callback(400, {error: 'invalid rquest'})}

}

//toker route scaffoldings
controller._token ={}

//get method from
controller._token.get = (request, callback)=>{
    const id = typeof request.queryString.id === 'string' && request.queryString.id.trim().length==20
    ? request.queryString.id : false;
    if (id) {
        data.readfile('token', id, (err, tokendata)=>{
            if (!err && tokendata) {
            const usertoken = {...parsedJSON(tokendata)}
            if (id === usertoken.id) {
                callback(200, {message: usertoken})
            }
            else{callback(400, {error:'id doesnot exist'})}
            }
            else {callback(500, {error: 'server error'})}            
        })
    }
    else{callback(404, {error: 'user not found'})}
}
//creat token and write in a file
controller._token.post = (request, callback)=>{
    const phone =
    typeof request.body.phone === "string" &&
    request.body.phone.trim().length == 11
      ? request.body.phone
      : false;
  const password =
    typeof request.body.password === "string" &&
    request.body.password.trim().length > 0
      ? request.body.password
      : false;

       if (phone && password) {
           data.readfile('user', phone, (err, udata) => {
               if(!err && udata){
                const tokenId = genToken(20)
                const expires = Date.now()+ 60*60*1000;
                const userdata= parsedJSON(udata); 
                if (phone===userdata.phone && makeHash(password) === userdata.password) {
                    //pore kaj
                    const tokenDetails ={
                        id: tokenId,
                        phone,
                        expires
                    }
                    data.createfile('token', tokenId, tokenDetails, (err2)=>{
                        if (!err2) {
                            callback(200, tokenDetails)        
                        }
                        else {callback(500, {error: 'server error'})}
                    })
                }
                else{callback(400, {error:'phone or password is wrong'})}               
               }
               else{callback(500, {error: 'file doesnot exist'})}

           })
       }
}

// token get method

controller._token.put = (request, callback)=>{
       const id = typeof request.body.id === 'string' && request.body.id.trim().length ==20
       ? request.body.id : false;
       const extendTime = typeof request.body.extendTime === 'boolean' ? request.body.extendTime :false;

       if (id && extendTime) {
        data.readfile('token', id, (err1, tokenData)=>{
            if (!err1 && tokenData) {
                //checking exting token expire time
               const userTokenData= parsedJSON(tokenData)
                if (userTokenData.expires > Date.now()) {
                    userTokenData.expires = Date.now()*60*60*1000;
                    data.update('token', id, userTokenData, (err2)=>{
                        if (!err2) {
                            callback(200, {userTokenData})
                        }
                        else {callback(500, {error: 'something wrong in server'})}
                    })
                }
                else {
                    callback(400, {message: 'token already expired'})
                    
                }
            }
            else {callback(500, {error: 'server error found'})}
        })   

       }
       else {callback(400, {error : 'something wrong in your request'})}
}
// delete token
controller._token.delete = (request, callback)=>{
       const id = typeof request.queryString.id === 'string' && request.queryString.id.trim().length ==20
       ? request.queryString.id : false;
        // console.log(request.queryString.id);
       if (id) {
           data.readfile('token', id, (err, udata)=>{
               if (!err) {
                   //delete the file
                    data.delete('token', id, (err2)=>{
                        if (!err2) {
                            callback(200, {message: 'successfully deleted'})
                        }
                        else {
                            console.log(err2);
                            callback(500, {error: 'server error happened'})}
                    })
               }
               else {callback(400, {error: 'something wrong in your request'})}
           })
       }
}
//verify token
controller._tokenverify = (id, phone, callback) => {
    data.readfile('token', id, (err, tokendata) => {
        if (!err && tokendata) {
            if (parsedJSON(tokendata).phone === phone && parsedJSON(tokendata).expires > Date.now()) {
                callback(true)
            }
            else{callback(false)}
        }
        else{callback(false)}
    })
}

module.exports = controller;