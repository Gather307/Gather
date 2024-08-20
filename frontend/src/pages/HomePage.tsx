import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../public/TheLeaf.png";

const HomePage = () => {
  return (
    <Box
      bgGradient="radial(at center, #D9E1E2, #9CC5A1, #49A078)"
      minH="90%"
      color="white"
      position="relative"
      overflow="hidden"
      animation="gradientAnimation 4s ease infinite"
      bgSize="200% 200%"
      sx={{
        "@keyframes gradientAnimation": {
          "0%": { backgroundPosition: "0% 0%" },
          "25%": { backgroundPosition: "100% 25%" },
          "50%": { backgroundPosition: "50% 50%" },
          "75%": { backgroundPosition: "100% 75%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      }}
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width="600px"
        height="600px"
        bg="green.200"
        borderRadius="50%"
        opacity="0.4"
        transform="translate(-50%, -50%)"
        filter="blur(150px)"
        zIndex={1}
      />

      <Container maxW="container.md" py={14} zIndex={2} position="relative">
        <Stack spacing={4} textAlign="center" alignItems="center">
          <Heading
            fontSize="7xl"
            fontWeight="bold"
            textShadow="4px 4px 12px rgba(0, 0, 0, 0.3)"
            fontFamily="'Bebas Neue', sans-serif"
            color="white"
            letterSpacing="wide"
          >
            Gather
          </Heading>

          <Heading
            fontSize="3xl"
            fontWeight="medium"
            fontFamily="'Bebas Neue', sans-serif"
            color="white"
            textShadow="2px 2px 6px rgba(0, 0, 0, 0.2)"
            letterSpacing="wide"
          >
            Simplify your plans, amplify your gatherings
          </Heading>
          <Button
            as={Link}
            to="/signup"
            bg="#49A078"
            textColor="white"
            size="lg"
            py={3}
            mt={4}
            // borderRadius="full"
            _hover={{
              bg: "green.600",
              color: "white",
              transform: "scale(1.05)",
            }}
          >
            Get Started with Gather
          </Button>
        </Stack>
      </Container>

      <Box mt={4} textAlign="center">
        <Image
          src={logo}
          // alt="Gather Logo"
          maxH="750px"
          mx="auto"
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: "scale(1.1)" }}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
