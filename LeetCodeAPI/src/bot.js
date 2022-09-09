const http = require('http');
const express = require('express');


http.get(`https://leetcode.com/api/problems/all/`, (req, res) => {
    req.headers['Content-Type'] = 'application/json';
    req.headers['Cookie']
 });