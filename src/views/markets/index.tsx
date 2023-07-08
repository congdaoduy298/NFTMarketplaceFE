import { ActionType, FaucetType, IAuctionInfo, INFTItem } from "@/_types_";
import MarketContract from "@/contracts/MarketContract";
import MarketContractJsonRPC from "@/contracts/MarketContractJsonRPC";
import NFTContract from "@/contracts/NFTContract";
import NFTContractJsonRPC from "@/contracts/NFTContractJsonRPC";
import FLPContract from "@/contracts/FLPContract";
import { useAppSelector } from "@/reduxs/hooks";
import {
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Tab,
  Text,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useBoolean,
  useDisclosure,
  Spacer,
  useToast,
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Nft from "./components/Nft";
import ProcessingModal from "@/components/ProcessingModel";
import ListModal from "./components/ListModal";
import { SuccessModal } from "@/components";
import TransferModal from "./components/TransferModal";
import { getMarketAddress } from "@/contracts/utils/getAddress";
import { ethers } from "ethers";
import EditListingModal from "./components/EditListingModal";
import AuctionContract from "@/contracts/AuctionContract";
import NFTAuction from "../auctions/components/NFTAuction";
import AuctionContractJsonRPC from "@/contracts/AuctionContractJsonRPC";

export default function MarketView() {
  useEffect(() => {
    document.title="NFT Marketplace";
  }, [])
  const { web3Provider, wallet } = useAppSelector(
    (state: any) => state.account
  );
  const [nfts, setNfts] = useState<INFTItem[]>([]);
  const [nftListed, setNftsListed] = useState<INFTItem[]>([]);
  const [auctions, setAuctions] = useState<IAuctionInfo[]>([]);
  const [auction, setAuction] = useState<IAuctionInfo>();
  const [nft, setNft] = useState<INFTItem>();
  const [action, setAction] = useState<ActionType>();
  const [faucet, setFaucet] = useState<FaucetType>();
  const [isListing, setIsListing] = useBoolean();
  const [isMinting, setIsMinting] = useBoolean();
  const [isOpen, setIsOpen] = useBoolean();
  const [isTransfer, setIsTransfer] = useBoolean();
  const [isUnList, setIsUnList] = useBoolean();
  const [isEditing, setIsEditing] = useBoolean();
  const [isProcessing, setIsProcessing] = useBoolean(false);
  const [isBuying, setIsBuying] = useBoolean();
  const [isAuction, setIsAuction] = useBoolean();
  const [isPlace, setIsPlace] = useBoolean();
  const [isFaucetBNB, setIsFaucetBNB] = useBoolean();
  const [isFaucetFLP, setIsFaucetFLP] = useBoolean();
  const [isFaucetUSDT, setIsFaucetUSDT] = useBoolean();
  const [isCancel, setIsCancel] = useBoolean();
  const [isFinish, setIsFinish] = useBoolean();
  const [txHash, setTxHash] = useState<string>();
  const [marketAddress, setmarketAddress] = useState<string>();
  const [currentItemId, setCurrentItemId] = useState<number>(-1);

  const toast = useToast();

  const {
    isOpen: isSuccess,
    onClose: onCloseSuccess,
    onOpen: onOpenSuccess,
  } = useDisclosure();

  const getListNFT = async () => {
    let marketContract: any, nftContract: any, auctionContract: any;
    if (!web3Provider) {
      let provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_TESTNET
      );
      marketContract = new MarketContractJsonRPC(provider);
      nftContract = new NFTContractJsonRPC(provider);
      const blockNumberProvider1 = await provider.getBlockNumber();
    } else {
      nftContract = new NFTContract(web3Provider);
      marketContract = new MarketContract(web3Provider);
      const blockNumberProvider2 = await web3Provider.getBlockNumber();
    }
    if (wallet?.address) {
      const nfts = await nftContract.getListNFT(wallet?.address);
      setNfts(nfts.filter((p: any) => p.name));
    }

    const ids = await marketContract.getNFTListedOnMarketplace();
    const listedNfts = await nftContract.getNFTInfo(ids);
    setNftsListed(listedNfts);
  };

  const getAuctions = async () => {
    let nftContract: any, auctionContract: any;
    if (!web3Provider) {
      let provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_TESTNET
      );
      nftContract = new NFTContractJsonRPC(provider);
      auctionContract = new AuctionContractJsonRPC(provider);
    } else {
      nftContract = new NFTContract(web3Provider);
      auctionContract = new AuctionContract(web3Provider);
    }
    const auctionIds = await auctionContract.getAuctionByStatus(true);
    const auctionNfts = await nftContract.getNFTAuctionInfo(auctionIds);
    setAuctions(auctionNfts);
  };

  useEffect(() => {
    const marketAddress = getMarketAddress();
    setmarketAddress(marketAddress);
    getListNFT();
  }, [web3Provider, wallet]);

  useEffect(() => {
    getAuctions();
  }, [web3Provider, wallet]);

  const selectNFTAction = async (
    ac: ActionType,
    nftItem?: INFTItem,
    index?: number
  ) => {
    if (!web3Provider) return;
    setNft(nftItem);
    setAction(ac);
    setIsListing.off();
    switch (ac) {
      case "LIST": {
        setIsOpen.on();
        break;
      }
      case "TRANSFER": {
        setIsTransfer.on();
        break;
      }
      case "EDIT": {
        setIsEditing.on();
        break;
      }
      case "BUY": {
        handleBuyNFT(nftItem?.id, nftItem?.price);
        break;
      }
      case "UNLIST": {
        handleUnlistNFT(nftItem?.id);
        break;
      }
      case "AUCTION": {
        setIsAuction.on();
        break;
      }
      default:
        break;
    }
  };

  const selectAuction = async (ac: ActionType, auctionItem?: IAuctionInfo) => {
    if (!web3Provider) return;
    setAuction(auctionItem);
    setAction(ac);
    setIsListing.off();
    switch (ac) {
      case "CANCEL": {
        handleCancelAuction(auctionItem?.auctionId);
        break;
      }
      case "PLACE": {
        setIsPlace.on();
        break;
      }
      case "FINISH": {
        requestFinishAuction(auctionItem?.auctionId);
        break;
      }
      case "USER_FINISH": {
        userFinishAuction(auctionItem?.auctionId);
        break;
      }
      default:
        break;
    }
  };

  const requestFinishAuction = async (auctionId?: number) => {
    if (!auctionId) return;
    setIsFinish.on();
    try {
      const rawResponse = await fetch("https://backend.blockchaindev.space/finish-auction", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auctionId: auctionId }),
      });
      const tx = await rawResponse.text();
      // setTxHash(tx);
      // onOpenSuccess();
      await getAuctions();
      await getListNFT();
    } catch (err: any) {
      toast({
        title: "Error occurs!!!",
        description: err.reason,
        status: "error",
        duration: 9000,
        position: "top",
        isClosable: true,
      });
    }
    setIsFinish.off();
  };

  const userFinishAuction = async (auctionId?: number) => {
    if (!web3Provider || !auctionId) return;
    setIsFinish.on();
    try {
      const auctionContract = new AuctionContract(web3Provider);
      const tx = await auctionContract.finishAuction(auctionId);
      setTxHash(tx);
      onOpenSuccess();
      await getAuctions();
      await getListNFT();
    } catch (err: any) {
      toast({
        title: "Error occurs!!!",
        description: err.reason,
        status: "error",
        duration: 9000,
        position: "top",
        isClosable: true,
      });
    }
    setIsFinish.off();
  };

  const waitingConfirmation = async (approvalTx: any) => {
    let approvalReceipt = await web3Provider.waitForTransaction(
      approvalTx.hash
    );
    while (!approvalReceipt) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      approvalReceipt = await web3Provider.waitForTransaction(approvalTx.hash);
    }
    return approvalReceipt;
  };

  const handlePlaceBid = async (amount: number) => {
    if (!web3Provider || !auction) return;
    setIsPlace.on();
    setIsProcessing.on();
    // const auctionId = auctions.filter((p: any) => p.tokenId === nft?.id)[0]
    //   .auctionId;
    const auctionContract = new AuctionContract(web3Provider);
    const flpContract = new FLPContract(web3Provider);
    try {
      const approvalTx = await flpContract.approve(
        auctionContract._contractAddress,
        amount
      );

      await waitingConfirmation(approvalTx);

      const tx = await auctionContract.joinAuction(auction.auctionId, amount);
      setTxHash(tx);
      setNft(undefined);
      onOpenSuccess();
      await getAuctions();
    } catch (err: any) {
      toast({
        title: "Error occurs!!!",
        description: err.reason,
        status: "error",
        duration: 9000,
        position: "top",
        isClosable: true,
      });
    }
    setIsPlace.off();
    setIsProcessing.off();
  };

  const handleCancelAuction = async (auctionId?: number) => {
    if (!auctionId) return;
    setIsCancel.on();
    const auctionContract = new AuctionContract(web3Provider);
    // const auctionId = auctions.filter((p: any) => p.tokenId === id)[0]
    //   .auctionId;
    const txHash = await auctionContract.cancelAuction(auctionId);
    setTxHash(txHash);
    setIsCancel.off();
    onOpenSuccess();
    await getAuctions();
    await getListNFT();
  };

  const handleCreateAuction = async (
    tokenId?: number,
    initialPrice?: number,
    endTime?: Date | null
  ) => {
    if (!web3Provider || !tokenId || !initialPrice || !endTime) return;

    setIsProcessing.on();
    const auctionContract = new AuctionContract(web3Provider);
    const nftContract = new NFTContract(web3Provider);
    const startTime = Math.round(new Date().getTime() / 1000 + 60);

    try {
      const approvalTx = await nftContract.approve(
        auctionContract._contractAddress,
        tokenId
      );
      await waitingConfirmation(approvalTx);
      const txHash = await auctionContract.createAuction(
        tokenId,
        initialPrice,
        startTime,
        Math.round(endTime.getTime() / 1000 + 60)
      );
      setTxHash(txHash);
      onOpenSuccess();
      await getAuctions();
      await getListNFT();
    } catch (err: any) {
      toast({
        title: "Error occurs!!!",
        description: err.reason,
        status: "error",
        duration: 9000,
        position: "top",
        isClosable: true,
      });
    }
    // const flpContract = new FLPContract(web3Provider);
    // await flpContract.approve(auctionContract._contractAddress, nft?.price);
    setNft(undefined);
    setIsProcessing.off();
    setIsAuction.off();
  };

  const handleBuyNFT = async (id?: number, price?: number) => {
    if (!web3Provider || !id || !price) return;
    if (id) setCurrentItemId(id);
    setIsBuying.on();
    const flpContract = new FLPContract(web3Provider);
    const marketContract = new MarketContract(web3Provider);
    const approvalTx = await flpContract.approve(
      marketContract._contractAddress,
      price
    );
    await waitingConfirmation(approvalTx);
    const tx = await marketContract.buyNFT(id, price);
    setTxHash(tx);
    setNft(undefined);
    setIsBuying.off();
    onOpenSuccess();
    await getListNFT();
  };

  const handleUnlistNFT = async (id?: number) => {
    if (!web3Provider || !id) return;
    setIsUnList.on();
    const marketContract = new MarketContract(web3Provider);
    const tx = await marketContract.unlistNFT(id);
    setTxHash(tx);
    setNft(undefined);
    setIsUnList.off();
    onOpenSuccess();
    await getListNFT();
  };

  const handleListNft = async (price: number) => {
    if (!price || !web3Provider || !wallet || !nft) return;
    const marketContract = new MarketContract(web3Provider);
    setIsListing.on();
    const nftContract = new NFTContract(web3Provider);
    const approvalTx = await nftContract.approve(
      marketContract._contractAddress,
      nft.id
    );
    await waitingConfirmation(approvalTx);
    const tx = await marketContract.listNFT(nft.id, price);
    setIsOpen.off();
    setTxHash(tx);
    setNft(undefined);
    setIsListing.off();
    onOpenSuccess();
    await getListNFT();
  };

  const handleTransferNft = async (address: string) => {
    if (address.length === 42 && address.startsWith("0x")) {
      if (!web3Provider || !wallet || !nft) return;
      setIsProcessing.on();
      const nftContract = new NFTContract(web3Provider);
      const txHash = await nftContract.safeTransferFrom(
        wallet?.address,
        address,
        nft.id
      );
      setIsTransfer.off();
      setTxHash(txHash);
      setNft(undefined);
      setIsProcessing.off();
      onOpenSuccess();
      await getListNFT();
    }
  };

  const handleMintNft = async (address: string | undefined) => {
    setIsMinting.on();
    if (!web3Provider || !address) return;

    // Get Minter Role
    const rawResponse = await fetch("https://backend.blockchaindev.space/grant-role", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address }),
    });

    const response = await rawResponse.text();

    const nftContract = new NFTContract(web3Provider);
    const txHash = await nftContract.mintNFT(address);
    setAction("MINT");
    setTxHash(txHash);
    onOpenSuccess();
    await getListNFT();
    setIsMinting.off();
  };

  const handleEditingPrice = async (
    newPrice: number,
    id: number | undefined
  ) => {
    if (!web3Provider || !id) return;
    const marketContract = new MarketContract(web3Provider);
    setIsProcessing.on();
    const txHash = await marketContract.updateListingPrice(id, newPrice);
    setTxHash(txHash);
    setNft(undefined);
    setIsEditing.off();
    setIsProcessing.off();
    onOpenSuccess();
    await getListNFT();
  };

  const postRequest = async (endpoint: string, address: string) => {
    let response = "";
    try {
      const rawResponse = await fetch(`https://backend.blockchaindev.space/${endpoint}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address }),
      });
      response = await rawResponse.text();
    }
    catch (err: any) {
      console.log(err.message);
      response = err.reason;
    }
    return response;
  };

  const handleFaucetBNB = async (address: string | undefined) => {
    if (!address) return;
    setFaucet("BNB");
    setIsFaucetBNB.on();
    const response = await postRequest("faucet-bnb", address);
    if (response.startsWith("0x")) {
      setTxHash(response);
      onOpenSuccess();
    } else {
      toast({
        title: "Error occurs!!!",
        description: response,
        status: "error",
        duration: 9000,
        position: "top",
        isClosable: true,
      });
    }
    setIsFaucetBNB.off();
  };

  const handleFaucetFLP = async (address: string | undefined) => {
    if (!address) return;
    setFaucet("FLP");
    setIsFaucetFLP.on();
    const response = await postRequest("faucet-flp", address);
    if (response.startsWith("0x")) {
      setTxHash(response);
      onOpenSuccess();
    }
    setIsFaucetFLP.off();
  };

  const handleFaucetUSDT = async (address: string | undefined) => {
    if (!address) return;
    setFaucet("USDT");
    setIsFaucetUSDT.on();
    const response = await postRequest("faucet-usdt", address);
    if (response.startsWith("0x")) {
      setTxHash(response);
      onOpenSuccess();
    }
    setIsFaucetUSDT.off();
  };

  return (
    <Flex w="full">
      <Tabs>
        <TabList borderBottomColor="#5A5A5A" borderBottomRadius={2} mx="15px">
          <Tab
            // textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Market
          </Tab>
          <Tab
            // textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Live Actions
          </Tab>
          <Tab
            // textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Listed Items
          </Tab>
          <Tab
            // textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            My Items
          </Tab>
          <Tab
            // textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Instruction
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftListed.map((nft, index) => {
                const isAuthor = nft.author === wallet?.address;
                return (
                  <Nft
                    item={nft}
                    key={index}
                    currentItemId={currentItemId}
                    index={index}
                    isListed={nft.owner === marketAddress}
                    isAuthor={isAuthor}
                    isUnList={isAuthor}
                    isBuying={isBuying}
                    isDisabled={!wallet?.address}
                    onAction={(a) => selectNFTAction(a, nft, index)}
                  />
                );
              })}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {auctions.map((auc, index) => {
                return (
                  <NFTAuction
                    item={auc}
                    key={index}
                    isFinish={isFinish}
                    isCancel={isCancel}
                    isPlace={isPlace}
                    isAuthor={auc.auctioneer === wallet?.address}
                    onAction={(a) => {
                      selectAuction(a, auc);
                    }}
                  />
                );
              })}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftListed.map((nft, index) => {
                let isAuthor = false;
                if (nft.author === wallet?.address) {
                  isAuthor = true;
                  return (
                    <Nft
                      item={nft}
                      key={index}
                      index={index}
                      isUnList
                      isListed={true}
                      isAuthor={isAuthor}
                      onAction={(a) => selectNFTAction(a, nft)}
                    />
                  );
                }
              })}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nfts.map((nft, index) => {
                return (
                  <Nft
                    item={nft}
                    key={index}
                    index={index}
                    isAuction
                    isListed={false}
                    isList={true}
                    isTransfer
                    isAuthor={true}
                    onAction={(a) => selectNFTAction(a, nft)}
                  />
                );
              })}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <Text mt="20px" fontSize="16px" fontWeight="bold">
              IMPORTANT: Add BSC Testnet ino the Metamask. RPC URL should be https://data-seed-prebsc-1-s1.binance.org:8545/ 
              <Spacer />
              You can follow these instructions: 
            </Text>
            <Spacer />
            <UnorderedList>
              <ListItem><Link textDecoration={"underline"} href="https://gdtk.gitbook.io/docs/metamask/them-mang/bsc-testnet" mt="20px" fontSize="16px" fontWeight="bold">
                Vietnamese Docs
              </Link></ListItem>
              <Spacer />
              <ListItem><Link textDecoration={"underline"} href="https://whitepaper.galaxywar.io/game-guide/openbeta-test/how-to-add-bsc-testnet-into-the-metamask" mt="20px" fontSize="16px" fontWeight="bold">
                English Docs
              </Link></ListItem>
            </UnorderedList>
            <Spacer />
            <Text mt="20px" fontSize="16px">
              On the right side, you can faucet some BNB for transaction fees,
              FLP for NFT prices, and a custom USDT for buying ICOs.
              <Spacer />
              You can also mint your own NFT to test these features: LIST,
              UNLIST, EDIT PRICE, TRANSFER, and AUCTION.
            </Text>
            <Spacer />
            <Text mt="20px" fontSize="16px">
              FLP Contract: 0xF52254b56ad7482A1721fc9B4B3e7F1ba793E0a9
              <Spacer />
              USDT Contract: 0x039E52Ed19D21EfEaD66d0F4a668140bbDAdEf4d
              <Spacer />
              NFT Contract: 0x22f76B1a6fF9a126CB28C4111c78FbE09D83fD20
              <Spacer />
              Market Contract: 0x9F82d8e0Cbadf3cFBB9009D1526742B6511A1849
              <Spacer />
              Auction Contract: 0x803C270AbEFfc7c2321EF37BB9d1A0424FD29DC6
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <VStack position="absolute" right="7%">
        <Button
          px="23px"
          isDisabled={isFaucetBNB}
          onClick={() => handleFaucetBNB(wallet?.address)}
        >
          {isFaucetBNB && wallet?.address ? <Spinner /> : "Faucet BNB"}
        </Button>
        <Button
          px="25px"
          isDisabled={isFaucetFLP}
          onClick={() => {
            handleFaucetFLP(wallet?.address);
          }}
        >
          {isFaucetFLP && wallet?.address ? <Spinner /> : "Faucet FLP"}
        </Button>
        <Button
          px="19px"
          isDisabled={isFaucetUSDT}
          onClick={() => {
            handleFaucetUSDT(wallet?.address);
          }}
        >
          {isFaucetUSDT && wallet?.address ? <Spinner /> : "Faucet USDT"}
        </Button>
        <Button
          // position="absolute"
          px="30px"
          isDisabled={isMinting}
          onClick={() => handleMintNft(wallet?.address)}
        >
          {isMinting && wallet?.address ? <Spinner /> : "Mint NFT"}
        </Button>
      </VStack>

      <ProcessingModal
        isOpen={isUnList || isCancel}
        onClose={() => {
          setIsUnList.off();
          setIsCancel.off();
        }}
      />

      <ListModal
        type="LISTING"
        isOpen={isOpen}
        nft={nft}
        isListing={isListing}
        onClose={() => setIsOpen.off()}
        onList={(amount) => handleListNft(amount)}
      />

      <ListModal
        type="AUCTION"
        isOpen={isAuction}
        nft={nft}
        isListing={isProcessing}
        onClose={() => setIsAuction.off()}
        onAuction={(tokenId, initialPrice, endTime) =>
          handleCreateAuction(tokenId, initialPrice, endTime)
        }
      />

      <ListModal
        type="PLACE"
        isOpen={isPlace}
        nft={auction}
        isListing={isProcessing}
        onClose={() => setIsPlace.off()}
        onList={(amount) => handlePlaceBid(amount)}
      />

      <TransferModal
        isOpen={isTransfer}
        nft={nft}
        isProcessing={isProcessing}
        onClose={() => setIsTransfer.off()}
        onTransfer={(address) => handleTransferNft(address)}
      />

      <EditListingModal
        isOpen={isEditing}
        nft={nft}
        isProcessing={isProcessing}
        onClose={() => setIsEditing.off()}
        onEditing={(newPrice) => handleEditingPrice(newPrice, nft?.id)}
      />

      <SuccessModal
        hash={txHash}
        title={
          action
            ? action === "CANCEL"
              ? "CANCEL AUCTION"
              : action === "PLACE"
              ? "PLACE A BID"
              : action === "FINISH" || action === "USER_FINISH"
              ? "FINISH AUCTION"
              : `${action} NFT`
            : `FAUCET ${faucet}`
        }
        isOpen={isSuccess}
        onClose={() => {
          setAction(undefined);
          onCloseSuccess();
        }}
      />
    </Flex>
  );
}
