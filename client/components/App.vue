<template>
	<div class="container">
		<Dashboard v-if="keyPair" v-bind:keyPair="keyPair"></Dashboard>
		<Welcome v-else v-on:keyPair="generated"></Welcome>
	</div>
</template>

<script>
const KeyPair = require("../lib/KeyPair");

const Welcome = require("./Welcome.vue");
const Dashboard = require("./Dashboard.vue");

module.exports = {
	data: () => ({
		keyPair: null
	}),
	methods: {
		generated(keyPair) {
			this.keyPair = keyPair;
		}
	},
	components: {
		Welcome,
		Dashboard
	}
};
</script>
