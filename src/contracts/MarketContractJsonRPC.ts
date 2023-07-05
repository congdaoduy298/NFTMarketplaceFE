import {
    TransactionResponse, 
} from "@ethersproject/abstract-provider"
import { BigNumber, ethers, Overrides } from "ethers"
import { getMarketAbi } from "./utils/getAbis";
import { getMarketAddress } from "./utils/getAddress";

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
        this._contractAddress = getMarketAddress();
        this._abis = getMarketAbi();
        this._option = {gasLimit: 300000, gasPrice: 18000000000};
        this._contract = new ethers.Contract(getMarketAddress(), getMarketAbi(), provider);
    }

    getNFTListedOnMarketplace = async () => {
        const items = await this._contract.getListedNFT();
        const nfts = items.map((item:any) => ({tokenId: this._toNumber(item.tokenId), author: item.author, price: this._toNumber(item.price)}));
        return nfts;
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