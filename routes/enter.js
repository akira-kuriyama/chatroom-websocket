exports.enter = function(req, res) {
	var result = {title: 'ChatRoom',
			username: req.body.username};
	res.render('room', result);
	
};

