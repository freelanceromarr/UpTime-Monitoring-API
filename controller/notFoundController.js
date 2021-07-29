/*
*
*   Title : Not Found Controller
*   Description: Not found controller will return not found page
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 03/07/2021
*
*/

//module scaffolding
const controller = {}

controller.notFoundController =(request, callback) => {
    callback(404, {message: 'Your requested page is not found'})
   
}

module.exports = controller;