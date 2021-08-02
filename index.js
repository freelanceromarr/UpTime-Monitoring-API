/*
*
*   Title : Uptime Monitoring Application
*   Description: A RESTful API to monitor up or down time of user defined links
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 02/07/2021
*
*/

//Dependencies
const server = require('./lib/server')
const worker = require('./lib/worker')
// app object - scaffolding
const app = {}

// Create Server
app.init = ()=>{
    server.init()
    worker.init()
}


app.init()