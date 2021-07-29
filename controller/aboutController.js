/*
 *
 *   Title : About Controller
 *   Description: about controller
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 03/07/2021
 *
 */

// module scaffolding
const controller = {};

controller.aboutController = (request, callback) => {
    console.log(request);
    callback(200, { message: 'I am about us page speaking' });
};

module.exports = controller;
