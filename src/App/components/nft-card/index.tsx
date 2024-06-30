import {
  Box,
  chakra,
  Divider,
  Flex,
  Image,
} from "@chakra-ui/react";
import * as React from "react";
import { NftInfo } from "../../services/type";
// import { NftTrait } from "./nft-trait";
import defaultNftImage from "../../assets/Event16_439.jpeg";

interface NftCardProps {
  readonly nft: NftInfo;
}

export function NftCard({ nft }: NftCardProps): JSX.Element {
  return (
    <Flex
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="full">
        <Image
          bgGradient="linear(to-r, gray.900, pink.20)"
          roundedTop="lg"
          h={56}
          w="full"
          fit="cover"
          src={nft.image}
          fallbackSrc={defaultNftImage}
          alt={nft.title}
        />
        <Box px={4} bg="pink.20" roundedBottom="md">
          <Box py={2}>
            <chakra.p
              mt={1}
              fontSize="s"
              color="gray.900"
            >
              Owner: {nft.user}
            </chakra.p>
            <chakra.h1
              color={"gray.900"}
              fontWeight="bold"
              fontSize="xl"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              title={nft.title}
            >
              {nft.title}
            </chakra.h1>
            <chakra.p
              mt={1}
              fontSize="xs"
              color="gray.900"
            >
              {nft.total === 1 ? "1 Listed For Sale" : `${nft.total} Listed For Sale`}
            </chakra.p>
          </Box>
          <Divider />
          <Box
            py={3}
            color="gray.900"
          >
{/*            <Text fontSize="xs">
              Price
            </Text>*/}
            <chakra.h1 fontWeight="bold" fontSize="sm">
              {"Price: " + nft.price}
            </chakra.h1>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
