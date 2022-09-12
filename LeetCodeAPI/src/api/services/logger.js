import { transports as _transports, format as _format } from 'winston';
import { logger } from 'express-winston';
const app = require('express')();

import router from './my-express-router';
app.use(
    logger({
        transports: [new _transports.Console()],
        format: _format.combine(_format.colorize(), _format.json()),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) {
            return false;
        }, // optional: allows to skip some log messages based on request and/or response
    })
);

app.use(router); // notice how the router goes after the logger.
