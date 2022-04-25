const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbconfig = require('./config/dbconfig');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

dbconfig.connect();


app.use('/auth', require('./routes/auth-route'));

const errorHandler = (err, req, res, next) => {
    if (err.headerSent) {
        return next(err);
    }
    res.status(500).json({
        message: err.message,
    });
};


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
