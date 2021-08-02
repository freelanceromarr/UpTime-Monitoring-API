/*
*
*   Title : Server file
*   Description: Server related all staffs
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 02/08/2021
*
*/

//Dependencies
const http = require('http');
const {handelReqRes} = require('../helpers/handleReqRes');
const environment = require('../environment'); 
// server module - scaffolding
const server = {}
// Create Server
server.createServer = ()=>{
    const startServer = http.createServer(server.handleRequest);
    startServer.listen(environment.port, ()=>{
        console.log(`Listening at ${environment.port}` );
    })
}
// Handle Request Response

server.handleRequest = handelReqRes;
//Start Server
server.init =()=>{
    server.createServer();
}

module.exports = server;