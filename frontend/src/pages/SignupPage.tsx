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
import { useState } from 'react';

const SignupPage = () => {
  const handleSumbit  = async (e: React.FormEvent) => {
    console.log('submitting form');
    e.preventDefault();
    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      alert("Please fill out all fields");
      return;
    } else if (
      password !== confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    } else {
      fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: firstName+lastName,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        })
      }).then((res) => {
        if (res.status === 200) {
          alert('Account created successfully!');
        } else {
          alert('Account creation failed');
        }
      });
    }
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


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
          <Text fontSize="2xl" color="#216869">Create New Account</Text>
          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input type="text" borderColor="#216869" _hover={{ borderColor: '#49A078' }} onChange={(e) => setFirstName(e.target.value)}/>
          </FormControl>
          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input type="text" borderColor="#216869" _hover={{ borderColor: '#49A078' }} onChange={(e) => setLastName(e.target.value)}/>
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" borderColor="#216869" _hover={{ borderColor: '#49A078' }} onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" borderColor="#216869" _hover={{ borderColor: '#49A078' }} onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
          <FormControl id="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password" borderColor="#216869" _hover={{ borderColor: '#49A078' }} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </FormControl>
          <Button colorScheme="teal" variant="solid" width="full" onSubmit={handleSumbit}>Sign Up</Button>
          <Link color="teal.500" href="/login">Already have an account? Log In</Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default SignupPage;