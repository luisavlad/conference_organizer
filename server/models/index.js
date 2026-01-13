const User = require("./userModel");
const Conference = require("./conferenceModel");
const Article = require("./articleModel");
const Review = require("./reviewModel");
const Comment = require("./commentModel");

// Relatii
User.hasMany(Conference, { foreignKey: "createdBy" });
Conference.belongsTo(User, { foreignKey: "createdBy" });

User.hasMany(Article, { foreignKey: "authorId" });
Article.belongsTo(User, { foreignKey: "authorId" });

Conference.hasMany(Article, { foreignKey: "conferenceId" });
Article.belongsTo(Conference, { foreignKey: "conferenceId" });

Article.hasMany(Review, { foreignKey: "articleId" });
Review.belongsTo(Article, { foreignKey: "articleId" });

Review.hasMany(Comment, { foreignKey: "reviewId", onDelete: "CASCADE" });
Comment.belongsTo(Review, { foreignKey: "reviewId" });

module.exports = {
  User,
  Conference,
  Article,
  Review,
  Comment,
};
