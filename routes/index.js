
/*
 * GET home page.
 */

exports.index = function(req, res){
//  res.render('index', { title: 'Dave\'s test server' });
  res.send("<h1>Effective Date Counter</h1><p>To use it, use the form below:</p><form action='effdate' method='get'>Transmittal Date: [format '2013-01-01']<input type='text' name='t'><br><input type='submit' value='Submit'></form>");
};