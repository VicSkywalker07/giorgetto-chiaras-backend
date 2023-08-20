const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");

//for products
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});
const upload = multer({ storage: storage });

//for users
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});
const upload2 = multer({ storage: storage2 });

async function verifyAdmin(req, res, next) {
  var token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_ADMIN_KEY, (error) => {
    if (error)
      res.status(401).send({
        result: "fail",
        message: "you are not authorised to access this API",
      });
    else next();
  });
}
async function verifyBuyer(req, res, next) {
  var token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_BUYER_KEY, (error) => {
    if (error)
      res.status(401).send({
        result: "fail",
        message: "you are not authorised to access this API",
      });
    else next();
  });
}

async function verifyUser(req, res, next) {
  var token = req.headers.authorization;
  var flag = flase;
  jwt.verify(token, process.env.JWT_BUYER_KEY, (error) => {
    if (!error) flag = true;
  });
  if (flag === false) {
    jwt.verify(token, process.env.JWT_ADMIN_KEY, (error) => {
      if (!error) flag = true;
    });
  }
  if (flag) next();
  else
    res.status(401).send({
      result: "fail",
      message: "you are not authorised to access this API",
    });
}

const {
  getAllMainCategory,
  createMainCategory,
  getSingleMainCategory,
  updateMainCategory,
  deleteMainCategory,
} = require("../Controllers/MainCategoryController");
const {
  getAllSubCategory,
  createSubCategory,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../Controllers/SubCategoryController");
const {
  getAllBrand,
  createBrand,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} = require("../Controllers/BrandController");

const {
  getAllProduct,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} = require("../Controllers/ProductController");
const {
  getAllUser,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  login,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("../Controllers/UserController");
const {
  getAllCart,
  createCart,
  getSingleCart,
  updateCart,
  deleteCart,
} = require("../Controllers/CartController");
const {
  createWishlist,
  deleteWishlist,
  getAllWishlist,
} = require("../Controllers/WishlistController");
const {
  createCheckout,
  getAllCheckout,
  getSingleCheckout,
  updateCheckout,
  deleteCheckout,
  getAllUserCheckout,
} = require("../Controllers/CheckoutController");
const {
  getAllContact,
  createContact,
  getSingleContact,
  updateContact,
  deleteContact,
} = require("../Controllers/ContactController");

const router = new express.Router();

router
  .route("/maincategory")
  .get(getAllMainCategory)
  .post(verifyAdmin, createMainCategory);
router
  .route("/maincategory/:_id")
  .get(getSingleMainCategory)
  .put(verifyAdmin, updateMainCategory)
  .delete(verifyAdmin, deleteMainCategory);

router
  .route("/subcategory")
  .get(getAllSubCategory)
  .post(verifyAdmin, createSubCategory);
router
  .route("/subcategory/:_id")
  .get(getSingleSubCategory)
  .put(verifyAdmin, updateSubCategory)
  .delete(verifyAdmin, deleteSubCategory);

router.route("/brand").get(getAllBrand).post(verifyAdmin, createBrand);
router
  .route("/brand/:_id")
  .get(getSingleBrand)
  .put(verifyAdmin, updateBrand)
  .delete(verifyAdmin, deleteBrand);

router.route("/cart").post(verifyBuyer, createCart);
router
  .route("/cart/:_id")
  .get(verifyBuyer, getSingleCart)
  .put(verifyBuyer, updateCart)
  .delete(verifyBuyer, deleteCart);

router.route("/cart/user/:userid").get(verifyBuyer, getAllCart);

// router.post(
//   "/products",
//   upload.fields([
//     { name: "pic1", mxCount: 1 },
//     { name: "pic2", mxCount: 1 },
//     { name: "pic3", mxCount: 1 },
//     { name: "pic4", mxCount: 1 },
//   ]),
//   createProduct
// );

router
  .route("/products")
  .get(getAllProduct)
  .post(
    verifyAdmin,
    upload.fields([
      { name: "pic1", mxCount: 1 },
      { name: "pic2", mxCount: 1 },
      { name: "pic3", mxCount: 1 },
      { name: "pic4", mxCount: 1 },
    ]),
    createProduct
  );
router
  .route("/products/:_id")
  .get(getSingleProduct)
  .put(
    verifyAdmin,
    upload.fields([
      { name: "pic1", mxCount: 1 },
      { name: "pic2", mxCount: 1 },
      { name: "pic3", mxCount: 1 },
      { name: "pic4", mxCount: 1 },
    ]),
    updateProduct
  )
  .delete(verifyAdmin, deleteProduct);
router.route("/products/search").post(searchProduct);

router
  .route("/user")
  .get(verifyAdmin, getAllUser)
  .post(upload2.single("pic"), createUser);
router
  .route("/user/:_id")
  .get(verifyUser, getSingleUser)
  .put(verifyUser, upload2.single("pic"), updateUser)
  .delete(verifyAdmin, deleteUser);

router.route("/user/forget").post(forgetPassword);
router.route("/user/verify-otp").post(verifyOtp);
router.route("/user/reset-password").post(resetPassword);
router.route("/user/login").post(login);

router.route("/wishlist").post(verifyBuyer, createWishlist);
router.route("/wishlist/:_id").delete(verifyBuyer, deleteWishlist);
router.route("/wishlist/:userid").get(verifyBuyer, getAllWishlist);

router
  .route("/checkout")
  .get(verifyAdmin, getAllCheckout)
  .post(verifyBuyer, createCheckout);
router
  .route("/checkout/:_id")
  .put(verifyAdmin, updateCheckout)
  .delete(verifyAdmin, deleteCheckout);
router.route("/checkout/:userid").get(verifyBuyer, getAllUserCheckout);
router.route("/checkout/single/:_id").get(verifyAdmin, getSingleCheckout);

router.route("/contact").get(verifyAdmin, getAllContact).post(createContact);
router
  .route("/contact/:_id")
  .get(verifyAdmin, getSingleContact)
  .put(verifyAdmin, updateContact)
  .delete(deleteContact);

module.exports = router;
