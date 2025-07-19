const db = require('../models');

exports.getOrderHistoryByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await db.Order.findAll({
      where: { UserID: userId },
      include: [
        {
          model: db.OrderDetail,
          include: [
            {
              model: db.Product,
              attributes: ['ProductName', 'ImageURL', 'Price'],
            },
          ],
        },
      ],
      order: [['OrderDate', 'DESC']],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
