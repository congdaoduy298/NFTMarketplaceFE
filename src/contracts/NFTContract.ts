import {BigNumber, ethers} from "ethers";
import { Erc721 } from "./interfaces";
import { getNFTAbi } from "./utils/getAbis";
import { getNFTAddress } from "./utils/getAddress";
import { IAuctionInfo, INFTItem } from "@/_types_";
import * as dotenv from "dotenv";
import {TransactionResponse} from '@ethersproject/abstract-provider';

dotenv.config();

export default class NFTContract extends Erc721 {
    constructor(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider) {
        super(provider, getNFTAddress(), getNFTAbi());
    }
    

    private _listTokenIds = async(address: string) => {
        const urls: BigNumber[] = await this._contract.listTokenIds(address);
        const ids = await Promise.all(urls.map((id) => this._toNumber(id)));
        return ids;
    }

    getListNFT = async(address: string): Promise<INFTItem[]> => {
        const ids = await this._listTokenIds(address);
        return Promise.all(
            ids.map(async(id) => {
                const tokenUrl = await this._contract.tokenURI(id);
                const owner = await this._contract.ownerOf(id);
                const obj = await (await fetch(`${tokenUrl}.json`)).json();
                const item: INFTItem = {...obj, id, owner};
                return item;
            })
        ); 
    }

    getNFTInfo = async(nfts: Array<any>) => {
        return Promise.all(
            nfts.map(async(o: any) => {
                const tokenUrl = await this._contract.tokenURI(o.tokenId);
                const owner = await this._contract.ownerOf(o.tokenId);
                const obj = await (await fetch(`${tokenUrl}.json`)).json();
                const item: INFTItem = {...obj, id: o.tokenId, author: o.author, owner, price: o.price};
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

    mintNFT = async (address: string) => {
        const heroType = 1;
        const tx: TransactionResponse = await this._contract.mint(address, heroType, this._option);
        return this._handleTransactionResponse(tx);
    }
}