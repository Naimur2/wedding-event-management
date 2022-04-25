const dbconfig = require("../config/dbconfig");
const db = dbconfig.connect();

const controller = {};

controller.register = async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body);
    const findUser = `SELECT * FROM users WHERE username = '${username}' or email = '${email}' or role = 'user'`;
    const query = `INSERT INTO users(username,password,email,role) VALUES('${username}','${password}','${email}','user')`;
    await db.query(findUser, async (err, result) => {
        if (err) {
            res.status(500).json({
                message: err.message,
            });
        }

        if (result.length > 0) {
            res.status(400).json({
                message: "User already exists",
            });
        } else {
            await db.query(query, (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: err.message,
                    });
                }
            });

            res.status(200).json({
                message: "User registered successfully",
            });
        }
    });
};

controller.login = async (req, res) => {
    const { email, password } = req.body;
    const findUser = `SELECT * FROM users WHERE email = '${email}' and password = '${password}'`;
    await db.query(findUser, async (err, result) => {
        if (err) {
            res.status(500).json({
                message: "User not found",
            });
        }
        if (result.length > 0) {
            delete result[0].password;

            res.status(200).json({
                message: "Successfully logged in",
                data: result[0],
            });
        } else {
            res.status(404).json({
                message: "User not found",
            });
        }
    });
};

module.exports = controller;
