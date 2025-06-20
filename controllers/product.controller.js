const db = require('../models');
const { Op } = require('sequelize');

const getAllProducts = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice, sortBy } = req.query;

    const whereClause = {};

    // Filter by Category
    if (categoryId) {
      whereClause.CategoryID = categoryId;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      whereClause.Price = {};
      if (minPrice) whereClause.Price[Op.gte] = minPrice;
      if (maxPrice) whereClause.Price[Op.lte] = maxPrice;
    }

    // Sort by price
    let order = [];
    if (sortBy === 'priceAsc') {
      order.push(['Price', 'ASC']);
    } else if (sortBy === 'priceDesc') {
      order.push(['Price', 'DESC']);
    // } else if (sortBy === 'newest') {
    //   order.push(['createdAt', 'DESC']);
    }

    const products = await db.Product.findAll({
      where: whereClause,
      include: {
        model: db.Category,
        as: 'category',
        attributes: ['CategoryName'],
      },
      order,
      attributes: ['ProductID', 'ProductName', 'ImageURL', 'Price', 'BriefDescription']
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.Product.findByPk(id, {
      include: {
        model: db.Category,
        as: 'category',
        attributes: ['CategoryName'],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts, getProductById
};
