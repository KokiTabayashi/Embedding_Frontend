require('dotenv').config()
const PORT = process.env.PORT_BACKEND || 8080;

const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'frontend-react-app/build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend-react-app/build', 'index.html'));
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
