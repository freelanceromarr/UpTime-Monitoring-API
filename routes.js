/*
 *
 *   Title : Application routing
 *   Description: Application all routings are here.
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 03/07/2021
 *
 */

// dependencies
const { aboutController } = require('./controller/aboutController');
const { userController } = require('./controller/userController');
const { tokenController } = require('./controller/tokenController');

// route list
const routes = {
    about   : aboutController,
    user    : userController,
    token   : tokenController,
};

module.exports = routes;
