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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { createUser, loginUser } from "../../lib/posts";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const navigate = useNavigate();

  const handleSumbit = async (e: React.FormEvent) => {
    console.log("submitting form");
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message
    setUsernameError(false); // Clear previous username error state
    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill out all fields");
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    } else {
      try {
        const user = { firstName, lastName, username, email, password };
        const res = await createUser(user);
        if (res.status === 201) {
          const data = await res.json();
          updateState.setToken(data.token);
          updateState.setUser(data.newUser);
          console.log(stateVariable);
          console.log("Account created successfully!");

          const loginRes = await loginUser({ username, password });
          if (loginRes.status === 200) {
            const loginData = await loginRes.json();
            updateState.setToken(loginData.token);
            localStorage.setItem("token", loginData.token);
            console.log("Login successful!");
            navigate("/");
          } else {
            const loginErr = await loginRes.text();
            console.log("Login failed:", loginErr);
          }
        } else {
          const err = await res.text();
          if (err === "User already exists") {
            setErrorMessage(
              "User already exists. Please enter another username.",
            );
            setUsername(""); // Clear the username field
            setUsernameError(true); // Set the username error state
          } else {
            setErrorMessage(err);
          }
          console.log("Account creation failed:", err);
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        setErrorMessage("An error occurred during signup. Please try again.");
      }
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
          {errorMessage && (
            <Text color="red.500" textAlign="center">
              {errorMessage}
            </Text>
          )}
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
                value={firstName}
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
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
              value={email}
            />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameError(false)} // Reset the background color on focus
              value={username}
              bg={usernameError ? "red.100" : "white"} // Change background color if there's an error
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
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
