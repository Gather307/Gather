import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Link,
  Flex,
  Text
} from '@chakra-ui/react';

const LoginPage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      width="100vw"
      bg="#DCE1DE"
    >
      <Box p={8} width="full" maxW="md" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <VStack spacing={6}>
          <Text fontSize="2xl" color="#216869">Login</Text>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" borderColor="#216869" _hover={{ borderColor: '#49A078' }} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" borderColor="#216869" _hover={{ borderColor: '#49A078' }} />
          </FormControl>
          <Button colorScheme="teal" variant="solid" width="full">Login</Button>
          <Link color="teal.500" href="/signup">Create New Account</Link>
          <Link color="teal.600" href="#">Forgot Your Password?</Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
