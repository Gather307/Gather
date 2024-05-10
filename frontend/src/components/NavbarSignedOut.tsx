import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Image,
} from '@chakra-ui/react';
import logo from '../../public/target.png';

const NavbarSignedOut = () => {
  return (
    <Box bg={'#216869'} px={4}>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
        justify={'space-between'}>
        <Flex align="center" ml={2}>
          <Link to="/">
            <Image src={logo} alt="Logo" boxSize="32px" mr={3} />
          </Link>
          <Text fontSize="lg" color={'#DCE1DE'} ml={1}>Welcome, Gatherer!</Text>
        </Flex>
        <HStack spacing={8} alignItems={'center'}>
          <Button
            as={Link}
            to="/login"
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            _hover={{
              textDecoration: 'underline',
              color: '#DCE1DE'
            }}
            color={'#DCE1DE'}>
            Sign In
          </Button>
          <Button
            as={Link}
            to="/signup"
            fontSize={'sm'}
            fontWeight={600}
            color={'#DCE1DE'}
            bg={'#49A078'}
            _hover={{
              bg: '#9CC5A1',
              color: '#1F2421'
            }}>
            Sign Up
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavbarSignedOut;
