// src/components/NavbarSignedIn.tsx

import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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

interface NavbarSignedInProps {
  firstName: string;
  userImage: string;
  onLogout: () => void;
}

const NavbarSignedIn: React.FC<NavbarSignedInProps> = ({ firstName, userImage, onLogout }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

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
          <Text fontSize="lg" color={'#DCE1DE'} ml={1}>Welcome, {firstName}!</Text>
        </Flex>
        <HStack spacing={8} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
          <NavLink href="/items">My Items</NavLink>
          <NavLink href="/groups">My Groups</NavLink>
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
              _focus={{ boxShadow: '0 0 0 3px #49A078' }}
            >
              <Avatar size={'sm'} src={userImage} />
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
              <MenuItem as={RouterLink} to="/settings">Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
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
              <NavLink href="/items" onClick={onClose}>My Items</NavLink>
              <NavLink href="/groups" onClick={onClose}>My Groups</NavLink>
              <Button variant="link" onClick={() => { handleLogout(); onClose(); }}>Logout</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavbarSignedIn;
