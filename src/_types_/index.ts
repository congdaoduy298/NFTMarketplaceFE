export interface IWalletInfo {
    address: string;
    bnb: number;
}

export interface IRate {
    usdtRate: number;
    bnbRate: number;
}

export enum TOKEN {
    BNB = 'BNB',
    USDT = 'USDT'
}

export interface IPackage {
    key: string;
    name: string;
    amount: number;
    icon: string;
    bg: string;
    token: TOKEN;
}

export interface IMenu {
    name: string;
    url: string;
}

export interface IAttribute {
    trait_type: string;
    value: number;
}

export interface INFTItem {
    price?: number;
    id: number;
    name?: string;
    description?: string;
    image: string;
    attributes?: IAttribute[];
    priceListing?: number;
    author?: string;
    owner?: string;
    ownerImage?: string;
    highestBid?: number;
}

export enum Clarity {
    "A",
    "B",
    "C", 
    "D",
    "E", 
    "S",
    "SS",
    "SSS",
}

// AUCTION: create an auction, CANCEL: cancel an auction, PLACE: place a bid an auction.
export type ActionType = "LIST" | "UNLIST" | "TRANSFER" | "AUCTION" | "MINT" | "EDIT" | "BUY" | "CANCEL" | "PLACE" | "FINISH" | "USER_FINISH";
export type FaucetType = "BNB" | "FLP" | "USDT";

export interface IAuctionInfo extends INFTItem {
    auctionId: number;
    auctioneer: string;
    tokenId: number;
    initialPrice: number;
    lastBid: number;
    lastBidder: string;
    startTime: number;
    endTime: number;
    completed: boolean;
    active: boolean;
  }