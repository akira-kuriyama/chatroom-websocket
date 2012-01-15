exports.users = {};
exports.messages = [];
exports.chat = function(client) {
	var users = exports.users;
	var messages = exports.messages;
	var io = exports.io;
	 console.log(client.sessionId + 'が接続しました。');
	 
	 client.on('login', function(user){
		console.log(users);
	 	users[user] = user;
		client.user = user;
		io.sockets.emit('updateLoginUsers', users);
		var msg =  client.user + 'さんがログインしました！';
		for(var key in messages) {
			client.emit('res', messages[key]['user'], messages[key]['msg']);
		}
		messages.push({'user':'system', 'msg' :msg});
		io.sockets.emit('res', 'system', msg);
	 });
	 // メッセージを受けたときの処理
	 client.on('chat', function(from, msg) {
		 console.log("メッセージを送信しました。(from=" + from + ", msg=" + msg + ")");
		 messages.push({'user':from, 'msg' :msg});
		 // つながっているクライアント全員に送信
		 io.sockets.emit('res', from, msg);
	 });


	 // クライアントが切断したときの処理
	 client.on('disconnect', function(){
		 console.log(client.sessionId + 'が切断しました。');
		 delete users[client.user];
		 io.sockets.emit('updateLoginUsers', users);
		 var msg = client.user + 'さんがログアウトしました...';
		 io.sockets.emit('res', 'system', msg);
		 messages.push({'user':'system', 'msg' :msg});
		
	 });

};
