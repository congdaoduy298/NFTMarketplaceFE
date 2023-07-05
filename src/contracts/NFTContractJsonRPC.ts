import {
    TransactionResponse, 
} from "@ethersproject/abstract-provider"
import { BigNumber, ethers, Overrides } from "ethers"
import { getNFTAbi } from "./utils/getAbis";
import { getNFTAddress } from "./utils/getAddress";
import { IAuctionInfo, INFTItem } from "@/_types_";

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
        this._contractAddress = getNFTAddress();
        this._abis = getNFTAbi();
        this._option = {gasLimit: 300000, gasPrice: 18000000000};
        this._contract = new ethers.Contract(getNFTAddress(), getNFTAbi(), provider);
    }

    getNFTInfo = async(nfts: Array<any>) => {
        return Promise.all(
            nfts.map(async(o: any) => {
                const tokenUrl = await this._contract.tokenURI(o.tokenId);
                const owner = await this._contract.ownerOf(o.tokenId);
                const obj = await (await fetch(`${tokenUrl}.json`)).json();
                const item: INFTItem = {...obj,id: o.tokenId, author: o.author, owner, price: o.price};
                return item;
            })
        )
    }

    getNFTAuctionInfo = async(nfts: Array<any>) => {
        return Promise.all(
            nfts.map(async(o: any) => {
                const tokenUrl = await this._contract.tokenURI(o._tokenId);
                const owner = await this._contract.ownerOf(o._tokenId);
                const obj = await (await fetch(`${tokenUrl}.json`)).json();
                // const item: IAuctionInfo = {...obj,id: o._tokenId, author: o.author, owner};
                const item: IAuctionInfo = {...obj,
                    id: this._toNumber(o._tokenId), 
                    author: o.author, 
                    owner: owner,
                    auctionId: this._toNumber(o.auctionId),
                    auctioneer: o.auctioneer,
                    tokenId: this._toNumber(o._tokenId),
                    initialPrice: this._toNumber(o.initialPrice),
                    lastBid: this._toNumber(o.lastBid),
                    lastBidder: o.lastBidder,
                    startTime: o.startTime,
                    endTime: o.endTime,
                    completed: o.completed,
                };

                return item;
            })
        )
    }

    _toNumber = (bigNumber: BigNumber) => {
        try {
            return bigNumber.toNumber();
        }
        catch (err){
            return Number.parseFloat(ethers.utils.formatEther(bigNumber))
        }
    }
}