import * as React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Grid,
  GridItem,
  Input,
  Select,
  Textarea,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { Bech32, toHex } from "@cosmjs/encoding";
import { FileUpload, TransactionLink } from "../../components"
import {
  CW721,
  unSanitizeIpfsUrl,
  uploadFile,
  useSdk,
} from "../../services";
import { config } from "../../../config";

function generateId(address: string) {
  // TODO: Format ID?
  const pubkey = toHex(Bech32.decode(address).data);
  return (
    pubkey?.substr(2, 10) +
    pubkey?.substring(pubkey.length - 8) +
    '-' +
    Math.random().toString(36).substr(2, 9)
  ).toUpperCase();
}

export const Create = () => {
  const toast = useToast();
  const history = useHistory();
  const { getSignClient, address } = useSdk();
  const [files, setFiles] = useState<File[]>();
  const [nftName, setNftName]= useState<string>();
  const [description, setDescription]= useState<string>();
  const [loading, setLoading] = useBoolean();

  async function createNft(e: any) {
    // TODO: use formik validations
    e.preventDefault();

    if (!address) {
      toast({
        title: "Account required.",
        description: "Please connect wallet.",
        status: "warning",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    setLoading.on();
    // TODO: Load on init page and show after load page
    const nftId = generateId(address);

    try {
      const fileHash = await uploadFile(files[0]);
      console.log(fileHash, nftId);
      const nftMsg = {
        token_id: nftId,
        owner: address,
        name: nftName!,
        description: description,
        image: unSanitizeIpfsUrl(fileHash)
      };

      const contract = CW721(config.contract).useTx(getSignClient()!);
      const txHash = await contract.mint(address, nftMsg);

      toast({
        title: `Successful Transaction`,
        description: (<TransactionLink tx={txHash} />),
        status: "success",
        position: "bottom-right",
        duration: 1000,
        isClosable: true,
      });

      setLoading.off();
      history.push(`/account/token/${nftId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        position: "bottom-right",
        duration: 2000,
        isClosable: true,
      });
      setLoading.off();
    }
  }

  return (
  <Flex
    p={4}
    mb={8}
    justifyContent="center"
    direction="row">
    <Box w="80%">
      <Box>
        <Box mt={6} mb={10}>
          <Heading as="h3" fontSize="2xl">Create NFT Collection</Heading>
        </Box>
        <Box as={'form'} id="nft-form" onSubmit={createNft}>
        <Grid  
          h='90%'
          templateRows='repeat(7, 1fr)'
          templateColumns='repeat(5, 1fr)'
          gap={6}>
            <GridItem rowSpan={7} colSpan={5}>
            <Flex>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Cover Image</FormLabel>
                <FileUpload accept="image/*" onDrop={acceptedFiles => setFiles(acceptedFiles)} />
              </FormControl>
            </Flex>
            </GridItem>

            {/*Left Column*/}
            <GridItem rowSpan={4} colSpan={2}>
            <Box p={2}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Collection Name</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </Box>
            <Box p={2}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Cover Image URL</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </Box>
            <Box p={2}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Collection URL</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </Box>
            <Box p={2}>
              <FormControl id="royaltiesAddr" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Royalties Address</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </Box>
            </GridItem>

            {/*Middle Row*/}
            <GridItem rowSpan={4} colSpan={2}>
            <Box p={2}>
              <FormControl id="description" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Collection Description</FormLabel>
                <Textarea name="description"
                  placeholder="NFT description"
                  spellCheck={false}
                  onChange={e => setDescription(e.target.value)} />
              </FormControl>
            </Box>
            <Box p={2}>
              <FormControl id="whitelist">
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Mint Whitelist</FormLabel>
                <Textarea name="whitelist"
                  placeholder="juno1w..., juno2c..., etc.."
                  spellCheck={false}
                  onChange={e => setDescription(e.target.value)} />
              </FormControl>
            </Box>
            </GridItem>

            {/*Right Row*/}
            <GridItem rowSpan={4} colSpan={1}>
            <Box p={2}>
              <FormControl id="mintOption" isRequired>
                <FormLabel>Mint Option</FormLabel>
                <Select placeholder='Mint Option'>
                  <option>Standard Mint - No Fee</option>
                  <option>Curated Mint - 10 Juno Fee</option>
                </Select>
              </FormControl>
            </Box>
            <Box p={2}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Mint Price</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </Box>
            <Box p={2}>
              <FormControl id="name">
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Whitelist Price</FormLabel>
                <Input
                  name="whitelist_price"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </Box>
            </GridItem>

 {/*           <GridItem colSpan={2}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Cover Image URL</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </GridItem>
            </Flex>

            <GridItem rowSpan={2} colSpan={2}>
              <FormControl id="description" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Collection Description</FormLabel>
                <Textarea name="description"
                  placeholder="NFT description"
                  spellCheck={false}
                  onChange={e => setDescription(e.target.value)} />
              </FormControl>
            </GridItem>           



            <GridItem rowSpan={1} colSpan={2}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Collection URL</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </GridItem>
            <Box>
            <GridItem colSpan={2} rowSpan={2}>
              <FormControl id="whitelist">
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Mint Whitelist</FormLabel>
                <Textarea name="whitelist"
                  placeholder="juno1w..., juno2c..., etc.."
                  spellCheck={false}
                  onChange={e => setDescription(e.target.value)} />
              </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel>Curated Mint Option</FormLabel>
                <Select placeholder='Mint Option'>
                  <option>Standard Mint - No Fee</option>
                  <option>Curated Mint - 10 Juno Fee</option>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Mint Price</FormLabel>
                <Input
                  name="name"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl id="name">
                <FormLabel
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                >Whitelist Price</FormLabel>
                <Input
                  name="whitelist_price"
                  spellCheck={false}
                  onChange={e => setNftName(e.target.value)} />
              </FormControl>
            </GridItem>
            </Box>

*/}


          </Grid>
          <Box mt={10}  align='center'>
            <Button
              isLoading={loading}
              loadingText="Minting"
              type="submit"
              height="var(--chakra-sizes-10)"
              size='lg'
              fontSize={'md'}
              fontWeight="semibold"
              borderRadius={'50px'}
              color={'black'}
              bg="gray.500"
              _hover={{
                bg: "gray.400",
              }}>
              Create Collection
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  </Flex>
  );
}
