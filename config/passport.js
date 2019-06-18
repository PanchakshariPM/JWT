const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../model/user');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ user: 'email' }, (email, password, done) => {
            User.findOne({ email: email }, (err, user) => {
                if (!user) {
                    return done(null, fasle, { message: "Invalid email" })
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Incorrect password" })
                    }
                })
            })
        })
    )


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}