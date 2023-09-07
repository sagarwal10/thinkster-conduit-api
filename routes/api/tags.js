var router = require('express'); 
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

router.get('/', function(req, res, next) {
  Article.find().distinct('tagList').then(function(tags) {
    return res.json({tags: tags});
  }).catch(next);
}); 

module.exports = router; 

