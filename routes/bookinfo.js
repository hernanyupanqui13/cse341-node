const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/bookinfo", (req, res, next) => {
    res.render("bookinfo-write", {title: "Record Books information"});
});

router.post("/bookinfo", (req, res, next) => {
    
    fs.readFile("./database.json", "utf-8", (error, data) => {
        const the_data = JSON.parse(data);
        the_data.push(req.body);
        
        fs.writeFile("./database.json", JSON.stringify(the_data), (err) => {
            console.log(err);
        }); 
    });

    
    res.render("booksinfo-read", {
        title: "Reading books",
        booksinfo: [{book_title: req.body.book_title
            , book_summary: req.body.book_summary
        }]
    })
});

router.get("/bookinfo/all", (req, res, next) => {
    let all_data; 
    fs.readFile("./database.json", "utf-8", (error, data) => {
        all_data = JSON.parse(data);
        
        res.render("booksinfo-read", {
            title: "All info",
            booksinfo: all_data
        });
    });
    
});

module.exports = router;