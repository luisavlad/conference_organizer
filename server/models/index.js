const User = require("./User");
const Conference = require("./Conference");
const Article = require("./article");
const ArticleVersion = require("./ArticleVersion");
const Review = require("./Review");
const Comment = require("./Comment");

// Relatii
User.hasMany(Conference, { foreignKey: "createdBy" });
Conference.belongsTo(User, { foreignKey: "createdBy" });

User.hasMany(Article, { foreignKey: "authorId" });
Article.belongsTo(User, { foreignKey: "authorId" });

Conference.hasMany(Article, { foreignKey: "conferenceId" });
Article.belongsTo(Conference, { foreignKey: "conferenceId" });

Article.hasMany(ArticleVersion, { foreignKey: "articleId" });
ArticleVersion.belongsTo(Article, { foreignKey: "articleId" });

Article.hasMany(Review, { foreignKey: "articleId" });
Review.belongsTo(Article, { foreignKey: "articleId" });

Review.hasMany(Comment, { foreignKey: "reviewId", onDelete: "CASCADE" });
Comment.belongsTo(Review, { foreignKey: "reviewId" });

module.exports = {
  User,
  Conference,
  Article,
  ArticleVersion,
  Review,
  Comment,
};
