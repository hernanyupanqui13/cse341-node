const Book = require("../models/bookInfoModel");

exports.addNewBook = (req, res, next) => {
    const book = new Book(req.body.book_title, req.body.book_summary);
    book.save( () => {
        res.render("booksinfo-read", {
            title: "Reading books",
            booksinfo: [{book_title: book.book_title
                , book_summary: book.book_summary
            }]
        })
    });
    
}