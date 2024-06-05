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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { loginUser } from "../../lib/fetches";

// Define the LoginPage component with a prop for updating state
const LoginPage = ({ updateState }: { updateState: any }) => {
  // State variables for username, password, and other form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log("submitting form");
    console.log(username);
    console.log(password);

    // Check if username or password fields are empty
    if (username === "" || password === "") {
      alert("Please fill out all fields");
      return;
    } else {
      try {
        // Attempt to log in the user with the provided credentials
        const res = await loginUser({ username, password });
        if (res.status === 200) {
          // If login is successful, parse the response data
          const data = await res.json();

          // Update the state with the token and user information
          updateState.setToken(data.token);
          updateState.setUser(data.existingUser);
          localStorage.setItem("token", data.token);
          console.log("Login successful!");
          // Navigate to the home page
          navigate("/");
        } else {
          // If login fails, set error messages and reset form fields
          setErrorMessage("Incorrect username or password");
          setUsernameError(true);
          setPasswordError(true);
          setUsername("");
          setPassword("");
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage("An error occurred during login. Please try again.");
        setUsernameError(true);
        setPasswordError(true);
        setUsername("");
        setPassword("");
      }
    }
  };

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
          {errorMessage && (
            <Text color="red.500" textAlign="center">
              {errorMessage}
            </Text>
          )}
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(false); // Reset error on change
              }}
              onFocus={() => setUsernameError(false)} // Reset error on focus
              bg={usernameError ? "red.100" : "white"} // Change background color if there's an error
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false); // Reset error on change
                }}
                onFocus={() => setPasswordError(false)} // Reset error on focus
                bg={passwordError ? "red.100" : "white"} // Change background color if there's an error
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
