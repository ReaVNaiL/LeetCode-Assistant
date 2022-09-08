const app = require('express')();
const PORT = 50520;

app.listen(
    PORT,
    () => console.log(`Server listening on port: ${PORT}`)
)

// Language: javascript
// Set up the API logger for each request
app.use((req, res, next) => {
    app.log(`${req.method} ${req.url == '/' ? 'https://localhost:50520/' : req.url}`);
    app.log(req.headers);
    next();
});