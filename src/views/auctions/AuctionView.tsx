import { useAppSelector } from "@/reduxs/hooks";
import React from "react";
import NFTContract from "@/contracts/NFTContract";
import MarketContract from "@/contracts/MarketContract";
import { IAuctionInfo, INFTItem } from "@/_types_";
import { Flex, SimpleGrid, useBoolean } from "@chakra-ui/react";
import NFTAuction from "./components/NFTAuction";
import AuctionModal from "./components/AuctionModal";
import AuctionContract from "@/contracts/AuctionContract";
import { SuccessModal } from "@/components";
import FLPContract from "@/contracts/FLPContract";

export default function AuctionView() {
  const { web3Provider, wallet } = useAppSelector(
    (state: any) => state.account
  );
  const [nfts, setNfts] = React.useState<IAuctionInfo[]>([]);
  const [nftSelected, setNftSelected] = React.useState<IAuctionInfo>();
  const [isOpen, setIsOpen] = useBoolean();
  const [isAuctionSuccess, setIsAuctionSuccess] =
    React.useState<boolean>(false);

  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [txHash, setTxHash] = React.useState<string>();

  const getListAuctions = React.useCallback(async () => {
    if (!web3Provider) return;
    const auctionContract = new AuctionContract(web3Provider || undefined);
    const nfts = await auctionContract.getAuctionByStatus(true);
    const nftContract = new NFTContract(web3Provider);
    const auctionItems = await nftContract.getNFTAuctionInfo(nfts);
    setNfts(auctionItems);
  }, [web3Provider]);

  React.useEffect(() => {
    getListAuctions();
  }, [getListAuctions]);

  const handleAuction = async (bid: number) => {
    if (!web3Provider || !nftSelected) return;
    setIsProcessing(true);
    try {
      const auctionContract = new AuctionContract(web3Provider);
      const flpContract = new FLPContract(web3Provider);
      await flpContract.approve(auctionContract._contractAddress, bid);
      const tx = await auctionContract.joinAuction(nftSelected.auctionId, bid);
      setTxHash(tx);
      setIsAuctionSuccess(true);
      setIsOpen.off();
      await getListAuctions();
    } catch (ex: any) {
      setIsAuctionSuccess(false);
    }
    setIsProcessing(false);
  };

  return (
    <Flex w="full">
      <SimpleGrid columns={4} spacing="20px">
        {nfts.map((nft) => (
          <NFTAuction
            item={nft}
            key={nft.id}
            onAction={() => {
              setNftSelected(nft);
              setIsOpen.on();
            }}
          />
        ))}
      </SimpleGrid>

      <AuctionModal
        isOpen={isOpen}
        isProcessing={isProcessing}
        nft={nftSelected}
        onClose={() => setIsOpen.off()}
        onAuction={(amount) => handleAuction(amount)}
      />

      <SuccessModal
        hash={txHash}
        isOpen={isAuctionSuccess}
        onClose={() => setIsAuctionSuccess(false)}
      />
    </Flex>
  );
}
