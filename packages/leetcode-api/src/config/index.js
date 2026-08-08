require('dotenv').config();

const config = {
    port: process.env.PORT || '50520',
    leetcodeSession: process.env.LEETCODE_SESSION || '',
    csrfToken: process.env.CSRF_TOKEN || ''
};

module.exports = config;
