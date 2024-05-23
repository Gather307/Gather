import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Box,
  Link,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = ({
  stateVariable,
  updateState,
}: {
  stateVariable: any;
  updateState: any;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSumbit = async (e: React.FormEvent) => {
    console.log("submitting form");
    e.preventDefault();
    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      username === ""
    ) {
      alert("Please fill out all fields");
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    } else {
      fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        }),
      }).then(async (res) => {
        if (res.status === 201) {
          const data = await res.json();
          updateState.setToken(data.token);
          updateState.setUser(data.newUser);
          console.log(stateVariable);
          console.log("Account created successfully!");
          const login = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),

          });
          if (login.status === 200) {
            const data = await login.json();
            updateState.setToken(data.token);
            console.log("Login successful!");
            navigate("/");
          } else {
            const err = await res.text();
            console.log("Login failed:", err);
          }
        } else {
          const err = await res.text();
          console.log("Account creation failed:", err);
        }
      });
    }
  };

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
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
          </HStack>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            variant="solid"
            width="full"
            onClick={handleSumbit}
          >
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
