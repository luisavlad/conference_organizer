import Article from "./articleModel.js";
import Comment from "./commentModel.js";
import Conference from "./conferenceModel.js";
import User from "./userModel.js";

User.hasMany(Article, {
  foreignKey: "authorId",
});
Article.belongsTo(User, {
  foreignKey: "authorId",
});

Conference.hasMany(Article, {
  foreignKey: "conferenceId",
});
Article.belongsTo(Conference, {
  foreignKey: "conferenceId",
});

User.hasMany(Comment, {
  foreignKey: "userId",
});
Comment.belongsTo(User, {
  foreignKey: "userId",
});

Article.hasMany(Comment, {
  foreignKey: "articleId",
});
Comment.belongsTo(Article, {
  foreignKey: "articleId",
});

Conference.belongsToMany(User, {
  through: "ConferenceReviewers",
  as: "reviewers",
  foreignKey: "conferenceId",
  otherKey: "userId",
});
User.belongsToMany(Conference, {
  through: "ConferenceReviewers",
  foreignKey: "userId",
  otherKey: "conferenceId",
});

export { Article, Comment, Conference, User };
