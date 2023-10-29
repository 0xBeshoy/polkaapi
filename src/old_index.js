// Import
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Abi } from "@polkadot/api-contract";
import {
    mnemonicValidate,
    mnemonicGenerate,
    cryptoWaitReady,
} from "@polkadot/util-crypto";
import { config } from "dotenv";
import { Keyring } from "@polkadot/keyring";

config();
const mnemonic = process.env.MNEMONIC;
await cryptoWaitReady();

const connect = async () => {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider: wsProvider });
    return api;
};

const createAccount = async (mnemonic) => {
    const keyring = new Keyring({ type: "sr25519" });
    mnemonic =
        (await mnemonic) && mnemonicValidate(mnemonic)
            ? mnemonic
            : mnemonicGenerate();
    const account = keyring.addFromMnemonic(mnemonic);
    return { account, mnemonic };
};

const addAccount = async (mnemonic) => {
    const keyring = new Keyring({ type: "sr25519" });
    const alice = keyring.addFromUri("//Alice", { name: "Alice default" });
    return alice.address;
};

const api = connect();
const account = addAccount();

const balance = await api.derive.balances?.all(account);
console.log(balance);
