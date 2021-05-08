const fs = require("fs");
const path = require('path');
const dataPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'bookinfo.json'
);

const getData = (cb) => {
    fs.readFile(dataPath, "utf-8", (error, data) => {

        if (error) {
            cb([]);
        } else {
            cb(JSON.parse(data));
        }

        const the_data = JSON.parse(data);
        the_data.push(req.body);
        
        fs.writeFile("./data/bookinfo.json", JSON.stringify(the_data), (err) => {
            console.log(err);
        }); 
    });
}

module.exports = class Book {
    constructor(title, summary) {
        this.book_title = title;
        this.book_summary = summary;
    }

    save(cb) {
        getData( (data) => {
            data.push(this)
            fs.writeFile(dataPath, JSON.stringify(data), (err) => {
                console.log(err);
            }); 
        })

        cb();
    }

    static getAllBooksInfo(cb) {
        getData(cb);
    }
}
