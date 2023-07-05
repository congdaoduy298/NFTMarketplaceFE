declare var window: any;
import React from "react";
import {
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectWallet, SuccessModal, WalletInfo } from "../../components";
import { IPackage, IRate, IWalletInfo, TOKEN } from "../../_types_";
import { ethers } from "ethers";
import InvestCard from "./components/InvestCard";
import { packages } from "@/src/constants";
import CrowdSaleContract from "@/src/contracts/CrowdSaleContract";
import UsdtContract from "@/src/contracts/USDTContract";
import { useAppSelector } from "@/reduxs/hooks";

export default function InvestView() {
  const { web3Provider, wallet } = useAppSelector(
    (state: any) => state.account
  );
  const [rate, setRate] = React.useState<IRate>({ bnbRate: 0, usdtRate: 0 });
  const [isProcessing, setIsProcessing] = useBoolean();
  const [pak, setPak] = React.useState<IPackage>();
  const [txHash, setTxHash] = React.useState<string>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleBuyIco = async (pk: IPackage) => {
    if (!web3Provider) return;
    setPak(pk);
    setIsProcessing.on();
    let hash = "";
    const crowdContract = new CrowdSaleContract(web3Provider);
    if (pk.token === TOKEN.USDT) {
      const usdtContract = new UsdtContract(web3Provider);
      await usdtContract.approve(
        crowdContract._contractAddress,
        pk.amount / rate.usdtRate
      );
      hash = await crowdContract.buyTokenByUSDT(pk.amount);
    } else {
      hash = await crowdContract.buyTokenByBNB(pk.amount);
    }
    setTxHash(hash);
    setIsProcessing.off();
    onOpen();
    try {
    } catch (err: any) {}
  };

  const getRate = React.useCallback(async () => {
    const crownContract = new CrowdSaleContract();
    const bnbRate = await crownContract.getBnbRate();
    const usdtRate = await crownContract.getUsdtRate();
    setRate({ bnbRate, usdtRate });
  }, []);

  React.useEffect(() => {
    getRate();
  }, [getRate]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, lg: 3 }} w="full" spacing={10}>
        {packages.map((pk, index) => (
          <InvestCard
            pak={pk}
            key={String(index)}
            isProcessing={isProcessing && pak?.key === pk.key}
            rate={pk.token === TOKEN.BNB ? rate.bnbRate : rate.usdtRate}
            walletInfo={wallet}
            onBuy={() => handleBuyIco(pk)}
          />
        ))}
      </SimpleGrid>

      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        hash={txHash}
        title="Buy ICO"
      />
    </>
  );
}