/*
 *
 *   Title : user Controller
 *   Description: user controller for user route
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 13/07/2021
 *
 */
// dependencises
const data = require("../lib/database");
const {makeHash, parsedJSON} = require("../helpers/utitities");
const tokenHandler = require("./tokenController");
// module scaffolding
const controller = {};

controller.userController = (request, callback) => {
  const permittedMethods = ["get", "post", "put", "delete"];
  if (permittedMethods.indexOf(request.method) > -1) {
    controller._userMethodHandler[request.method](request, callback);
  } else {
    callback(405);
  }
};
// method scaffolding
controller._userMethodHandler = {};
// get method
controller._userMethodHandler.get = (request, callback) => {
  callback(200, { message: request });
};
// post method function
controller._userMethodHandler.post = (request, callback) => {
  console.log(request);
  const fName =
    typeof request.body.fName === "string" &&
    request.body.fName.trim().length > 0
      ? request.body.fName
      : false;
  const lName =
    typeof request.body.lName === "string" &&
    request.body.lName.trim().length > 0
      ? request.body.lName
      : false;
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
  const tosAgreement = typeof request.body.tosAgreement === "boolean"
    ? request.body.tosAgreement
    : false;
  console.log(tosAgreement);
  if (fName && lName && phone && password && tosAgreement) {
    // checking user authentification for insert new user
    data.readfile('user', phone, (err1, user)=>{
      if (err1) {
        //next step I mean create file
        let userData = {
          fName,
          lName,
          phone,
          password : makeHash(password),
          tosAgreement,
         
        }
        data.createfile('user', phone, userData, (err2)=>{
          if (!err2) {
            callback(200, {message: 'user created successfully'})
          }
          else{
            callback(500, {error: 'something wrong in server side'})
          }
        })
      }
      else {
        callback(500, {error: "someting wrong in server side"})
      }
    })
  } else {
    callback(400, { error: " err1 something is wrong" });
  }
};

//querystring
controller._userMethodHandler.get =(request, callback)=>{
  const phone = typeof request.queryString.phone === "string" 
  && request.queryString.phone.trim().length == 11 
  ? request.queryString.phone 
  :false;

  if (phone) {
    //need verify token first

  const token = typeof request.headersObject.token === "string" && request.headersObject.token.trim().length ==20
  ?request.headersObject.token : false;

  tokenHandler._tokenverify(token, phone, (tokenId)=>{
    if (tokenId) {
      data.readfile('user', phone, (err, user)=>{
        if (!err && user) {
          const userdata= {... parsedJSON(user)}
          delete userdata.password;
          callback(200, { message: userdata})
        }
        else {
          callback(404, {error: 'user not found'})
        }
      })
    }
    else {
      callback(403, {error: 'Authentication failed'});
    }
  })

    
  }
  else{callback(400, {error: 'phone not found'})}
}
// put method function
controller._userMethodHandler.put = (request, callback)=>{
  const fName = typeof request.body.fName === 'string' && request.body.fName.trim().length > 0
  ? request.body.fName : false;

  const lName = typeof request.body.lName === 'string' && request.body.lName.trim().length > 0
  ? request.body.lName : false;

  const password = typeof request.body.password === 'string' && request.body.password.trim().length > 0
  ? request.body.password : false;

  const phone = typeof request.body.phone === 'string' && request.body.phone.trim().length == 11
  ? request.body.phone : false;

  if (phone) {
    const token = typeof request.headersObject.token === "string" && request.headersObject.token.trim().length ==20
  ?request.headersObject.token : false;
  
  tokenHandler._tokenverify(token, phone, (tokenId)=>{
    if(tokenId){
      if (fName || lName || password) {
        data.readfile( 'user', phone, (err, udata) => {
          if (!err && udata) {
            const userdata = {...parsedJSON(udata)}
            if (fName) {
              userdata.fName = fName
            }
            if (lName) {
              userdata.lName = lName
            }
            if (password) {
              userdata.password = makeHash(password)
            }
            data.update('user', phone, userdata, (err1)=>{
              if (!err1) {
                callback(200, {message: 'successfully updated'})
              }
              else{callback(500, {error:'server error happen'})}
            })
          }
          else {callback(400, {err: 'you did someting wrong'})}
        })
    }
    }
    else {
      callback(403, {error: 'Authentication failed'});
    }
  })

   
  }
  else{callback(400, {error: 'invalid phone number'})}
  

}
// delete method function

controller._userMethodHandler.delete = (request, callback)=>{
  const phone = typeof request.queryString.phone === 'string' && request.queryString.phone.trim().length == 11
  ? request.queryString.phone : false
  
  if (phone) {
    const token = typeof request.headersObject.token === "string" && request.headersObject.token.trim().length ==20
    ?request.headersObject.token : false;
    
    tokenHandler._tokenverify(token, phone, (tokenId)=>{
      if(tokenId){    data.readfile('user', phone, (err, udata)=>{
        if (!err && data) {
          data.delete('user', phone, (err)=>{
            if (!err){
              callback(200, {message: 'successfully deleted'})
            }
            else {callback(500, {error: 'server error'})}
          })
        }
        else{callback(500, {error: 'server error found'})}
      })
    }else {
      callback(403, {error: 'Authentication failed'});
    }

    })


  }
  else{callback(400, {err: 'phone does not exist'})}
}
module.exports = controller;
