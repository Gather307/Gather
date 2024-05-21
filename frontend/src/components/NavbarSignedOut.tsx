// src/components/NavbarSignedOut.tsx

import {
  Box,
  Flex,
  Text,
  HStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  useDisclosure,
  Image,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import logo from '../../public/target.png';
import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const NavLink = ({ children, href = '#' }: { children: ReactNode, href?: string }) => (
  <Link
    as={RouterLink}
    to={href}
    px={2}
    py={1}
    rounded={'md'}
    color={'#DCE1DE'}
    _hover={{
      textDecoration: 'underline',
      color: '#DCE1DE',
      bg: 'transparent',
    }}
    style={{ fontWeight: '500' }}
  >
    {children}
  </Link>
);

const NavbarSignedOut: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={'#216869'} px={4}>
      <Flex
        minH={'60px'}
        alignItems={'center'}
        justifyContent={'space-between'}
        wrap="wrap"
      >
        <Flex align="center" ml={2}>
          <Link as={RouterLink} to="/">
            <Image src={logo} alt="Logo" boxSize="32px" mr={3} />
          </Link>
          <Text fontSize="lg" color={'#DCE1DE'} ml={1}>Welcome!</Text>
        </Flex>
        <HStack spacing={8} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
          <NavLink href="/login">Login</NavLink>
          <NavLink href="/signup">Sign Up</NavLink>
        </HStack>
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              <NavLink href="/login" onClick={onClose}>Login</NavLink>
              <NavLink href="/signup" onClick={onClose}>Sign Up</NavLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavbarSignedOut;
