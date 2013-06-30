
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.name = function name() {
    return "Hello";
};
