import server from "./server";

function Wallet({ signature, setSignature, balance, setBalance }) {
  async function onChange(evt) {
    const signature = evt.target.value;
    setSignature(signature);
    if (signature) {
      const {
        data: { balance },
      } = await server.get(`balance/${signature}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Signature
        <input placeholder="Paste your signature" value={signature} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
