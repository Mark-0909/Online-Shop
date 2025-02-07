const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB Atlas
mongoose
  .connect("mongodb+srv://mark0909:mark09098866526@cluster1.zpafczw.mongodb.net/ProductCollection", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define a schema for the product data
// Define route for handling the product form submission
app.post('/products', upload.array('product-images', 4), (req, res) => {
  const productData = {
    productName: req.body['product-name'],
    productPrice: req.body['product-price'],
    productType: req.body['product-type1'],
    productDescription: req.body['product-description'],
    productImages: req.files.map((file) => file.path)
  };

  // Create a new product document using the model
  const product = new Product(productData);

  // Save the product document to the database
  product.save()
    .then((savedProduct) => {
      console.log('Product data saved:', savedProduct);
      res.send({ message: 'Product data saved successfully!', product: savedProduct });

      // Show an alert notification
      res.send('<script>alert("Product data saved successfully!");</script>');
    })
    .catch((error) => {
      console.error('Error saving product data:', error);
      res.status(500).send('Error saving product data');
    });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
