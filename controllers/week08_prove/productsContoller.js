const Product = require("../../models/week08_prove/products");

exports.getProducts =  (req, res, next) => {
  
  if (!req.query.page) {
    req.query.page = 1;
  }

  const ITEMS_PER_PAGE = 10;
  let startItemIdex = req.query.page * ITEMS_PER_PAGE;
  let endItemIndex = startItemIdex + ITEMS_PER_PAGE;

  Product.getAll( (response) => {
    const totalPages = Math.ceil(response.length / ITEMS_PER_PAGE);
    dataToShow = response.slice(startItemIdex, endItemIndex);
    let currentPage = parseInt(req.query.page);
    let firstInPagination;
    let lastInPagination;
    let hasPrevious = currentPage == 1 ? false : true;
    let hasNext = currentPage == totalPages - 1 ? false : true;


    firstInPagination = currentPage - 2;
    lastInPagination = currentPage + 3

    if (currentPage < 3) {
      firstInPagination = 1;
      lastInPagination = 6;
    } 
    

    if (currentPage > totalPages - 3) {
      firstInPagination = totalPages - 5;
      lastInPagination = totalPages;
    } 
    
 

    console.log(firstInPagination);
    console.log(lastInPagination);

    res.render("week08_prove/index", {
      pageTitle: "Week 08 ",
      data: dataToShow,
      totalPages: totalPages - 1,
      currentPage: currentPage,
      firstInPagination:firstInPagination,
      lastInPagination:lastInPagination,
      hasNext: hasNext,
      hasPrevious: hasPrevious
    });
  });

  
  
};