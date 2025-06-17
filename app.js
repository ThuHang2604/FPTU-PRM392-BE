const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('✅ FPTU-PRM392-BE is running...');
});

// Uncomment and add these when you implement them
const authRoutes = require('./routes/auth.routes');
// const productRoutes = require('./routes/productRoutes');
// const cartRoutes = require('./routes/cartRoutes');

app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);

// Load Sequelize and Models
const db = require('./models');

// Connect to DB and sync models
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');

    // Sync models (use alter: true for dev, force: true only when recreating tables)
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Models synced with DB');
  })
  .catch((err) => {
    console.error('❌ Database error:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('❌ Something broke!');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
