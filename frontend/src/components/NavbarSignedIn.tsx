import React from 'react';
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
  Image,
  Link
} from '@chakra-ui/react';
import logo from '../assets/target.png'; // path to logo change later

const NavLink = ({ children, href = '#' }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    href={href}
    color={'#DCE1DE'}
    _hover={{
      textDecoration: 'underline',
      color: '#DCE1DE',
      bg: 'transparent'
    }}
    style={{ fontWeight: '500' }}
  >
    {children}
  </Link>
);

const NavbarSignedIn = ({ userName = "User", userImage = "/path-to-user-image.png" }) => {
  return (
    <Box bg={'#216869'} px={4}>
      <Flex
        minH={'60px'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <Flex align="center" ml={2}>
          <Link to="/">
            <Image src={logo} alt="Logo" boxSize="32px" mr={3} />
          </Link>
          <Text fontSize="lg" color={'#DCE1DE'} ml={1}>Welcome, {userName}!</Text>
        </Flex>
        <HStack spacing={8} alignItems={'center'}>
          <NavLink href="#">My Items</NavLink>
          <NavLink href="#">My Groups</NavLink>
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
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavbarSignedIn;
