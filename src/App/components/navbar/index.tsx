import * as React from "react";

import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CloseIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';

import { AccountButton } from "../account-button";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { Link as ReactRouterLink } from "react-router-dom"
import junoLogo from "../../assets/tokens/heracm.svg";
import heraLogo from "../../assets/hera_text.svg";

export function Navbar(): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white.900', 'black.900')}
        color={useColorModeValue('white.200', 'white.200')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderBottomColor={useColorModeValue('black.900', 'white.200')}
        align={'center'}>
        <Flex
          flex={{ base: 0, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }}>
          <Link
            as={ReactRouterLink}
            to="/"
            _hover={{
              textDecoration: 'none',
            }}>
             <Image src={junoLogo} alt="juno logo" height={10} />
          </Link>
          <Link
            as={ReactRouterLink}
            to="/landing"
            _hover={{
              textDecoration: 'none',
            }}>
             <Image src={heraLogo} alt="hera text logo" height={10} width={56}/>
          </Link>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <DesktopNav />
          <AccountButton />
          <ColorModeSwitcher display={{ base: 'none', md: 'inline-flex' }} />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={5} display={{ base: 'none', md: 'inline-flex' }}>
      <Link
        as={ReactRouterLink}
        to="/gallery"
        p={1.5}
        verticalAlign={"middle"}
        height="var(--chakra-sizes-8)"
        fontSize={'sm'}
        fontWeight={500}
        borderRadius={'25px'}
        bg='black.900'
        _hover={{
          color: useColorModeValue('light', 'dark'),
        }}>
<<<<<<< HEAD
        Gallery
=======
        Galleria
>>>>>>> a079383 (Adding Initial Branding)
      </Link>
      <Button
        as={ReactRouterLink}
        to="/create"
        verticalAlign={"middle"}
        height="var(--chakra-sizes-8)"
        fontSize={'sm'}
        fontWeight={500}
        borderRadius={'25px'}
        bg='black.900'
        _hover={{
          color: useColorModeValue('light', 'dark'),
        }}>
        Create
      </Button>
      <Button
        as={ReactRouterLink}
        to="/account"
        verticalAlign={"middle"}
        height="var(--chakra-sizes-8)"
        fontSize={'sm'}
        fontWeight={500}
        borderRadius={'25px'}
        bg='black.900'
        _hover={{
          color: useColorModeValue('light', 'dark'),
        }}>
        My NFT's
      </Button>
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white.200', 'black.900')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={ReactRouterLink}
        to={href}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('black.900', 'white.200')}>
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Galleria',
    href: '/gallery',
  },
  {
    label: 'Create',
    href: '/create',
  },
  {
    label: 'Account',
    href: '/account',
  },
];
