import { ethers } from "ethers";
import { Erc20 } from "./interfaces";
import { getFLPAbi } from "./utils/getAbis";
import { getFLPAddress } from "./utils/getAddress";

export default class FLPContract extends Erc20 {
    constructor(provider: ethers.providers.Web3Provider) { 
        super(provider, getFLPAddress(),getFLPAbi());
    }
}