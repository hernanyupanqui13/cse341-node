const express = require("express");

const router = express.Router();
const week08_controller = require("../../controllers/week08_prove/productsContoller");

router.get("/week08", week08_controller.getProducts);



module.exports = router;