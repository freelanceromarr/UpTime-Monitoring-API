/*
 *
 *   Title : check Controller
 *   Description: check controller for check route
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 30/07/2021
 *
 */
// dependencises
const data = require("../lib/database");
const {genToken, parsedJSON} = require("../helpers/utitities");
const tokenHandler = require("./tokenController");
// module scaffolding
const controller = {};

controller.checkController = (request, callback) => {
  const permittedMethods = ["get", "post", "put", "delete"];
  if (permittedMethods.indexOf(request.method) > -1) {
    controller._check[request.method](request, callback);
  } else {
    callback(405);
  }
};
// method scaffolding
controller._check = {};
// get method
controller._check.get = (request, callback) => {
};
// post method function
controller._check.post = (request, callback) => {
    const protocal = typeof request.body.protocal === "string" 
    && request.body.protocal.trim().length >0 
    && ['http', 'https'].indexOf(request.body.protocal) > -1
    ? request.body.protocal : false;
    const url = typeof request.body.url === 'string'
    && request.body.url.trim().length >0
    ? request.body.url : false;
    const method = typeof request.body.method === 'string'
    && request.body.method.trim().length >0
    && ["get", "post", "put", "delete"].indexOf(request.body.method) > -1
    ? request.body.method : false;
    const successCode = typeof request.body.successCode === 'object'
    && request.body.successCode instanceof Array ? request.body.successCode: false;
    const timeoutSeconds = typeof request.body.timeoutSeconds === 'number'
    && request.body.timeoutSeconds>1 && request.body.timeoutSeconds <6
    && request.body.timeoutSeconds % 1 ==0
    ?request.body.timeoutSeconds : false;

    if (protocal && url && method && successCode && timeoutSeconds) {
        // storing data for cehcking user wbsite url
        const token = typeof request.headersObject.token === "string" && request.headersObject.token.trim().length ==20
        ?request.headersObject.token : false;
        data.readfile('token', token, (err, tokendata) => {
            const usertokendata = parsedJSON(tokendata)
            tokenHandler._tokenverify(token, usertokendata.phone, (tokenId)=>{
                if (tokenId) {
            
                    
                    data.readfile('user', usertokendata.phone, (err2, udata)=>{
                        if (!err2 && udata) {
                            const checkId = genToken(20)
                            const userdata= parsedJSON(udata)
                            const checkObject = {
                                checkId,
                                protocal,
                                url,
                                method,
                                successCode,
                                timeoutSeconds,
                                phone: userdata.phone
                            }
                            const UsercheckObject= typeof userdata.check ==='object' && userdata.check instanceof Array ? userdata.check : []
                           if (UsercheckObject.length < 5) {
                               data.createfile('check', checkId, checkObject, (err3)=>{
                                   if (!err3) {
                                       userdata.check = UsercheckObject;
                                       userdata.check.push(checkId);
                                       data.update('user', userdata.phone, userdata, (err4)=>{
                                           if (!err4) {
                                               callback(200, {message: checkObject})
                                           }
                                           else {callback(500, {error:"user file updating error "})}
                                       })
                                   }
                                   else {callback(500, {error:"checklist creating errot"})}
                               })
                           }
                           else {callback(400, {error: 'you reached your maximum limit'})}
                        }
                        else {callback(500, {error: 'user file reading error found'})}
                    })

                }
                else {callback(403, {error:'authentication error'})}
            })
        })

    }
    else{callback(400, {error: 'something wrong in your request'})}
};

//querystring
// controller._check.get =(request, callback)=>{

// }
// put method function
controller._check.put = (request, callback)=>{
  

}
// delete method function

controller._check.delete = (request, callback)=>{

}
module.exports = controller;
