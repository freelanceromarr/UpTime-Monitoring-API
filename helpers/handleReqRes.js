/*
 *
 *   Title : Handle Request & Response
 *   Description: Handeling all requests and responses
 *   Author: Md.Omar Faruk (CoderBiz)
 *   Date: 02/07/2021
 *
 */

// Dependencies

const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundController } = require('../controller/notFoundController');
const { parsedJSON } = require('./utitities');
// handeler - sacaffolding
const handler = {};

handler.handelReqRes = (req, res) => {
    // respose handle
    // get the url and parse it
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryString = parsedURL.query;
    const headersObject = req.headers;
    const allrequestPropertes = {
        parsedURL,
        path,
        trimedPath,
        method,
        queryString,
        headersObject,
    };

    const routeController = routes[trimedPath] ? routes[trimedPath] : notFoundController;
    const decoder = new StringDecoder('utf-8');
    let mainData = '';
    req.on('data', (buffer) => {
        mainData += decoder.write(buffer);
    });
    req.on('end', () => {
        mainData += decoder.end();
        // console.log('body', parsedJSON(mainData));
        allrequestPropertes.body = parsedJSON(mainData);

        routeController(allrequestPropertes, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
            const stringifiedPayload = JSON.stringify(payload);
            // return responses
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(stringifiedPayload);
        });
        // res.end('hellow world including Bangladesh');
    });
};

module.exports = handler;
