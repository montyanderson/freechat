<template>
	<div class="row">
		<div class="col s12">
			<h1 class="center-align"><span>freechat</span></h1>
		</div>

		<div class="col s12">
			<h3 class="center-align grey-text text-darken-2">simple, fast, and secure messaging</h3>
		</div>

		<div class="col s12 center-align">
			<div class="row">
				<button v-if="!started" class="center-align btn btn-large blue" v-on:click="generate">Get Started</button>

				<div v-if="started">
					<div class="preloader-wrapper big active">
						<div class="spinner-layer spinner-blue-only">
							<div class="circle-clipper left">
								<div class="circle"></div>
							</div>

							<div class="gap-patch">
								<div class="circle"></div>
							</div>

							<div class="circle-clipper right">
								<div class="circle"></div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<style>
h1 {
	font-size: 10rem;
	font-weight: 500;
}

h1 span {
	 background: linear-gradient(to right, #3494e6, #ec6ead);
	color: transparent;
	-webkit-background-clip: text;

	display: inline-block;
	width: auto;
	margin-left: auto;
	margin-right: auto;
}

h3 {
	font-size: 2rem;
	margin-bottom: 5rem;
}
</style>

<script>
const KeyPair = require("../lib/KeyPair");

module.exports = {
	data: () => ({
		keyPair: new KeyPair(),
		started: false
	}),
	methods: {
		async generate() {
			this.started = true;
			await this.keyPair.generate();
			this.$emit("keyPair", this.keyPair);
		}
	}
}
</script>
