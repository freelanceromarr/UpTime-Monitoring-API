/*
*
*   Title : Uptime Monitoring Application
*   Description: A RESTful API to monitor up or down time of user defined links
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 02/07/2021
*
*/

//Dependencies
const http = require('http');
const {handelReqRes} = require('./helpers/handleReqRes');
const environment = require('./environment'); 
const data = require('./lib/database');
// app object - scaffolding
const app = {}

//write data in database
data.createfile('test', 'testfile', {name: "omar Faruk", age: 25}, (err) => {
    console.log(err);
})

//read data from database
data.readfile('test', 'testfile', (err, data) => {
    console.log(err,data);
})

//update data file
data.update('test', 'testfile',{name: "omar Faruk", age: 35}, (err, data) => {
    console.log(err, data);
})

//file delete 
data.delete('test', 'testfile', (err, data) => {
    console.log(err, data);
})

// Create Server
app.createServer = ()=>{
    const server = http.createServer(app.handleRequest);
    server.listen(environment.port, ()=>{
        console.log(`Listening at ${environment.port}` );
    })
}
// Handle Request Response

app.handleRequest = handelReqRes;
//Start Server

app.createServer();