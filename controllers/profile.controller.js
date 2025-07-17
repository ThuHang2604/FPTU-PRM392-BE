const db = require('../models');
const User = db.User; 

// Get profile info
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['UserID', 'Username', 'Email', 'PhoneNumber', 'Address']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('req.user:', req.user);

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Edit profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, phoneNumber, address } = req.body;

    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update new info
    user.Username = username || user.Username;
    user.Email = email || user.Email;
    user.PhoneNumber = phoneNumber || user.PhoneNumber;
    user.Address = address || user.Address;

    // save database
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

