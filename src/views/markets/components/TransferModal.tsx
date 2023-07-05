import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Flex,
  ModalCloseButton,
  Image,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { INFTItem } from "@/_types_";
import React from "react";

interface IProps extends Omit<ModalProps, "children"> {
  nft?: INFTItem;
  isProcessing?: boolean;
  onTransfer?: (address: string) => void;
}

export default function ListModal({
  nft,
  isProcessing,
  onTransfer,
  ...props
}: IProps) {
  const [address, setAddress] = React.useState<string>("");

  return (
    <Modal closeOnOverlayClick={false} {...props}>
      <ModalOverlay
        blur="2xl"
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent py="30px">
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" w="full" direction="column">
            <Image
              src={nft?.image}
              alt={nft?.name}
              borderRadius="20px"
              w="80%"
              mb="20px"
            />

            <Flex w="full" direction="column">
              <Text
                fontSize="15px"
                fontStyle="italic"
                color="rgba(255,255,255,0.5"
              >
                Type your wallet address:
              </Text>
              <Flex w="full" my="10px">
                <Input
                  w="full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="string"
                />
              </Flex>

              <Button
                variant="secondary"
                onClick={() => onTransfer && onTransfer(address)}
              >
                {isProcessing ? <Spinner /> : "Transfer"}
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
