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
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({
  updateState,
}: {
  updateState: any;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("submitting form");
    if (username === "" || password === "") {
      alert("Please fill out all fields");
      return;
    } else {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) {
        const data = await res.json();
        updateState.setToken(data.token);
        updateState.setUser(data.existingUser);
        console.log("Login successful!");
        navigate("/");
      } else {
        const err = await res.text();
        console.log("Login failed:", err);
      }
    }
  };

  // Responsive styles for input fields
  // const inputVariant = useBreakpointValue({ base: "outline", md: "filled" });

  return (
    <Flex
      align="center"
      justify="center"
      p={{ base: 4, md: 0 }}
      minHeight="100vh"
      width="100vw"
      bg="#DCE1DE"
    >
      <Box
        p={{ base: 4, md: 8 }}
        width="full"
        maxW={{ base: "90%", md: "md" }}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6}>
          <Text fontSize={{ base: "xl", md: "2xl" }} color="#216869">
            Login
          </Text>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="username"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            variant="solid"
            width="full"
            onClick={handleSubmit}
          >
            Login
          </Button>
          <Link color="teal.500" href="/signup">
            Create New Account
          </Link>
          <Link color="teal.600" href="#">
            Forgot Your Password?
          </Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
