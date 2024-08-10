require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.APP_PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
});

app.use(require('./src/routes'));

app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;