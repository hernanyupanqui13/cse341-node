const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const io = require("../../socket");

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../../data/week10_prove_data.json');



router.get('/', (req, res, next) => {
  res.render('week10_prove/index', {
    pageTitle: 'Week 10 Prove',
  });
});

router.get('/fetchAll', (req, res, next) => {
  res.json(dummyData);
});

router.post('/insert', (req, res, next) => {
  console.log(req.body);
  const avgName = {name: req.body.name, powers: req.body.powers};
  dummyData.avengers.push(avgName);

  res.setHeader("Acces-Control-Allow-Origin", "*");
  res.setHeader("Allow-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Allow-Control-Allowe-Headers", "Content-Type, Authorization");

  const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'week10_prove_data.json'
  );

  fs.writeFile(p, JSON.stringify(dummyData), err => {
    console.log(err);

    res.json({
      msg: "success"
    });

    io.getIO().emit("insert",{
      dummyData
    });

  });

  
  

  console.log(dummyData);



  /************************************************
   * INSERT YOUR WEB ENDPOINT CODE HERE
   ************************************************/
}); 


module.exports = router;