const express = require("express");

const router = express.Router();
const bookInfoController = require("../../controllers/bookinfo/bookInfoController");

router.get("/", bookInfoController.getAddNewBook);
router.post("/", bookInfoController.addNewBook);
router.get("/all", bookInfoController.showAllBooks);


module.exports = router;