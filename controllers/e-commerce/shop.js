const Product = require('../../models/e-comerce/product');
const Cart = require('../../models/e-comerce/cart');
const Order = require("../../models/e-comerce/order");


exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: 'e-commerce/products'
      });
    })
    .catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
  console.log("here is the user");
  console.log(req.user);
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .populate("cart.items.productId")
  .execPopulate()
  .then( user => {
    const cartProducts = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts
    });
  })
  .catch( error => console.log(error));
  
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then( result => {
      console.log(result);
      res.redirect('./cart');
    })
    .catch( error => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  
  req.user.removeFromCart(prodId)
    .then( () => {
      res.redirect('./cart');
    })
    .catch(error => console.log(error));
    
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch( error => console.log(error));
  
};



exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
        
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/e-commerce/orders');
    })
    .catch(err => console.log(err));
};



exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
