const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/Mercury-NG'));

app.get('/*', function(req, res) {
    res.sendFile(path.join('./dist/Mercury-NG/index.html'));
});

app.listen(process.env.PORT || 8080);
