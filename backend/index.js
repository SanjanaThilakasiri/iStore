require('dotenv').config();

const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { type } = require("os");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentRoutes = require('./Routes/paymentRoutes');


app.use(express.json());
app.use(cors());
app.use('/api/payment', paymentRoutes);

// Create invoices directory if it doesn't exist
const invoicesDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

// Serve static files for invoices
app.use('/invoices', express.static('invoices'));

//Database connection with MongoDB
mongoose.connect("");

//API Creation
app.get("/",(req,res)=>{
    res.send("Express app is running");
});

//Image Storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({storage:storage});

// Upload endpoint for images
app.use('/images',express.static('upload/images'));

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
});

// endpoint for multiple image uploads
const multipleUpload = multer({storage: storage}).array('productImages', 4); // Allow up to 4 images

app.post("/uploadmultiple", multipleUpload, (req, res) => {
    const imageUrls = req.files.map(file => {
        return `http://localhost:${port}/images/${file.filename}`;
    });
    
    res.json({
        success: 1,
        image_urls: imageUrls
    });
});

//Schema for Creating Products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"",    // Adding description field
    },
    images: {
        type: [String],  // Array of strings for multiple image URLs
        required: true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    color:{
        type:String,
        required:true,
        default:"",
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    }
});

// Schema for Payment History (updated with invoice path)
const PaymentHistory = mongoose.model("PaymentHistory", {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    cartItems: [{
        productId: {
            type: Number,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'LKR',
    },
    paymentIntentId: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'canceled'],
        default: 'pending',
    },
    cardDetails: {
        brand: String,
        last4: String,
        exp_month: Number,
        exp_year: Number,
    },
    billingAddress: {
        name: String,
        email: String,
        phone: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postal_code: String,
            country: String,
        }
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true,
    },
    invoicePath: {
        type: String,
        default: null
    }
});
// creating middleware to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please login"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"please login"})
        }
    }
};

// API endpoint to get user profile data

app.post('/userprofile', fetchUser, async(req, res) => {
    try {
        const user = await Users.findOne({_id: req.user.id}).select('-password -cartData');
        
        if (!user) {
            return res.status(404).json({success: false, errors: "User not found"});
        }
        
        console.log("User profile data fetched for:", user.email);
        res.json({
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                address: user.address,
                date: user.date
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});

// Update user profile endpoint
app.post('/updateprofile', fetchUser, async(req, res) => {
    try {
        const { name, email, mobileNumber, address } = req.body;
        
        const updatedUser = await Users.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email,
                mobileNumber,
                address
            },
            { new: true }
        ).select('-password -cartData');

        if (!updatedUser) {
            return res.status(404).json({success: false, errors: "User not found"});
        }

        res.json({success: true, user: updatedUser, message: "Profile updated successfully"});
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});



//API for adding Products
app.post('/addproducts', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    // If images array is provided, use it; otherwise, create an array with the single image
    const images = req.body.images || [req.body.image];
    const product= new Product({
        id:id,
        name:req.body.name,
        description: req.body.description || "", // Handle description field
        image:req.body.image,
        images: images,
        category:req.body.category,
        price:req.body.price,
        color:req.body.color,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
});

//Creating API for deleting products
app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Product Removed");
    res.json({
        success:true,
        name:req.body.name
    })
});

//Creating API for getting all products
app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
});

//Schema creating for user model
const Users = mongoose.model('Users',{
name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },

    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

//Creating endpoint for registering User
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ 
                success: false, 
                errors: "User already exists with this email address" 
            });
        }

        // Validate required fields
        const { username, email, password, mobileNumber, address } = req.body;

        if (!username || !email || !password || !mobileNumber || !address) {
            return res.status(400).json({ 
                success: false, 
                errors: "All fields are required" 
            });
        }

        // Validate address fields
        const { street, city, district, province } = address;
        if (!street || !city || !district || !province) {
            return res.status(400).json({ 
                success: false, 
                errors: "Complete address information is required" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                errors: "Please enter a valid email address" 
            });
        }

        // Validate mobile number (basic validation)
        const mobileRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!mobileRegex.test(mobileNumber)) {
            return res.status(400).json({ 
                success: false, 
                errors: "Please enter a valid mobile number" 
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                errors: "Password must be at least 6 characters long" 
            });
        }

        // Initialize empty cart
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: username,
            email: email,
            password: password,
            mobileNumber: mobileNumber,
            address: {
                street: street,
                city: city,
                district: district,
                province: province,
            },
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({ 
            success: true, 
            token: token,
            message: "Account created successfully!" 
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ 
            success: false, 
            errors: "Server error. Please try again later." 
        });
    }
});

//Creating endpoint for user Login
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(data, 'secret_ecom');
                res.json({ 
                    success: true, 
                    token: token,
                    message: "Login successful!" 
                });
            } else {
                res.json({ 
                    success: false, 
                    errors: "Incorrect password" 
                });
            }
        } else {
            res.json({ 
                success: false, 
                errors: "No account found with this email address" 
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ 
            success: false, 
            errors: "Server error. Please try again later." 
        });
    }
});


//Creating endpoint for new products
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(-4);
    console.log("New Collection Fetched");
    res.send(newcollection);
});

//Creating endpoint for latest arrivals
app.get('/latestarivals',async (req,res)=>{
    let products = await Product.find({category:"iphone"})
    let latest_arivals = products.slice(0,4);
    console.log("Latest Arrivals Fetched");
    res.send(latest_arivals)
});



//Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added ",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
});

//creating endpoint for remove product from cart
app.post('/removefromcart',fetchUser, async(req,res)=>{
    console.log("Removed ",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
});

//Creating endpoint for get cartdata
app.post('/getcart', fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
});

// Helper function to generate order number
function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
}



// PDF Generation Function
function generateInvoicePDF(paymentData, filePath) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // -------------------- Header --------------------
            doc.fontSize(20).text('iStore Invoice', 50, 50);

            doc.fontSize(10)
                .text(`Order Number: ${paymentData.orderNumber}`, 200, 50)
                .text(`Date: ${new Date(paymentData.paymentDate).toLocaleDateString()}`, 400, 65)
                .text(`Payment Status: ${paymentData.paymentStatus.toUpperCase()}`, 400, 80);

            // -------------------- Company Info --------------------
            doc.fontSize(12).text('iStore', 50, 100);
            doc.fontSize(10)
                .text('Your Premium Apple Products Seller', 50, 115)
                .text('Email: sanjana@istore.com', 50, 130)
                .text('Phone: +94 76 73 99 858', 50, 145);

            // -------------------- Customer Info --------------------
            doc.text('Bill To:', 300, 100)
                .text(paymentData.userName, 300, 115)
                .text(paymentData.userEmail, 300, 130);

            // Billing Address (if available)
            if (paymentData.billingAddress?.address) {
                let y = 145;
                const { line1, city, state, postal_code, country } = paymentData.billingAddress.address;

                if (line1) doc.text(line1, 300, y), y += 15;
                if (city || state || postal_code) {
                    doc.text(`${city || ''}, ${state || ''} ${postal_code || ''}`, 300, y);
                    y += 15;
                }
                if (country) doc.text(country, 300, y);
            }

            // -------------------- Table Header --------------------
            const tableTop = 200;
            doc.fontSize(12)
                .text('Item', 50, tableTop)
                .text('Qty', 250, tableTop)
                .text('Price', 300, tableTop)
                .text('Total', 400, tableTop);

            doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

            // -------------------- Table Content --------------------
            let yPosition = tableTop + 30;
            let subtotal = 0;

            for (const item of paymentData.cartItems) {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                doc.fontSize(10)
                    .text(item.productName, 50, yPosition, { width: 180 })
                    .text(item.quantity.toString(), 250, yPosition)
                    .text(`${paymentData.currency} ${item.price.toFixed(2)}`, 300, yPosition)
                    .text(`${paymentData.currency} ${itemTotal.toFixed(2)}`, 400, yPosition);

                yPosition += 25;
            }

            // -------------------- Totals --------------------
            const totalsTop = yPosition + 20;
            doc.moveTo(300, totalsTop - 10).lineTo(500, totalsTop - 10).stroke();

            doc.fontSize(12)
                .text('Subtotal:', 350, totalsTop)
                .text(`${paymentData.currency} ${subtotal.toFixed(2)}`, 400, totalsTop)
                .text('Total:', 350, totalsTop + 20)
                .text(`${paymentData.currency} ${paymentData.totalAmount.toFixed(2)}`, 400, totalsTop + 20);

            // -------------------- Payment Method --------------------
            if (paymentData.cardDetails) {
                const { brand, last4 } = paymentData.cardDetails;
                doc.fontSize(10)
                    .text('Payment Method:', 50, totalsTop + 60)
                    .text(`${brand || 'Card'} ending in ${last4 || 'XXXX'}`, 50, totalsTop + 75);
            }

            // -------------------- Footer --------------------
            doc.fontSize(8)
                .text('Thank you for your purchase!', 50, totalsTop + 120)
                .text('For support, contact us at support@istore.com', 50, totalsTop + 135);

            // Finalize PDF and resolve
            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);

        } catch (error) {
            reject(error);
        }
    });
}


// Updated savepayment endpoint with improved cart clearing logic
app.post('/savepayment', fetchUser, async(req, res) => {
    try {
        const {
            cartItems,
            totalAmount,
            currency,
            paymentIntentId,
            paymentStatus,
            cardDetails,
            billingAddress
        } = req.body;

        // Check if this payment intent has already been processed
        const existingPayment = await PaymentHistory.findOne({
            paymentIntentId: paymentIntentId
        });

        if (existingPayment) {
            console.log("Payment already exists for intent:", paymentIntentId);
            
            // Even for existing payments, ensure cart is cleared if payment was successful
            if (existingPayment.paymentStatus === 'succeeded') {
                try {
                    let cart = {};
                    for (let i = 0; i < 300; i++) {
                        cart[i] = 0;
                    }
                    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: cart});
                    console.log("Cart cleared for existing successful payment");
                } catch (cartError) {
                    console.error("Error clearing cart for existing payment:", cartError);
                }
            }
            
            return res.json({
                success: true,
                orderNumber: existingPayment.orderNumber,
                message: "Payment already processed",
                duplicate: true,
                cartCleared: existingPayment.paymentStatus === 'succeeded',
                invoiceUrl: existingPayment.invoicePath ? `http://localhost:${port}/invoices/${path.basename(existingPayment.invoicePath)}` : null
            });
        }

        // Get user details
        const user = await Users.findOne({_id: req.user.id});
        if (!user) {
            return res.status(404).json({success: false, errors: "User not found"});
        }

        // Generate unique order number
        const orderNumber = generateOrderNumber();

        // Create payment history record
        const paymentHistory = new PaymentHistory({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            cartItems: cartItems,
            totalAmount: totalAmount,
            currency: currency || 'LKR',
            paymentIntentId: paymentIntentId,
            paymentStatus: paymentStatus,
            cardDetails: cardDetails,
            billingAddress: billingAddress,
            orderNumber: orderNumber,
            paymentDate: new Date()
        });

        await paymentHistory.save();
        console.log("Payment history saved successfully");

        let invoiceUrl = null;
        let cartCleared = false;

        // Process successful payment
        if (paymentStatus === 'succeeded') {
            try {
                // Generate PDF invoice
                const invoiceFileName = `invoice_${orderNumber}.pdf`;
                const invoicePath = path.join(invoicesDir, invoiceFileName);
                
                await generateInvoicePDF(paymentHistory, invoicePath);
                
                // Update payment history with invoice path
                paymentHistory.invoicePath = invoicePath;
                await paymentHistory.save();
                
                invoiceUrl = `http://localhost:${port}/invoices/${invoiceFileName}`;
                console.log("Invoice generated successfully:", invoiceFileName);
            } catch (pdfError) {
                console.error("Error generating PDF:", pdfError);
                // Don't fail the whole operation if PDF generation fails
            }

            // Clear user's cart after successful payment - MOVED AFTER PDF GENERATION
            try {
                let cart = {};
                for (let i = 0; i < 300; i++) {
                    cart[i] = 0;
                }
                await Users.findOneAndUpdate(
                    {_id: req.user.id}, 
                    {cartData: cart},
                    {new: true} // Return updated document
                );
                cartCleared = true;
                console.log("Cart cleared successfully for user:", req.user.id);
            } catch (cartError) {
                console.error("Error clearing cart:", cartError);
                // Don't fail the whole operation if cart clearing fails
            }
        }

        console.log("Payment details saved:", orderNumber);
        res.json({
            success: true,
            orderNumber: orderNumber,
            message: "Payment details saved successfully",
            cartCleared: cartCleared,
            invoiceUrl: invoiceUrl
        });

    } catch (error) {
        console.error("Error saving payment:", error);
        
        // Handle duplicate key errors specifically
        if (error.code === 11000) {
            return res.json({
                success: false,
                errors: "Duplicate payment detected",
                duplicate: true
            });
        }
        
        res.status(500).json({success: false, errors: "Server error while saving payment"});
    }
});

// Add a separate endpoint to manually clear cart if needed
app.post('/clearcart', fetchUser, async(req, res) => {
    try {
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        
        const updatedUser = await Users.findOneAndUpdate(
            {_id: req.user.id}, 
            {cartData: cart},
            {new: true}
        );
        
        if (updatedUser) {
            console.log("Cart cleared manually for user:", req.user.id);
            res.json({success: true, message: "Cart cleared successfully"});
        } else {
            res.status(404).json({success: false, errors: "User not found"});
        }
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({success: false, errors: "Server error while clearing cart"});
    }
});
// API endpoint to download invoice by order number
app.get('/download-invoice/:orderNumber', async(req, res) => {
    try {
        const payment = await PaymentHistory.findOne({orderNumber: req.params.orderNumber});
        
        if (!payment) {
            return res.status(404).json({success: false, errors: "Order not found"});
        }
        
        if (!payment.invoicePath || !fs.existsSync(payment.invoicePath)) {
            return res.status(404).json({success: false, errors: "Invoice not found"});
        }
        
        const fileName = `invoice_${payment.orderNumber}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        const fileStream = fs.createReadStream(payment.invoicePath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error("Error downloading invoice:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});

// API endpoint to get all payment history (for admin)
app.get('/paymenthistory', async(req, res) => {
    try {
        const payments = await PaymentHistory.find({})
            .populate('userId', 'name email')
            .sort({paymentDate: -1});
        
        console.log("Payment history fetched");
        res.json({success: true, payments: payments});
    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});

// API endpoint to get payment history for a specific user
app.post('/userpaymenthistory', fetchUser, async(req, res) => {
    try {
        const payments = await PaymentHistory.find({userId: req.user.id})
            .sort({paymentDate: -1});
        
        console.log("User payment history fetched");
        res.json({success: true, payments: payments});
    } catch (error) {
        console.error("Error fetching user payment history:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});

// API endpoint to get payment details by order number
app.get('/payment/:orderNumber', async(req, res) => {
    try {
        const payment = await PaymentHistory.findOne({orderNumber: req.params.orderNumber})
            .populate('userId', 'name email');
        
        if (!payment) {
            return res.status(404).json({success: false, errors: "Payment not found"});
        }
        
        res.json({success: true, payment: payment});
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});

// API endpoint to update payment status
app.post('/updatepaymentstatus', async(req, res) => {
    try {
        const { paymentIntentId, status, cardDetails } = req.body;
        
        const updatedPayment = await PaymentHistory.findOneAndUpdate(
            {paymentIntentId: paymentIntentId},
            {
                paymentStatus: status,
                ...(cardDetails && { cardDetails: cardDetails })
            },
            {new: true}
        );
        
        if (!updatedPayment) {
            return res.status(404).json({success: false, errors: "Payment not found"});
        }
        
        console.log("Payment status updated:", paymentIntentId);
        res.json({success: true, payment: updatedPayment});
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({success: false, errors: "Server error"});
    }
});

//Payment intergration
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'LKR' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Server status
app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port);
    }
    else{
        console.log("Error "+error);
    }
});