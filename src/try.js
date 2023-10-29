import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";
import { cryptoIsReady, mnemonicGenerate } from "@polkadot/util-crypto";
import { stringToU8a, u8aToHex } from "@polkadot/util";
import { signatureVerify } from "@polkadot/util-crypto";
import { config } from "dotenv";

// System configuration step
config();
const mnemonic = process.env.MNEMONIC;

// Connection setup
const setup = async () => {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider: wsProvider });
    return api;
};

// Testing the connection
async function testConnection() {
    setup()
        .then(async (api) => {
            const time = await api.query.timestamp.now();
            console.log(time.toPrimitive());
            const [chain, nodeName, nodeVersion] = await Promise.all([
                api.rpc.system.chain(),
                api.rpc.system.name(),
                api.rpc.system.version(),
            ]);
            console.log(
                `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
            );
        })
        .finally(() => process.exit());
}

// Adding key pairs to the app
const keyPairs = async () => {
    const keyring = new Keyring({ type: "ed25519" });
    const ep = keyring.createFromUri(mnemonic, { name: "signer" }, "ed25519");
    return {
        ep,
        mnemonic,
        address: ep.address,
        publicKey: ep.publicKey.toString("hex"),
    };
};

// Sign a message
const signMessage = async () => {
    const signer = await keyPairs();
    console.log({ signer });
    const message = stringToU8a("Hello, world!");
    const signature = await signer.ep.sign(message); // Access the 'sign' function on 'signer.ep'
    const { isValid } = signatureVerify(message, signature, signer.ep.address);
    console.log(u8aToHex(signature), isValid);
};

signMessage()
    .then(() => console.log("Done"))
    .catch((err) => {
        console.error(err);
    })
    .finally(() => process.exit());
