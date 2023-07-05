import { INFTItem } from "@/_types_";
import {ethers} from "ethers";
import { BaseInterface, Erc721 } from "./interfaces";
import { getAuctionAbi } from "./utils/getAbis";
import { getAuctionAddress } from "./utils/getAddress";

export default class AuctionContract extends BaseInterface {
    constructor(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider) {
        super(provider, getAuctionAddress(), getAuctionAbi());
    }

    createAuction = async (tokenId: number, initialPrice: number, startTime : number, endTime : number) => {
        const tx = await this._contract.createAuction(tokenId, this._numberToEth(initialPrice), startTime, endTime);
        return this._handleTransactionResponse(tx);
    }

    joinAuction = async (auctionId: number, bid: number) => {
        const tx = await this._contract.joinAuction(auctionId,this._numberToEth(bid));
        return this._handleTransactionResponse(tx);
    }

    finishAuction = async (auctionId:number) => {
        const tx = await this._contract.finishAuction(auctionId);
        return this._handleTransactionResponse(tx);
    }

    cancelAuction = async (auctionId: number) => {
        const tx = await this._contract.cancelAuction(auctionId);
        return this._handleTransactionResponse(tx);
    }

    getAuction = async (auctionId: number) => {
        const auction = await this._contract.getAuction(auctionId);
        return auction
    }

    getAuctionByStatus = async (active: boolean) => {
        const auctions = await this._contract.getAuctionByStatus(active);
        return auctions
    }
}