const { keccak256 } = require("ethereum-cryptography/keccak");
const secp = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes, hexToBytes } = require('ethereum-cryptography/utils');
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "f3b71a077e04c840944e": 100,
  "c6b7ef67695f3d1ab018": 50,
  "82d88d561e09ba1cd53e": 75,
};

app.get("/balance/:signature", (req, res) => {
  const { signature } = req.params;

  const bytes = utf8ToBytes('send moneys');
  const msgHash = keccak256(bytes);

  // recover public key from signature
  const publicKey = secp.recoverPublicKey(msgHash, hexToBytes(signature), 1);
  const address = toHex(publicKey).slice(-20);

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, signature, amount } = req.body;

  const bytes = utf8ToBytes('send moneys');
  const msgHash = keccak256(bytes);

  // recover public key from signature
  const publicKey = secp.recoverPublicKey(msgHash, signature, 1);

  // verify signature against public key
  const verified = secp.verify(signature, msgHash, publicKey);

  if (!verified) {
    res.status(400).send({ message: "Not verified!" });
  }

  // extract address from public key
  const sender = toHex(publicKey).slice(-20);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
