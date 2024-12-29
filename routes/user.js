const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;

// const express = require('express');
// const bcrypt = require('bcrypt');
// const User = require('../models/user');

// const router = express.Router();

// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ name, email, password: hashedPassword });

//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// module.exports = router;
