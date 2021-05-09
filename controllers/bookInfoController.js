const Book = require("../models/bookInfoModel");

exports.addNewBook = (req, res, next) => {
    const book = new Book(req.body.book_title, req.body.book_summary);
    book.save( () => {
        res.render("bookinfo/booksinfo-read", {
            title: "Reading books",
            booksinfo: [{book_title: book.book_title
                , book_summary: book.book_summary
            }]
        })
    });
    
}

exports.showAllBooks = (req, res, next) => {
    let all_data;

    Book.getAllBooksInfo((all_data) => {
        res.render("bookinfo/booksinfo-read", {
            title: "All info",
            booksinfo: all_data
        });
    });

}

exports.getAddNewBook = (req, res, next) => {
    res.render("bookinfo/bookinfo-write", {title: "Record Books information"});
}