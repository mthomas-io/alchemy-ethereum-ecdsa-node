const { keccak256 } = require("ethereum-cryptography/keccak");
const { signSync } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

const PRIVATE_KEY = 'fea3b31043ca7bc645fcc327a79bbd225507cf3e77465c429f7e5cb8cd067633';
const message = 'send moneys';

const bytes = utf8ToBytes(message);
const msgHash = toHex(keccak256(bytes));

const [sig, recoveryBit] = signSync(msgHash, PRIVATE_KEY, { recovered: true });

console.log('Signature: ', toHex(sig));
console.log('Recovery bit', recoveryBit);