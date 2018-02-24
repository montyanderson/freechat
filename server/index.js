const io = new (require("socket.io"));

const users = {};

io.on("connection", socket => {
	let publicKey;

	socket.on("publicKey", _publicKey => {
		publicKey = _publicKey;

		for(let key in users) {
			socket.emit("peerConnect", key);
			users[key].emit("peerConnect", publicKey);
		}

		if(users[publicKey] == undefined) {
			users[publicKey] = socket;
		}
	});

	socket.on("message", message => {
		if(typeof publicKey != "string")
			return;

		message.from = publicKey;

		if(users[message.to] != undefined) {
			users[message.to].emit("message", message);
		}
	});

	socket.on("disconnect", () => {
		delete users[publicKey];

		for(let key in users) {
			users[key].emit("peerDisconnect", publicKey);
		}
	});
});

io.listen(3000);
