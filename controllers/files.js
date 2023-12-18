const setupEndpoints = (app) => {
    app.get('/endpoint', (req, res) => {
        // Handle GET request
        res.send('GET request to the endpoint');
    });

    app.post('/endpoint', (req, res) => {
        // Handle POST request
        res.send('POST request to the endpoint');
    });
};

module.exports = {
    setupEndpoints
};