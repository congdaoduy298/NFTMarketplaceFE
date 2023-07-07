declare var window: any;
import { ConnectWallet, WalletInfo } from "@/components";
import { menus } from "@/constants";
import {
  setWalletInfo,
  setWeb3Provider,
} from "@/reduxs/accounts/account.slices";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import { Flex, Heading, Spacer, Text, useBoolean } from "@chakra-ui/react";
import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect, ReactNode, useState, createContext } from "react";

interface IProps {
  children: ReactNode;
}

export default function MainLayout({ children }: IProps) {
  const dispatch = useAppDispatch();
  const { wallet } = useAppSelector((state) => state.account);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  let isConnected = false;

  useEffect(() => {
    const connectAccount = async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        undefined
      );
      await provider.send("eth_requestAccounts", []);
      const signerAccount = provider.getSigner();
      if (signerAccount) {
        let tempWallet = { address: "", bnb: 0 };
        await signerAccount
          .getAddress()
          .then((address) => {
            isConnected = true;
            setAccount(address);
            tempWallet.address = address;
          })
          .catch((error) => console.log("Can not get address."));
        if (isConnected) {
          await signerAccount
            .getBalance()
            .then((balance) => {
              const etherBalance = ethers.utils.formatEther(balance);
              tempWallet.bnb = Number(etherBalance);
              setBalance(etherBalance);
            })
            .catch((error) => console.log("Can not get balance."));
          dispatch(setWalletInfo(tempWallet));
          dispatch(setWeb3Provider(provider));
        }
      }
    };
    connectAccount();
  }, []);

  useEffect(() => {
    if (!wallet) return;
    setAccount(wallet?.address);
    setBalance(String(wallet?.bnb));
  }, [wallet]);

  const onConnectMetamask = async () => {
    // Remember add right RPC to Metamask to sync data better
    //     (when use testnet do not use Chainlink to add anetwork).
    if (window.ethereum) {
      // window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        undefined
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await signer.getBalance();
      const bnbBalance = Number.parseFloat(
        ethers.utils.formatEther(bigBalance)
      );
      setAccount(address);
      setBalance(String(bnbBalance));

      dispatch(setWalletInfo({ address, bnb: bnbBalance }));
      dispatch(setWeb3Provider(provider));
    }
  };

  return (
    <Flex
      w={{ base: "full", lg: "70%" }}
      flexDirection="column"
      margin="50px auto"
    >
      <Flex w="full" alignItems="center" justifyContent="center">
        <Heading size="lg" fontWeight="bold">
          Blockchain Trainee
        </Heading>
        <Spacer />
        {menus.map((menu) => (
          <Link href={menu.url} key={menu.url}>
            <Text mx="20px" fontSize="20px">
              {menu.name}
            </Text>
          </Link>
        ))}

        {account === "" && <ConnectWallet onClick={onConnectMetamask} />}
        {account !== "" && (
          <WalletInfo address={account} amount={balance || 0} />
        )}
      </Flex>

      <Flex w="full" flexDirection="column" py="50px">
        {children}
      </Flex>
    </Flex>
  );
}
