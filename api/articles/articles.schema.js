const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  etat: {
    type: String,
    enum: {
      values: ["draft, published"],
      default: "draft",
      message: '{VALUE} is not supported'
    } 
  }
});

let Article;

module.exports = Article = model("Article", articleSchema);

/*async function test() {
  const articles = await Article.find().populate({
    path: "user",
    select: "-password",
    match: { name: /ben/i },
  });
  console.log(articles.filter((article) => article.user));
}

test();*/
