// Modules Imports
const settings = require("./api-settings.json");
const http = require("http");
const express = require("express");
const url = "http://leetcode.com/api/problems/all/";

// Save session on a local variable
let session = settings.LEETCODE_SESSION;

function getUserData() {
    let data = '';
    http.get(url, (res) => {
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(data);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports.getUserData = getUserData;

