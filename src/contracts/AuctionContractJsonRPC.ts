import { INFTItem } from "@/_types_";
import {Overrides, ethers} from "ethers";
import { BaseInterface, Erc721 } from "./interfaces";
import { getAuctionAbi } from "./utils/getAbis";
import { getAuctionAddress } from "./utils/getAddress";

export default class NFTContractJsonRpc {
    _provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
    _contractAddress: string;
    _abis: ethers.ContractInterface;
    _contract: ethers.Contract;
    _option: Overrides;

    constructor(
        provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    ) {
        this._provider = provider;
        this._contractAddress = getAuctionAddress();
        this._abis = getAuctionAbi();
        this._option = {gasLimit: 300000, gasPrice: 18000000000};
        this._contract = new ethers.Contract(getAuctionAddress(), getAuctionAbi(), provider);
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