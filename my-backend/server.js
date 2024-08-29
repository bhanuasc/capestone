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
        req.user = user;
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
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
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

const Order = mongoose.model('Order', new mongoose.Schema({
    email: { type: String, required: false }, // No longer required
    cartProducts: [{  // Assuming this structure for cart products
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }, // No longer required
        quantity: { type: Number, required: false } // No longer required
    }],
    totalAmount: { type: Number, required: false, default: 0 }, // Default to 0
    address: { type: String, required: false, default: '' }, // Default to empty string
    paymentMethod: { type: String, required: false, default: '' }, // Default to empty string
    cardDetails: {
        cardNumber: { type: String, required: false, default: '' }, // Default to empty string
        cardExpiry: { type: String, required: false, default: '' }, // Default to empty string
        cardCVV: { type: String, required: false, default: '' } // Default to empty string
    },
    upiId: { type: String, required: false, default: '' } // Default to empty string
}, { timestamps: true }));



// Save Checkout Details
// Checkout Route
// Checkout Route
app.post('/api/checkout', async (req, res) => {
    try {
        const { cartProducts, totalAmount, email, address, paymentMethod, cardDetails, upiId } = req.body;

        // Ensure cartProducts is provided
        if (!cartProducts || cartProducts.length === 0) {
            return res.status(400).send({ error: 'No products in cart' });
        }

        // Create an order with provided fields or default values
        const order = {
            cartProducts,
            totalAmount: totalAmount || 0,  // Default to 0 if not provided
            email: email || '',             // Default to empty string if not provided
            address: address || '',         // Default to empty string if not provided
            paymentMethod: paymentMethod || '', // Default to empty string if not provided
            cardDetails: cardDetails || {}, // Default to empty object if not provided
            upiId: upiId || '',             // Default to empty string if not provided
            createdAt: new Date()
        };

        // Save order to the database
        const newOrder = new Order(order);
        await newOrder.save();

        res.status(201).send(newOrder);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});










// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
