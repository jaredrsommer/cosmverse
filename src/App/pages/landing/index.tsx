import * as React from "react"
import {
  // Text,
  // Box,
  Grid,
  StackDivider,
  VStack,
} from "@chakra-ui/react"
import { NftSection } from "../../components"

export const Landing = () => {
  return (
    <Grid m={4}>
{/*      <Box mt={5} mb={8}>
        <Text
          fontFamily="mono"
          fontSize="xlg"
          fontWeight="900">
          Hera Galleria
        </Text>
      </Box>*/}

      <VStack
        divider={<StackDivider borderColor="pink.20"/>}
        spacing={4}
        align="stretch"
      >
        <NftSection title="Curated work" />
        <NftSection title="New listed" />
        <NftSection title="New minted" />
      </VStack>
    </Grid>
  );
}
