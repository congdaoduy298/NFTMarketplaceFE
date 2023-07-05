import { numberFormat } from "@/utils";
import { Clarity, INFTItem, ActionType, IAuctionInfo } from "@/_types_";
import {
  Flex,
  Image,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Button,
  VStack,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import CountdownTimer from "./CountDownTimer";

interface IProps {
  item: IAuctionInfo;
  isAuthor?: boolean;
  isCancel?: boolean;
  isFinish?: boolean;
  isPlace?: boolean;
  onAction: (action: ActionType) => void;
}

export default function NftAuction({
  item,
  isAuthor,
  isCancel,
  isFinish,
  isPlace,
  onAction,
}: IProps) {
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
        <HStack w="full">
          <Text color="#fedf5680" fontWeight="bold" fontSize="14px">
            Highest bid
          </Text>
          <Spacer />
          <Text color="#fedf56" fontWeight="bold">
            {numberFormat(item.lastBid)} FLP
          </Text>
        </HStack>
      </VStack>

      <Button variant="outline" isDisabled={true} border="0px">
        <CountdownTimer
          auctionId={item.auctionId}
          targetDate={item.endTime * 1000}
          onAction={onAction}
        />
      </Button>

      <SimpleGrid w="full" columns={isAuthor ? 2 : 1} spacingX="10px" mt="10px">
        {isAuthor ? (
          <Button
            variant={"primary"}
            py="3px !important"
            onClick={() => {
              if (isAuthor) {
                onAction && onAction("USER_FINISH");
              } else onAction && onAction("PLACE");
            }}
          >
            {isFinish || isPlace ? (
              <Spinner />
            ) : isAuthor ? (
              "Finish Now"
            ) : (
              "Place a bid"
            )}
          </Button>
        ) : (
          <></>
        )}
        <Button
          variant={"primary"}
          py="3px !important"
          onClick={() => {
            if (isAuthor) {
              onAction && onAction("CANCEL");
            } else onAction && onAction("PLACE");
          }}
        >
          {isCancel ? <Spinner /> : isAuthor ? "Cancel" : "Place a bid"}
        </Button>
      </SimpleGrid>
    </Flex>
  );
}
