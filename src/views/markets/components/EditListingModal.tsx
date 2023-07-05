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
  onEditing?: (newPrice: number) => void;
}

export default function ListModal({
  nft,
  isProcessing,
  onEditing,
  ...props
}: IProps) {
  const [newPrice, setNewPrice] = React.useState(0);

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
                Set new price
              </Text>
              <Flex w="full" my="10px">
                <Input
                  w="full"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  type="string"
                />
                <Text
                  fontWeight="bold"
                  fontSize="24px"
                  position="absolute"
                  right="40px"
                  color="rgba(255,255,255,0.4)"
                >
                  FLP
                </Text>
              </Flex>

              <Button
                variant="secondary"
                onClick={() => onEditing && onEditing(newPrice)}
              >
                {isProcessing ? <Spinner /> : "Continue"}
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
