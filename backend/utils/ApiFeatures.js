class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? {
        name: {
            $regex: this.queryStr.keyword,
            $options: "i", // ignore case sesitive options when searching for keywords        
        }
    } : {};
    console.log(keyword),
    this.query = this.query.find({...keyword});
    return this;
  }
}

module.exports = ApiFeatures;
