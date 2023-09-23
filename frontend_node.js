const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT_BACKEND || 8080;

const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'frontend-react-app/build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend-react-app/build', 'index.html'));
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
