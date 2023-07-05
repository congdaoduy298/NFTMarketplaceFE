export type AddressType = {
    97: string,
    56: string
}

export enum CHAIN_ID {
    TESTNET = 97,
    MAINNET = 56
}

export default function getChainIdFromEnv(): number {
    const env = process.env.NEXT_PUBLIC_CHAIN_ID;
    if (!env) {return 97;}
    return parseInt(env)
}

export const getRPC = () => {
    if (getChainIdFromEnv() === CHAIN_ID.MAINNET) {
        return process.env.NEXT_PUBLIC_RPC_MAINNET}
    else {
        return process.env.NEXT_PUBLIC_RPC_TESTNET
    }
}

export const SMART_ADDRESS = {
    CROWD_SALE: {97: '0x4542BF25A885F1a53efda6c44A385D82342f756a', 56: ''},
    USDT: {97:'0x039E52Ed19D21EfEaD66d0F4a668140bbDAdEf4d', 56: ''},
    FLP: {97:'0xF52254b56ad7482A1721fc9B4B3e7F1ba793E0a9', 56: ''},
    NFT: {97:'0x22f76B1a6fF9a126CB28C4111c78FbE09D83fD20', 56: ''},
    MARKET: {97:'0x9F82d8e0Cbadf3cFBB9009D1526742B6511A1849', 56: ''},
    AUCTION: {97:'0x803C270AbEFfc7c2321EF37BB9d1A0424FD29DC6', 56: ''}
}