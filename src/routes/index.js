const express = require('express');
const app = express();

app.use(require('../modules/auth/routes/auth.route'));
app.use(require('../modules/profiles/routes/profile.route'));
app.use(require('../modules/users/routes/user.route'));
app.use(require('../modules/stats/routes/stat.route'));

module.exports = app;