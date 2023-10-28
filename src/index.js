// Import
import { ApiPromise, WsProvider } from "@polkadot/api";

// const { ApiPromise, WsProvider } = require("@polkadot/api");

// Construct
const wsProvider = new WsProvider("wss://rpc.polkadot.io");
const api = ApiPromise.create({ provider: wsProvider });

// Do something
// retrieve Option<StakingLedger>
const ledger = await api.query.staking.ledger(
    "EoukLS2Rzh6dZvMQSkqFy4zGvqeo14ron28Ue3yopVc8e3Q"
);
// retrieve ValidatorPrefs (will yield the default value)
const prefs = await api.query.staking.validators(
    "EoukLS2Rzh6dZvMQSkqFy4zGvqeo14ron28Ue3yopVc8e3Q"
);

console.log(ledger.isNone, ledger.isSome); // true, false
console.log(JSON.stringify(prefs.toHuman())); // {"commission":"0"}
