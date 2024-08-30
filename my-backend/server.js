const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure key

// Middleware
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:4200', // Adjust this to match your Angular app's URL
    credentials: true
}));

// MongoDB Connection
const mongoURI = 'mongodb+srv://bhanudb:bhanudb@ecommerce.ugrcsly.mongodb.net/capestoneDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }]
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: false },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['laptop', 'mobile', 'electronics']
    }
}));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token is provided

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid
        console.log('Decoded User:', user); // Debug line
        req.user = user; // Ensure `user` object is attached to `req`
        next();
    });
};






// Routes
// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(400).send({ error: 'Error saving user', details: error.message });
    }
});
// In your server file (e.g., server.js)
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ email: user.email });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send({ error: 'Server error', details: error.message });
  }
});


// Login Route
// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'Email not registered' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({ error: 'Invalid password' });
        }
        // Include email in the token
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h' // Token expiry time
        });
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});


// Add Product Route
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, imageUrl, description, category } = req.body;
        if (!['laptop', 'mobile', 'electronics'].includes(category)) {
            return res.status(400).send({ error: 'Invalid category' });
        }
        const product = new Product({ name, price, imageUrl, description, category });
        const savedProduct = await product.save();
        res.status(201).send(savedProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).send({ error: 'Error adding product', details: error.message });
    }
});

// Get All Products Route
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});

// Update Product Route
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, imageUrl, description, category } = req.body;
        if (!['laptop', 'mobile', 'electronics'].includes(category)) {
            return res.status(400).send({ error: 'Invalid category' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, imageUrl, description, category }, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).send({ error: 'Error updating product', details: error.message });
    }
});

// Delete Product Route
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Add Item to Cart
app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const existingProduct = user.cart.find(item => item.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }
        await user.save();
        res.status(200).send(user.cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});

// Retrieve Cart Details
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Remove Item from Cart
app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).send(user.cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});
const orderSchema = new mongoose.Schema({
    cartProducts: [
      {
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: Number,
    email: String,
    address: String,
    paymentMethod: String,
    cardDetails: {
      cardNumber: String,
      cardExpiry: String,
      cardCVV: String
    },
    upiId: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  
  const Order = mongoose.model('Order', orderSchema);
  
  app.post('/api/checkout', async (req, res) => {
    try {
      const { cartProducts, totalAmount, email, address, paymentMethod, cardDetails, upiId } = req.body;
  
      // Validate the request data
      if (!cartProducts || !totalAmount || !email || !address || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Create a new order
      const newOrder = new Order({
        cartProducts,
        totalAmount,
        email,
        address,
        paymentMethod,
        cardDetails,
        upiId
      });
  
      // Save the order to the database
      const savedOrder = await newOrder.save();
      
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Failed to place order' });
    }
  });
  

  app.get('/api/orders/email', async (req, res) => {
    try {
      // Assuming you have user authentication and session or token to fetch orders based on email
      const email = req.query.email; // Retrieve email from query params
  
      // Fetch orders and populate product details
      const orders = await Order.find({ email: email }).exec();
      
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });





// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
