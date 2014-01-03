
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Dave\'s test server' });
};