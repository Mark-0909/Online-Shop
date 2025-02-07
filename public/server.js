const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
const bodyParser = require('body-parser');
app.use(express.json());

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer');
const { constants } = require('buffer');

const { Schema } = mongoose;


mongoose.connect("mongodb+srv://mark0909:mark09098866526@cluster1.zpafczw.mongodb.net/UserAccount", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.set('views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'my-app', 'views'));
app.use(express. static("uploads"))

app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.mimetype.split('/')[1]; 
    const validExtensions = ['jpg', 'png', 'jpeg']; 
    if (validExtensions.includes(extension)) {
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension); // Set the filename with the correct extension
    } else {
      cb(new Error('Invalid file extension'));
    }
  }
});
const upload = multer({ storage: storage });

const productSchema = new mongoose.Schema({
  productName: String,
  productPrice: Number,
  productType: String,
  productDescription: String,
  productImages: [{ type: String }],
  variations: [
    {
      name: String
    }
  ]
});

const Product = mongoose.model('Product', productSchema);


app.post('/loggedIn_shop/:userIdentifier', upload.array('product-images', 7),  async (req, res) => {
  try {
    const productData = {
      productName: req.body['product-name'],
      productPrice: req.body['product-price'],
      productType: req.body['product-type1'],
      productDescription: req.body['product-description'],
      productImages: req.files.map((file) => file.filename),
      variations: req.body.variations.map((variation) => ({ name: variation.name }))
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log('Product data saved:', savedProduct);
    res.redirect(`/loggedIn_shop/${req.params.userIdentifier}`);
  } catch (error) {
    console.error('Error saving product data:', error);
    res.status(500).send('Error saving product data');
  }
});


app.get('/loggedIn_shop/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const user = await User.findById(userIdentifier);

    const products = await Product.find();

    res.render('loggedIn_shop', { products, userIdentifier, username: user.username });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});



const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});


const User = mongoose.model('User', userSchema);


app.post('/registerProd1/:productId', async (req, res) => {
  try {

    const { username, email, password } = req.body;
    const productId = req.params.productId;


    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {

      return res.send(`<script>alert("Username or email already exists"); window.location.href = "/prod1/${productId}";</script>`);
    }


    const user = new User({
      username,
      email,
      password
    });


    const savedUser = await user.save();
    console.log('Registration successful');
    console.log('Saved User:', savedUser);


    const successMessage = 'Registration successful';
    const redirectUrl = `/loggedIn_prod1/${savedUser._id}/${productId}`;
    const script = `
      <script>
        alert("${successMessage}");
        window.location.href = "${redirectUrl}";
      </script>
    `;
    res.send(script);

  } catch (error) {
    console.error('Error registering user:', error);

    res.send('<script>alert("Error registering user"); window.location.href = "/prod1/${productId}";</script>');
  }
});


app.post('/loginProd1/:productId', async (req, res) => {
  try {

    const { email, password } = req.body;
    const productId = req.params.productId;


    const existingUser = await User.findOne({ email });

    if (existingUser) {

      if (password === existingUser.password) {
        const userIdentifier = existingUser.id; 
        const successMessage = 'Login successful';
        const redirectUrl = `/loggedIn_prod1/${userIdentifier}/${productId}`;
        const script = `
          <script>
            alert("${successMessage}");
            window.location.href = "${redirectUrl}";
          </script>
        `;
        res.send(script);
      } else {
       
        res.send(`<script>alert("Incorrect password"); window.location.href = "/prod1/${productId}";</script>`);
      }
    } else {
      
      res.send(`<script>alert("User not found"); window.location.href = "/prod1/${productId}";</script>`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
  
    res.send(`<script>alert("Error logging in"); window.location.href = "/prod1/${productId}";</script>`);
  }
});




app.get('/logoutprod1/:productId', (req, res) => {
  const productId = req.params.productId;

 
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      
      res.send(`<script>alert("Error logging out"); window.location.href = "/prod1/${productId}";</script>`);
    } else {
      
      res.send(`<script>alert("Logged out successfully"); window.location.href = "/prod1/${productId}";</script>`);
    }
  });
});





app.post('/registershop', async (req, res) => {
  try {
    
    const { username, email, password } = req.body;
    const productId = req.params.productId;

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
     
      return res.send(`<script>alert("Username or email already exists"); window.location.href = "/shop";</script>`);
    }

    
    const user = new User({
      username,
      email,
      password
    });

   
    const savedUser = await user.save();
    console.log('Registration successful');
    console.log('Saved User:', savedUser);

   
    const successMessage = 'Registration successful';
    const redirectUrl = `/loggedIn_shop/${savedUser._id}`;
    const script = `
      <script>
        alert("${successMessage}");
        window.location.href = "${redirectUrl}";
      </script>
    `;
    res.send(script);

  } catch (error) {
    console.error('Error registering user:', error);
    
    res.send('<script>alert("Error registering user"); window.location.href = "/shop";</script>');
  }
});


app.post('/loginshop', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const productId = req.params.productId;

   
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      
      if (password === existingUser.password) {
        const userIdentifier = existingUser.id; 
        const successMessage = 'Login successful';
        const redirectUrl = `/loggedIn_shop/${userIdentifier}`;
        const script = `
          <script>
            alert("${successMessage}");
            window.location.href = "${redirectUrl}";
          </script>
        `;
        res.send(script);
      } else {
        
        res.send(`<script>alert("Incorrect password"); window.location.href = "/shop";</script>`);
      }
    } else {
      
      res.send(`<script>alert("User not found"); window.location.href = "/shop";</script>`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    
    res.send(`<script>alert("Error logging in"); window.location.href = "/shop";</script>`);
  }
});




app.get('/logoutshop', (req, res) => {
  
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      
      res.send(`<script>alert("Error logging out"); window.location.href = "/shop";</script>`);
    } else {
     
      res.send(`<script>alert("Logged out successfully"); window.location.href = "/shop";</script>`);
    }
  });
});






app.post('/registerhome', async (req, res) => {
  try {
   
    const { username, email, password } = req.body;
    const productId = req.params.productId;

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      
      return res.send(`<script>alert("Username or email already exists"); window.location.href = "/";</script>`);
    }

    
    const user = new User({
      username,
      email,
      password
    });

   
    const savedUser = await user.save();
    console.log('Registration successful');
    console.log('Saved User:', savedUser);

    
    const successMessage = 'Registration successful';
    const redirectUrl = `/loggedIn_home/${savedUser._id}`;
    const script = `
      <script>
        alert("${successMessage}");
        window.location.href = "${redirectUrl}";
      </script>
    `;
    res.send(script);

  } catch (error) {
    console.error('Error registering user:', error);
    
    res.send('<script>alert("Error registering user"); window.location.href = "/";</script>');
  }
});


app.post('/loginhome', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const productId = req.params.productId;

   
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      
      if (password === existingUser.password) {
        const userIdentifier = existingUser.id; 
        const successMessage = 'Login successful';
        const redirectUrl = `/loggedIn_home/${userIdentifier}`;
        const script = `
          <script>
            alert("${successMessage}");
            window.location.href = "${redirectUrl}";
          </script>
        `;
        res.send(script);
      } else {
        
        res.send(`<script>alert("Incorrect password"); window.location.href = "/";</script>`);
      }
    } else {
     
      res.send(`<script>alert("User not found"); window.location.href = "/";</script>`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
 
    res.send(`<script>alert("Error logging in"); window.location.href = "/";</script>`);
  }
});




app.get('/logouthome', (req, res) => {
  
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
    
      res.send(`<script>alert("Error logging out"); window.location.href = "/";</script>`);
    } else {
      
      res.send(`<script>alert("Logged out successfully"); window.location.href = "/";</script>`);
    }
  });
});


app.post('/registersearch', async (req, res) => {
  try {
   
    const { username, email, password } = req.body;
    

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      
      return res.send(`<script>alert("Username or email already exists"); window.location.href = "/shop"}";</script>`);
    }

   
    const user = new User({
      username,
      email,
      password
    });

    
    const savedUser = await user.save();
    console.log('Registration successful');
    console.log('Saved User:', savedUser);

    
    const successMessage = 'Registration successful';
    const redirectUrl = `/loggedIn_shop/${savedUser._id}`;
    const script = `
      <script>
        alert("${successMessage}");
        window.location.href = "${redirectUrl}";
      </script>
    `;
    res.send(script);

  } catch (error) {
    console.error('Error registering user:', error);
   
    res.send('<script>alert("Error registering user"); window.location.href = "/shop";</script>');
  }
});

app.post('/loginsearch', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const query = req.params.query;

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
     
      if (password === existingUser.password) {
        const userIdentifier = existingUser.id; 
        const successMessage = 'Login successful';
        const redirectUrl = `/loggedIn_shop/${userIdentifier}`;
        const script = `
          <script>
            alert("${successMessage}");
            window.location.href = "${redirectUrl}";
          </script>
        `;
        res.send(script);
      } else {
    
        res.send(`<script>alert("Incorrect password"); window.location.href = "/shop";</script>`);
      }
    } else {
      
      res.send(`<script>alert("User not found"); window.location.href = "/shop";</script>`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    
    res.send(`<script>alert("Error logging in"); window.location.href = "/shop";</script>`);
  }
});



app.get('/logoutsearch', (req, res) => {
  const query = req.params.query;

  
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      
      res.send(`<script>alert("Error logging out"); window.location.href = "/shop";</script>`);
    } else {
      
      res.send(`<script>alert("Logged out successfully"); window.location.href = "/shop";</script>`);
    }
  });
});




app.post('/registercontacts', async (req, res) => {
  try {
    
    const { username, email, password } = req.body;
    

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      
      return res.send(`<script>alert("Username or email already exists"); window.location.href = "/contacts"}";</script>`);
    }

    
    const user = new User({
      username,
      email,
      password
    });

    
    const savedUser = await user.save();
    console.log('Registration successful');
    console.log('Saved User:', savedUser);

   
    const successMessage = 'Registration successful';
    const redirectUrl = `/loggedIn_contacts/${savedUser._id}`;
    const script = `
      <script>
        alert("${successMessage}");
        window.location.href = "${redirectUrl}";
      </script>
    `;
    res.send(script);

  } catch (error) {
    console.error('Error registering user:', error);
    
    res.send('<script>alert("Error registering user"); window.location.href = "/contacts";</script>');
  }
});

app.post('/logincontacts', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const query = req.params.query;

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
     
      if (password === existingUser.password) {
        const userIdentifier = existingUser.id; 
        const successMessage = 'Login successful';
        const redirectUrl = `/loggedIn_contacts/${userIdentifier}`;
        const script = `
          <script>
            alert("${successMessage}");
            window.location.href = "${redirectUrl}";
          </script>
        `;
        res.send(script);
      } else {
       
        res.send(`<script>alert("Incorrect password"); window.location.href = "/contacts";</script>`);
      }
    } else {
    
      res.send(`<script>alert("User not found"); window.location.href = "/contacts";</script>`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    
    res.send(`<script>alert("Error logging in"); window.location.href = "/contacts";</script>`);
  }
});



app.get('/logoutcontacts', (req, res) => {
  const query = req.params.query;

  
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      
      res.send(`<script>alert("Error logging out"); window.location.href = "/contacts";</script>`);
    } else {
      
      res.send(`<script>alert("Logged out successfully"); window.location.href = "/contacts";</script>`);
    }
  });
});




app.post('/registertrack', async (req, res) => {
  try {
   
    const { username, email, password } = req.body;
    

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      
      return res.send(`<script>alert("Username or email already exists"); window.location.href = "/track"}";</script>`);
    }

    
    const user = new User({
      username,
      email,
      password
    });

   
    const savedUser = await user.save();
    console.log('Registration successful');
    console.log('Saved User:', savedUser);

  
    const successMessage = 'Registration successful';
    const redirectUrl = `/loggedIn_track/${savedUser._id}`;
    const script = `
      <script>
        alert("${successMessage}");
        window.location.href = "${redirectUrl}";
      </script>
    `;
    res.send(script);

  } catch (error) {
    console.error('Error registering user:', error);
    
    res.send('<script>alert("Error registering user"); window.location.href = "/track";</script>');
  }
});

app.post('/logintrack', async (req, res) => {
  try {
   
    const { email, password } = req.body;
    const query = req.params.query;

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      
      if (password === existingUser.password) {
        const userIdentifier = existingUser.id; 
        const successMessage = 'Login successful';
        const redirectUrl = `/loggedIn_track/${userIdentifier}`;
        const script = `
          <script>
            alert("${successMessage}");
            window.location.href = "${redirectUrl}";
          </script>
        `;
        res.send(script);
      } else {
       
        res.send(`<script>alert("Incorrect password"); window.location.href = "/track";</script>`);
      }
    } else {
      
      res.send(`<script>alert("User not found"); window.location.href = "/track";</script>`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
   
    res.send(`<script>alert("Error logging in"); window.location.href = "/track";</script>`);
  }
});


app.get('/logouttrack', (req, res) => {
  const query = req.params.query;

  
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
     
      res.send(`<script>alert("Error logging out"); window.location.href = "/track";</script>`);
    } else {
     
      res.send(`<script>alert("Logged out successfully"); window.location.href = "/track";</script>`);
    }
  });
});






app.get('/loggedInProd1/:userIdentifier/:productId', (req, res) => {
  
  const userIdentifier = req.params.userIdentifier;
  const productId = req.params.productId;

  
 
  res.render('loggedInProd1', { userIdentifier, productId });
});





const cartItemSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Number,
  selectedOption: Number,
});


const CartItem = mongoose.model('CartItem', cartItemSchema);


app.post('/loggedIn_prod1/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const quantity = req.body['inputnum'];
  const selectedOption = parseInt(req.body['varies1']);

  try {
    
    const product = await Product.findById(productId);

    
    req.session.product = product;

   
    const cartItem = new CartItem({
      userId,
      productId,
      quantity,
      selectedOption,
    });

    
    await cartItem.save();

    
    res.send(`
      <script>
        alert('Item added to cart successfully.');
        window.location.href = '/loggedIn_prod1/${userId}/${productId}';
      </script>
    `);
  } catch (error) {
    res.status(500).send('An error occurred while adding the item to the cart.');
  }
});

app.delete('/loggedIn_cart/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;

  try {
  
    await CartItem.findByIdAndDelete(cartItemId);

    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the cart item' });
  }
});


app.get('/loggedIn_addtocart/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier; 
  const selectedOption = parseInt(req.query.selectedOption); 

  try {
    
    const user = await User.findById(userIdentifier);

   
    const cartItems = await CartItem.find({ userId: userIdentifier });

   
    const products = await Product.find();

   
    res.render('loggedIn_addtocart', { userIdentifier, username: user.username, selectedOption, cartItems, products, userId: userIdentifier, product: null });
  } catch (error) {
    res.status(500).send('An error occurred while retrieving user data.');
  }
});





app.delete('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});










app.get('/loggedInProd1/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier; 

  
  const user = await User.findById(userIdentifier);


  res.render('loggedIn_prod1', { userIdentifier, username: user.username });
});

app.get('/loggedIn_home/:userIdentifier', async (req, res) => {
  try {
    const products = await Product.find();
    const userIdentifier = req.params.userIdentifier;
    const user = await User.findById(userIdentifier);

    res.render('loggedIn_home', { products, userIdentifier: userIdentifier, username: user.username });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


app.get('/loggedIn_shop/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier; 

 
  const user = await User.findById(userIdentifier);


  res.render('loggedIn_shop', { userIdentifier, username: user.username });
});



app.get('/loggedIn_prod1/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier; 


  const user = await User.findById(userIdentifier);

  
  res.render('loggedIn_prod1', { userIdentifier, username: user.username });
});

app.get('/loggedIn_addproduct/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier; 

  
  const user = await User.findById(userIdentifier);

  
  res.render('loggedIn_addproduct', { userIdentifier, username: user.username });
});

app.get('/loggedIn_afterorder/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier; 

 
  const user = await User.findById(userIdentifier);


  res.render('loggedIn_afterorder', { userIdentifier, username: user.username });
});




const orderItemSchema = new mongoose.Schema({
  userId: String,
  cartItems: [{
    productId: String,
    selectedOptionImg: String,
    quantity: Number,
    totalPrice: Number,
    productName: String,
    productImage: String,
    productLink: String
  }],
  name: String,
  telno: String,
  region: Number,
  province: String,
  municipality: String,
  barangay: String,
  address: String
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

app.post('/loggedIn_addtocart/:userIdentifier', async (req, res) => {
  try {
    const { userIdentifier } = req.params; 
    const {
      userId,
      cartCheckbox,
      name,
      telno,
      region,
      province,
      municipality,
      barangay,
      address,
      orderImg 
    } = req.body;

    
    const selectedItems = Array.isArray(cartCheckbox) ? cartCheckbox : [cartCheckbox];

   
    const cartItems = await CartItem.find({ _id: { $in: selectedItems } });

   
    const products = await Product.find();

   
    const orderItems = [];

   
    cartItems.forEach(cartItem => {
      const { productId, selectedOption, quantity } = cartItem;
      const product = products.find(p => p._id.toString() === productId.toString());

      if (product) {
        const { productName, productPrice, productImages } = product;
        const totalPrice = productPrice * quantity;
        const selectedOptionImg = productImages[selectedOption + 3];
        const productImage = productImages[0]

        orderItems.push({
          productId,
          selectedOptionImg,
          quantity,
          totalPrice,
          productName,
          productImage, 
          productLink: `/loggedIn_prod1/${userIdentifier}/${productId}`
        });
      }
    });

    
    const orderItem = new OrderItem({
      userId,
      cartItems: orderItems,
      name,
      telno,
      region,
      province,
      municipality,
      barangay,
      address
    });

    
    await orderItem.save();

   
    await CartItem.deleteMany({ _id: { $in: selectedItems } });

    
    res.redirect(`/loggedIn_afterorder/${userId}`);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'An error occurred while placing the order.' });
  }
});









app.post('/loggedIn_buynow/:userIdentifier/:prodID', async (req, res) => {
  try {
    const { userIdentifier, prodID } = req.params;
    const {
      prodname,
      name,
      telno,
      region,
      province,
      municipality,
      barangay,
      address,
      inputnum
    } = req.body;

    const product = await Product.findById(prodID);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const selectedOption = req.body.varies1; 
let selectedOptionImg;
if (selectedOption === '1') {
  selectedOptionImg = product.productImages[4];
} else if (selectedOption === '2') {
  selectedOptionImg = product.productImages[5];
} else if (selectedOption === '3') {
  selectedOptionImg = product.productImages[6];
} else {
 
  return res.status(400).json({ error: 'Invalid selected option.' });
}
    const totalPrice = product.productPrice * inputnum;
    
    const productImage = product.productImages[0];

    const orderItem = new OrderItem({
      userId: userIdentifier,
      cartItems: [
        {
          productId: prodID,
          selectedOptionImg,
          quantity: parseInt(inputnum),
          totalPrice,
          productName: prodname,
          productImage,
          productLink: `/loggedIn_shop/${userIdentifier}/${prodID}`,
          selectedOptionImg
        }
      ],
      
      name,
      telno,
      region,
      province,
      municipality,
      barangay,
      address
    });

    await orderItem.save();

    res.redirect(`/loggedIn_afterorder/${userIdentifier}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while placing the order.' });
  }
});




app.get('/loggedIn_orders/:userIdentifier', async (req, res) => {
  const userIdentifier = req.params.userIdentifier;
  const orderId = req.params.orderId;

  try {
    
    const orderedItems = await OrderItem.find({ userId: userIdentifier });

    
    const user = await User.findById(userIdentifier);

    
    const username = user.username;

   
    res.render('loggedIn_orders', { orderedItems, username, userIdentifier, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the orders.' });
  }
});

















app.delete('/cancelOrder/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
   
    await OrderItem.findByIdAndDelete(orderId);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



app.get('/loggedIn_prod1/:userIdentifier/:productId', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const productId = req.params.productId;
    const user = await User.findById(userIdentifier);
    const product = await Product.findById(productId);

    const variationNames = product.variations.map((variation) => variation.name);
    const firstVariation = variationNames[0] ? variationNames[0].name : '';
    const secondVariation = variationNames[1] ? variationNames[1].name : '';
    const thirdVariation = variationNames[2] ? variationNames[2].name : '';

    res.render('loggedIn_prod1', {
      product,
      variationNames,
      firstVariation,
      secondVariation,
      thirdVariation,
      userIdentifier,
      username: user.username
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});
app.get('/loggedIn_buynow/:userIdentifier/:productId', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const productId = req.params.productId;
    const user = await User.findById(userIdentifier);
    const product = await Product.findById(productId);

    const variationNames = product.variations.map((variation) => variation.name);
    const firstVariation = variationNames[0] ? variationNames[0].name : '';
    const secondVariation = variationNames[1] ? variationNames[1].name : '';
    const thirdVariation = variationNames[2] ? variationNames[2].name : '';

    res.render('loggedIn_buynow', {
      product,
      variationNames,
      firstVariation,
      secondVariation,
      thirdVariation,
      userIdentifier,
      username: user.username
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});



app.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    res.render('home', { products, userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});




app.get('/shop', async (req, res) => {
  try {
    const products = await Product.find();

    res.render('shop', { products, userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.get('/contacts', async (req, res) => {
  try {
    

    res.render('contacts', {userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.get('/loggedIn_contacts/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const user = await User.findById(userIdentifier);

    res.render('loggedIn_contacts', { userIdentifier: userIdentifier, username: user.username });
  } catch (error) {
    console.error('Error: There is an error.', error);
    res.status(500).send('Error occured');
  }
});




app.get('/track', async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const matchedOrder = await OrderItem.findOne({ _id: orderId });

    res.render('track', { matchedOrder: matchedOrder });
  } catch (error) {
    console.error('Error fetching ordered items:', error);
    res.status(500).send('Error fetching ordered items');
  }
});



app.get('/loggedIn_track/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const orderId = req.query.orderId;

   
    const user = await User.findById(userIdentifier);

 
    const matchedOrder = await OrderItem.findOne({ _id: orderId});

    res.render('loggedIn_track', { matchedOrder: matchedOrder, userIdentifier: userIdentifier, username: user.username });
  } catch (error) {
    console.error('Error fetching ordered items:', error);
    res.status(500).send('Error fetching ordered items');
  }
});





const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);


app.post('/contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  
  const newMessage = new Message({
    name: name,
    email: email,
    message: message
  });

  
  newMessage.save().then(() => {
    console.log('Form data saved to MongoDB');
    
    res.send("<script>alert('Message sent.'); window.location.href='/contacts';</script>");
  }).catch((error) => {
    console.error('Error saving form data to MongoDB:', error);
    
    res.status(500).send('An error occurred');
  });
});

app.post('/loggedIn_contacts/:userIdentifier', (req, res) => {
  const userIdentifier = req.params.userIdentifier;
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  
  const newMessage = new Message({
    userIdentifier: userIdentifier,
    name: name,
    email: email,
    message: message
  });

  
  newMessage.save().then(() => {
    console.log('Form data saved to MongoDB');
    // Show alert message indicating successful submission
    res.send("<script>alert('Message sent.'); window.location.href='/loggedIn_contacts/" + userIdentifier + "';</script>");
  }).catch((error) => {
    console.error('Error saving form data to MongoDB:', error);
    // Handle the error and show an appropriate response to the user
    res.status(500).send('An error occurred');
  });
});


app.get('/laptops', async (req, res) => {
  try {
    const products = await Product.find({ productType: 'laptop' });

    res.render('laptops', { products, userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});
app.get('/phones', async (req, res) => {
  try {
    const products = await Product.find({ productType: 'phone' });

    res.render('phones', { products, userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});
app.get('/accessories', async (req, res) => {
  try {
    const products = await Product.find({ productType: 'accessory' });

    res.render('accessories', { products, userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});
app.get('/productlist', async (req, res) => {
  try {
    const products = await Product.find();

    res.render('productlist', { products, userIdentifier: null, username: null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


app.get('/prod1/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    const variationNames = product.variations.map((variation) => variation.name);
    const firstVariation = variationNames[0] || '';
    const secondVariation = variationNames[1] || '';
    const thirdVariation = variationNames[2] || '';

    res.render('prod1', {
      product,
      variationNames,
      firstVariation,
      secondVariation,
      thirdVariation
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});




app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    // Perform the search based on the query
    const products = await Product.find({ productDescription: { $regex: query, $options: 'i' } });

    res.render('search', { products, query });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).send('Error performing search');
  }
});
app.get('/loggedIn_search/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const query = req.query.query;

    // Fetch the user based on the userIdentifier
    const user = await User.findById(userIdentifier);

    // Perform the search based on the query
    const products = await Product.find({ productDescription: { $regex: query, $options: 'i' } });

    res.render('loggedIn_search', { products, query, userIdentifier, username: user.username });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).send('Error performing search');
  }
});
app.get('/loggedIn_laptops/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const user = await User.findById(userIdentifier);
    const products = await Product.find({ productType: 'laptop' });

    res.render('loggedIn_laptops', { products, userIdentifier, username: user ? user.username : null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.get('/loggedIn_phones/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const user = await User.findById(userIdentifier);
    const products = await Product.find({ productType: 'phone' });

    res.render('loggedIn_phones', { products, userIdentifier, username: user ? user.username : null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});
app.get('/loggedIn_accessories/:userIdentifier', async (req, res) => {
  try {
    const userIdentifier = req.params.userIdentifier;
    const user = await User.findById(userIdentifier);
    const products = await Product.find({ productType: 'accessory' });

    res.render('loggedIn_accessories', { products, userIdentifier, username: user ? user.username : null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
