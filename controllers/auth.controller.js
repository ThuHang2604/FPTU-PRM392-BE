const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

exports.register = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ where: { Username: username } });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      Username: username,
      PasswordHash: hashedPassword,
      Email: email,
      PhoneNumber: phoneNumber,
      Address: address,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.UserID });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { Username: username } });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    // Generate token
    const token = jwt.sign(
      { userId: user.UserID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
