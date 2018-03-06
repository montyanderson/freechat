<template>
	<div class="row">
		<div class="col s12">
			<h5 class="center-align address">{{peer.id}}</h5>
		</div>

		<div class="col s12 messages" ref="messages">
			<ul>
				<li v-if="peer.messages.length == 0">
					<p class="center-align grey-text">no messages :(</p>
				</li>

				<template v-else v-for="message in peer.messages">
					<li class="row" v-if="message.remote == true">
						<div class="message remote">{{message.content}}</div>
					</li>

					<li class="row" v-else>
						<div class="message local">{{message.content}}</div>
					</li>

				</template>
			</ul>
		</div>

		<input placeholder="What's up?" type="text" v-model="message" v-on:keyup.enter="submitMessage">
	</div>
</template>

<style>
.messages {
	height: 60vh;
	overflow-y: scroll;
	overflow-x: hidden;
}

.messages::-webkit-scrollbar {
    display: none;
}

.messages .row {
	margin-bottom: 10px;
}

.message {
	padding: 5px 8px 6px;
	font-size: 15px;

	max-width: 80%;
}

.message.remote {
	background-color: #f1f0f0;
	color: black;

	border-bottom-right-radius: 12px;
	border-top-right-radius: 12px;

	float: left;
}

.message.local {
	background-color: #4080ff;
	color: white;

	border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;

	float: right;
}

.address {
	font-size: calc(1rem + 1vw);
}
</style>

<script>
module.exports = {
	props: [ "peer" ],
	data: () => ({
		message: ""
	}),
	methods: {
		submitMessage() {
			this.$emit("message", this.message);
			this.message = "";
		}
	},
	updated() {
		this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
	}
};
</script>
