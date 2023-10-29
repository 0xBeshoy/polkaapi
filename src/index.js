import { mnemonicGenerate, mnemonicValidate } from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";

const mnemonic = process.env.MNEMONIC;

const keyring = new Keyring({ type: "sr25519" });
const connect = async () => {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
    const api = new ApiPromise({ provider: wsProvider });
    return api.isReady;
};

const createAccount = (mnemonic) => {
    mnemonic =
        mnemonic && mnemonicValidate(mnemonic) ? mnemonic : mnemonicGenerate();
    const account = keyring.addFromMnemonic(mnemonic);
    return { account, mnemonic };
};
const main = async (api) => {
    console.log(`client is connected: ${api.isConnected}`);

    // Will be replaced with a proper way
    const { account: medium1 } = createAccount(mnemonic);
    const balance = await api.derive.balances.all(medium1.address);
    const available = balance.availableBalance.toNumber();
    const dots = available / 10 ** api.registry.chainDecimals;
    const print = dots.toFixed(4);
    console.log(`Address ${medium1.address} has ${print} DOT`);
};
connect()
    .then(main)
    .catch((err) => {
        console.error(err);
    })
    .finally(() => process.exit());
