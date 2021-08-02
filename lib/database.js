/*
*
*   Title : Database
*   Description: library for data write, read, update & delete
*   Author: Md.Omar Faruk (CoderBiz)
*   Date: 10/07/2021
*
*/

//Dependencies
const fs = require('fs');
const path = require('path');

// module scaffoldings
const datalib = {};

//file storage directory
datalib.filedir= path.join(__dirname, '/../.data/');

// function for file open 

datalib.createfile= (dir, fileName, data, callback) => {
    //open a file 
    fs.open(`${datalib.filedir+dir}/${fileName}.json`, 'wx', (err,fd) => {
        if (!err && fd) {
            //stringify the data
            const stringifiedData= JSON.stringify(data);
            //write data to opended file
            fs.writeFile(fd, stringifiedData, (err1) => {
                if (!err1) {
                    fs.close(fd, (err2) => {
                        if (!err2) {
                            callback(false)
                        }
                        else {
                            callback(`file clossing error ${err2}`)
                        }
                    });
                }
                else {
                    callback(`error for writing file ${err1}`)
                }
            })
        }
        else{
            callback(`Problem with file creating: ${err}`)
        }
    })
}

//Data read method
datalib.readfile=(dir, fileName, callback)=>{
    //fs read method
    fs.readFile(`${datalib.filedir+dir}/${fileName}.json`, 'utf8', (err, data) =>{
     
            callback(err, data)
       
    })
}


//update file
datalib.update=(dir, fileName, data, callback) =>{
    //open file]
    fs.open(`${datalib.filedir+dir}/${fileName}.json`,'r+', (err, fd)=>{
        if (!err && fd) {
           const stringifyData = JSON.stringify(data);
           fs.ftruncate(fd, (err2)=>{
               if (!err2) {
                   fs.writeFile(fd, stringifyData, (err3)=>{
                       if (!err3) {
                           fs.close(fd, (err4)=>{
                            if (!err4) {
                                callback(false)
                            }
                            else{callback(err4)}
                           });
                       }
                       else {callback(err3)}
                   })
               }
               else {callback(err2)}
           })
        }
        else {callback(err)}
    })
}

//Delete file 
datalib.delete= (dir, fileName, callback)=>{
    //delete file
    fs.unlink(`${datalib.filedir+dir}/${fileName}.json`, (err)=>{
        if (!err) {
            callback(false)
        }
        else {callback('error deleting file')}
    })
}

datalib.listing =(dir, callback)=>{
    fs.readdir(`${datalib.filedir+dir}`, (err, filenames)=>{
        if (!err && filenames && filenames.length>0) {
            let allChecks= [];
            filenames.forEach((list)=>{
                allChecks.push(list.replace('.json', ''))
                callback(false, allChecks)
            })
        }
        else{
            callback(err)
        }
    })
}
module.exports = datalib;