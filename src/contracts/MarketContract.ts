import { INFTItem } from "@/_types_";
import {ethers} from "ethers";
import { Erc721 } from "./interfaces";
import { getMarketAbi } from "./utils/getAbis";
import { getMarketAddress } from "./utils/getAddress";

export default class MarketContract extends Erc721 {
    constructor(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider) {
        super(provider, getMarketAddress(), getMarketAbi());
    }

    getNFTListedOnMarketplace = async () => {
        const items = await this._contract.getListedNFT();
        const nfts = items.map((item:any) => ({tokenId: this._toNumber(item.tokenId), author: item.author, price: this._toNumber(item.price)}));
        return nfts;
    }

    listNFT = async(tokenId: number, price: number) => {
        const tx = await this._contract.listNFT(tokenId, this._numberToEth(price), this._option);
        return this._handleTransactionResponse(tx);
    }

    updateListingPrice = async(tokenId: number, price: number) => {
        const tx = await this._contract.updateListingNFTPrice(tokenId, this._numberToEth(price), this._option);
        return this._handleTransactionResponse(tx);
    }

    buyNFT = async(tokenId: number, price: number) => {
        const tx = await this._contract.buyNFT(tokenId, this._numberToEth(price), this._option);
        return this._handleTransactionResponse(tx);
    }

    unlistNFT = async(tokenId: number) => {
        const tx = await this._contract.unlistNFT(tokenId, this._option);
        return this._handleTransactionResponse(tx);
    }

}