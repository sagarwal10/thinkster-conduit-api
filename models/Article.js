var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug'); 
var User = mongoose.model('User'); 

var ArticleSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  description: String,
  body: String,
  favoritesCount: { type: Number, default: 0 },
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true }); 

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken' });

ArticleSchema.methods.slugify = function() { 
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36,6) | 0).toString(36);
}; 

ArticleSchema.pre('validate', function(next) {
  if (!this.slug) this.slugify();
  next();
}); 

ArticleSchema.methods.updateFavoriteCount = function() {
  var article = this;

  return User.count({favorites: {$in: [article.id]}}).then(function(count) {
    article.favoritesCount = count;

    return article.save();
  });
}; 

ArticleSchema.methods.toJSONFor = function(user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoriesCount,
    author: this.author.toProfileJSONFor(user)
  };
}; 

mongoose.model('Article', ArticleSchema); 

