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



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username email');
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});




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

app.post('/api/orders', (req, res) => {
    console.log('Order received:', req.body);
    res.status(200).json({ message: 'Order placed successfully!' });
});
// Order Model
// New Order Model
const NewOrder = mongoose.model('NewOrder', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productDetails: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    gst: { type: Number, required: true },
    deliveryCharges: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'card', 'cod'], required: true },
    upiId: { type: String, required: false },
    cardDetails: {
        cardNumber: { type: String, required: false },
        cardExpiry: { type: String, required: false },
        cardCvc: { type: String, required: false }
    },
    createdAt: { type: Date, default: Date.now }
}));

// New Add Order Route
app.post('/api/new-orders', authenticateToken, async (req, res) => {
    try {
      console.log('Order request body:', req.body); // Log request body
      const { productDetails, totalPrice, gst, deliveryCharges, finalAmount, paymentMethod, upiId, cardDetails } = req.body;
      const userId = req.user.userId;
  
      const newOrder = new NewOrder({
        userId,
        productDetails,
        totalPrice,
        gst,
        deliveryCharges,
        finalAmount,
        paymentMethod,
        upiId,
        cardDetails
      });
  
      const savedOrder = await newOrder.save();
      console.log('Order saved:', savedOrder); // Log saved order
  
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });
  
  






// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
