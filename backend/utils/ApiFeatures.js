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
    console.log(queryStrCopy);
    // remove some fields for catagory purposes
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryStrCopy[key]);
    
    console.log(queryStrCopy);

    this.query = this.query.find(queryStrCopy);
    return this;
  }
}

module.exports = ApiFeatures;
