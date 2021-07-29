/*
*
*   Title : Environment configuration
*   Description: Initializing all environment value
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 10/07/2021
*
*/

//module scaffolding
const environment ={}

//staging environment
environment.staging = {
    port: 3000,
    name: 'staging',
    skey: 'djfklsdoodk'
}

//production environment
environment.production = {
    port: 8000,
    name: 'production',
    skey: 'lfjkljsldfs'
}
//current environment picking
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//environment checking
const checkEnvironment = typeof(environment[currentEnvironment]) === 'object' ? environment[currentEnvironment] : environment.staging;

//export the module
module.exports = checkEnvironment;