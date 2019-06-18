const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const jwt = require('jsonwebtoken');



// JWT middleware
function is_admin(req, res, next) {
    let token = req.get('Authorization');
    console.log(token);

    if (token) {
        var decoded = jwt.decode(token, { complete: true });
        console.log(decoded);
        jwt.verify(token, 'secret', (err, response) => {
            if (err) {
                return res.send({
                    name: 'JsonWebTokenError',
                    message: 'jwt malformed'
                });
            } else {
                User.findOne({ email: decoded.payload.email }, (err, user) => {
                    if (err) res.send(err);
                    if (user) {
                        console.log(user);
                        if (user.roles === 'admin') {
                            req.user = user.email
                            next();
                        } else {
                            return res.send({ message: 'Unauthorized' })
                        }
                    } else {
                        return res.send({ message: "User not found" })
                    }
                })
            }
        })
    } else {
        return res.status(403).send({ message: "Missing Token" })
    }
}


// API for login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
        User.findOne({ email: email }, (err, user) => {
            if (err) res.send(err);
            bcrypt.compare(password, user.password, (err, response) => {
                if (response == true) {
                    jwt.sign({ email: user.email }, 'secret', { expiresIn: 60 * 10 }, (err, token) => {
                        console.log(err, token);
                        if (err) throw err;
                        return res.send({ user: user.email, token: token });
                    })
                } else {
                    res.send({ message: "Password Mismatch" })
                }
            })
        })
    } else {
        res.send({ message: "Fill in all fields" });
    }
});

// API for registration
router.post('/register', is_admin, (req, res, next) => {
    const { email, password, roles } = req.body;

    User.findOne({ email: email })
        .then(e => {
            if (e) {
                res.status(200).send({ message: "Email already exists" })
            } else {
                const newUser = new User({
                    email, password, roles
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            res.send(err)
                        } else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(re => res.send("User created"))
                                .catch(err => res.send(err));
                        }
                    })
                })
            }
        })
});

module.exports = router;