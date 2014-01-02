
/*
 * GET home page.
 */

exports.index = function(req, res){
//  res.render('index', { title: 'Dave\'s test server' });
  res.send("<h1>Effective Date Counter</h1><p>To use it, change the URL above to '/effdate?t=' followed by the date, with the format '2013-01-01'</p>");
};