const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// User registration (sign-up)
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created!' }))
                .catch(error => res.status(400).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error: error.message }));
};

// User login
exports.login = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                // TODO make error message not specfic
                return res.status(401).json({ message: 'User not found!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                                        // TODO make error message not specfic
                        return res.status(401).json({ message: 'Incorrect password!' });
                    }
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );
                    res.status(200).json({
                        userId: user.id,
                        token: token
                    });
                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error: error.message }));
};
