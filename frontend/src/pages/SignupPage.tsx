import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Link,
  Flex,
  Text,
  HStack,
} from "@chakra-ui/react";

const SignupPage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      minHeight="100vh"
      width="100vw"
      bg="#DCE1DE"
      p={4}
      pt={{ base: "1rem", md: "0.5rem" }} // Reduced top padding to prevent overlap with navbar
    >
      <Box
        p={8}
        width={{ base: "full", sm: "md", lg: "lg" }}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
        mt={{ base: "1rem", md: "0.5rem" }} // Reduced top margin to prevent overlap with navbar
      >
        <VStack spacing={6}>
          <Text fontSize="2xl" color="#216869">
            Create New Account
          </Text>
          <HStack
            spacing={6}
            width="full"
            flexDirection={{ base: "column", md: "row" }}
          >
            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
              />
            </FormControl>
          </HStack>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
            />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
            />
          </FormControl>
          <Button colorScheme="teal" variant="solid" width="full">
            Sign Up
          </Button>
          <Link color="teal.500" href="/login">
            Already have an account? Log In
          </Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default SignupPage;
