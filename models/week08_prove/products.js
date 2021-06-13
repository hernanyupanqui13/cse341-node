const fs = require("fs");
const path = require("path");
const dataPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'items.json'
);


class Product {
  constructor() {
    this.tags = [];
    this.imageUrl = "";
    this.price = 0;
    this.name = "";
    this.description = "";
  }

  static async getAll(cb) {
    fs.readFile(dataPath, "utf-8", (error, data) => {
      if (error) {
        console.log(error);
        cb([]);

      } else {
        cb(JSON.parse(data));
      }

    });
    
  }
}

module.exports = Product;