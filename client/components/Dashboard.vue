<template>
	<div class="dashboard row">
		<div class="col s12 l5">
			<ul class="collection with-header">
				<li class="collection-header"><h4>Users</h4></li>

				<p class="center-align grey-text" v-if="Object.keys(peers).length === 0">
					no users connected :(
				</p>

				<li class="collection-item" v-for="peer in peers">
					<span class="new badge" v-if="peer.unread > 0">{{peer.unread}}</span>
					<a href="#" v-on:click="showMessages(peer)">{{peer.id}}</a>
				</li>
			</ul>
		</div>

		<div class="col s12 l7">
			<Chat v-if="chatPeer" v-bind:peer="chatPeer" v-on:message="newMessage"></Chat>
		</div>
	</div>
</template>

<script>
const Vue = require("vue");
const io = require("socket.io-client");
const KeyPair = require("../lib/KeyPair");

const Chat = require("./Chat.vue");

const socket = io(location.origin);

module.exports = {
	props: [ "keyPair" ],
	data: () => ({
		peers: {},
		chatPeer: false
	}),
	methods: {
		showMessages(peer) {
			peer.unread = 0;
			this.chatPeer = peer;
		},
		async newMessage(plainString) {
			const plain = KeyPair.fromString(plainString);

			const encrypted = await this.chatPeer.key.encrypt(plain);
			console.log("encrypted", encrypted);
			const signature = await this.keyPair.sign(encrypted);
			console.log("signature", signature);

			this.chatPeer.messages.push({
				content: plainString,
				remote: false
			});

			socket.emit("message", {
				content: KeyPair.toBase64(encrypted),
				signature: KeyPair.toBase64(signature),
				to: this.chatPeer.publicKey
			});
		},
		async recieveMessage(message) {
			const content = KeyPair.fromBase64(message.content);

			const peer = this.peers[message.from];

			if((await peer.key.verify(content, KeyPair.fromBase64(message.signature))) === true) {
				const message = {
					content: KeyPair.toString(await this.keyPair.decrypt(content)),
					remote: true
				};

				peer.messages.push(message);

				if(peer !== this.chatPeer) {
					peer.unread++;
				}

				if(document.visibilityState !== "visible") {
					new Notification("New Message");
				}
			}

		}
	},
	async created() {
		Notification.requestPermission();

		socket.on("peerConnect", async publicKey => {
			const key = new KeyPair();
			await key.importPublicKey(KeyPair.fromBase64(publicKey));

			const id = KeyPair.toBase64(await key.id());

			Vue.set(this.peers, publicKey, {
				publicKey,
				key,
				id,
				messages: [],
				unread: 0
			});
		});

		socket.on("peerDisconnect", async publicKey => {
			Vue.delete(this.peers, publicKey);
		});

		socket.on("message", message => {
			this.recieveMessage(message);
		});

		socket.emit("publicKey", KeyPair.toBase64(await this.keyPair.exportPublicKey()));
	},
	components: {
		Chat
	}
}
</script>
