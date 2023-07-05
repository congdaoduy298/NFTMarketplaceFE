declare var window: any;

import { Clarity, INFTItem, ActionType } from "@/_types_";
import {
  setWalletInfo,
  setWeb3Provider,
} from "@/reduxs/accounts/account.slices";
import { useAppDispatch } from "@/reduxs/hooks";
import {
  Flex,
  Image,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Button,
  Spacer,
  VStack,
  useBoolean,
  Spinner,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";

interface IProps {
  item: INFTItem;
  currentItemId?: number;
  index: number;
  isTransfer?: boolean;
  isUnList?: boolean;
  isListed?: boolean;
  isList?: boolean;
  isBuying?: boolean;
  isAuction?: boolean;
  isAuthor?: boolean;
  isDisabled?: boolean;
  onAction?: (action: ActionType) => void;
}

export default function Nft({
  item,
  currentItemId,
  index,
  isTransfer,
  isAuction,
  isListed,
  isList,
  isUnList,
  isBuying,
  isAuthor,
  isDisabled,
  onAction,
}: IProps) {
  const dispatch = useAppDispatch();

  const onConnectMetamask = async () => {
    if (window.ethereum) {
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

      dispatch(setWalletInfo({ address, bnb: bnbBalance }));
      dispatch(setWeb3Provider(provider));
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bg="#151D14"
      px="10px"
      py="10px"
      borderRadius="10px"
    >
      <Box position="relative">
        <Image
          src={item.image}
          alt={item.name}
          objectFit="cover"
          borderRadius="10px"
        />
        <Box position="absolute" top={5} right={10}>
          <Text fontWeight="bold" fontSize="40px" fontStyle="italic">
            {
              Clarity[
                item.attributes?.find((p) => p.trait_type === "Rarity")
                  ?.value || 0
              ]
            }
          </Text>
        </Box>
        <HStack bg="rgba(0,0,0,0.4)" position="absolute" top={5} px="10px">
          <Text>ID: {item.id.toString().padStart(5, "0")}</Text>
        </HStack>
      </Box>

      <VStack w="full" alignItems="flex-start">
        <Text
          fontWeight="bold"
          py="10px"
          fontSize="20px"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {item.name}
        </Text>
        {isListed && (
          <HStack w="full">
            <Text color="#fedf5680" fontWeight="bold" fontSize="16px">
              Price:
            </Text>
            <Spacer />
            <Text color="#fedf56" fontWeight="bold">
              {item.price} FLP
            </Text>
          </HStack>
        )}
      </VStack>

      {!isAuthor && (
        <Button
          variant="secondary"
          w="full"
          mt="10px"
          onClick={() => {
            if (isDisabled) {
              onConnectMetamask();
            } else {
              onAction && onAction("BUY");
            }
          }}
          disabled={isBuying || isDisabled}
        >
          {isBuying && item?.id === currentItemId ? (
            <Spinner />
          ) : isDisabled ? (
            "Connect wallet"
          ) : (
            "Buy Now"
          )}
        </Button>
      )}

      {isList && isAuction && (
        <SimpleGrid w="full" mt="10px" columns={2} spacingX="10px">
          <Button
            variant="secondary"
            onClick={() => onAction && onAction("LIST")}
          >
            List
          </Button>
          <Button
            variant="secondary"
            onClick={() => onAction && onAction("AUCTION")}
          >
            Auction
          </Button>
        </SimpleGrid>
      )}
      {isTransfer && (
        <Button
          variant="secondary"
          w="full"
          mt="10px"
          onClick={() => onAction && onAction("TRANSFER")}
        >
          Transfer
        </Button>
      )}
      {isAuthor && isUnList && (
        <SimpleGrid w="full" mt="10px" columns={2} spacingX="10px">
          <Button
            variant="secondary"
            onClick={() => onAction && onAction("EDIT")}
          >
            Edit Listing
          </Button>
          <Button
            variant="secondary"
            onClick={() => onAction && onAction("UNLIST")}
          >
            Unlist
          </Button>
        </SimpleGrid>
      )}
    </Flex>
  );
}
