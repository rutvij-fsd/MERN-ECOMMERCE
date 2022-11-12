class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // ignore case sesitive options when searching for keywords
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    // copy queryStr from original we cannot directly assign object to const as it will pass only ref of object
    const queryStrCopy = { ...this.queryStr };
    // remove some fields for catagory purposes
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryStrCopy[key]);
    
    // filter for price and rating
    let queryStrCopy2 = JSON.stringify(queryStrCopy);
    queryStrCopy2 = queryStrCopy2.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`); // replace between all 
    this.query = this.query.find(JSON.parse(queryStrCopy2));
    return this;
  }

  // Pagination
  pagination(resultPerPage){
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage* (currentPage-1); // No of product to skip

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
