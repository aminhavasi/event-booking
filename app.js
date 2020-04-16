require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
