const crypto = require("./crypto");

module.exports = class KeyPair {
	static toBase64(buffer) {
		let string = "";

		const uint8Array = new Uint8Array(buffer);

		for(let i = 0; i < uint8Array.length; i++) {
			string += String.fromCharCode(uint8Array[i]);
		}

		return window.btoa(string);
	}

	static fromBase64(base64) {
		const string = atob(base64);

		const uint8Array = new Uint8Array(string.length);

		for(let i = 0; i < string.length; i++) {
			uint8Array[i] = string.charCodeAt(i);
		}

		return uint8Array;
	}

	static toString(buffer) {
		return new TextDecoder("utf-8").decode(buffer);
	}

	static fromString(string) {
		return new TextEncoder("utf-8").encode(string);
	}

	async generate() {
		const key = await crypto.subtle.generateKey({
			name: "RSA-OAEP",
			modulusLength: 4096,
			publicExponent: Uint8Array.from([ 3 ]),
			hash: {
				name: "SHA-512"
			}
		}, true, [
			"encrypt",
			"decrypt"
		]);

		Object.assign(this, key);
	}


	async encrypt(plainText) {
		return await crypto.subtle.encrypt({
			name: "RSA-OAEP"
		}, this.publicKey, plainText);
	}

	async decrypt(cipherText) {
		return await crypto.subtle.decrypt({
			name: "RSA-OAEP"
		}, this.privateKey, cipherText);
	}

	async sign(message) {
		const signingKey = await crypto.subtle.importKey("pkcs8",
			await crypto.subtle.exportKey("pkcs8", this.privateKey),
		{
			name: "RSASSA-PKCS1-v1_5",
			modulusLength: 4096,
			publicExponent: Uint8Array.from([ 3 ]),
			hash: {
				name: "SHA-512"
			}
		}, true, [
			"sign"
		]);

		const hash = await crypto.subtle.digest("sha-512", message);
		const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", signingKey, hash);

		return signature;
	}

	async verify(message, signature) {
		const verifyingKey = await crypto.subtle.importKey("spki",
			await crypto.subtle.exportKey("spki", this.publicKey),
		{
			name: "RSASSA-PKCS1-v1_5",
			modulusLength: 4096,
			publicExponent: Uint8Array.from([ 3 ]),
			hash: {
				name: "SHA-512"
			}
		}, true, [
			"verify"
		]);

		const hash = await crypto.subtle.digest("sha-512", message);
		const validity = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", verifyingKey, signature, hash);

		return validity;
	}

	async exportPublicKey() {
		return await crypto.subtle.exportKey("spki", this.publicKey);
	}

	async importPublicKey(publicKey) {
		this.publicKey = await crypto.subtle.importKey("spki", publicKey, {
			name: "RSA-OAEP",
			modulusLength: 4096,
			publicExponent: Uint8Array.from([ 3 ]),
			hash: {
				name: "SHA-512"
			}
		}, true, [
			"encrypt"
		]);
	}

	async id() {
		return await crypto.subtle.digest("sha-256", await this.exportPublicKey());
	}
}
