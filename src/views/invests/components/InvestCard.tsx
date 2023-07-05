import { IPackage, IWalletInfo } from "@/src/_types_";
import { numberFormat } from "@/src/utils";
import { Box, Button, HStack, Image, Spinner, Text } from "@chakra-ui/react";
import React from "react";

interface IProps {
  pak: IPackage;
  isProcessing: boolean;
  rate: number;
  walletInfo?: IWalletInfo;
  onBuy?: () => void;
}

export default function InvestCard({
  pak,
  isProcessing,
  rate,
  walletInfo,
  onBuy,
}: IProps) {
  return (
    <Box
      w="340px"
      bg="bg.secondary"
      borderRadius="16px"
      overflow="hidden"
      padding="10px"
      border="1px solid rgba(254, 223, 86, 0.6)"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Box
        bgImage={`/${pak.bg}`}
        w="full"
        h="210px"
        borderRadius="16px"
        bgSize="cover"
        bgPos="center"
      />

      <Box
        w="120px"
        margin="0px auto"
        borderRadius="full"
        marginTop="-60px"
        position="relative"
      >
        <Image
          src={`/${pak.icon}`}
          alt="bnb"
          w="120px"
          borderRadius="full"
          objectFit="cover"
          border="6px solid rgba(252, 223, 86, 0.6)"
        />

        <Image
          src="/verified.svg"
          w="80px"
          alt="verified"
          position="absolute"
          bottom="-30px"
          right="-20px"
        />
      </Box>

      <Text my="20px" fontSize="24px" fontWeight="bold">
        {pak.name}
      </Text>

      <Button
        isDisabled
        variant="primary"
        my="20px"
        bg="transparent"
        border="1px solid #fff"
        color="rgba(255, 255, 255, 0.7)"
      >
        {numberFormat(pak.amount)} FLP
      </Button>

      <HStack my="15px">
        <Text color="gray">Amount of coins to pay:</Text>
        <Text variant="NotoSan" fontSize="16px">
          {numberFormat(pak.amount / rate)} {pak.token}
        </Text>
      </HStack>

      <Button
        w="full"
        variant="secondary"
        isDisabled={!walletInfo?.address || isProcessing}
        onClick={onBuy}
      >
        {isProcessing ? <Spinner /> : "Buy now"}
      </Button>
    </Box>
  );
}
