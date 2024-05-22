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
  Link as ChakraLink,
} from "@chakra-ui/react";
import logo from "../../public/target.png";
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavLink = ({
  children,
  href = "#",
}: {
  children: ReactNode;
  href?: string;
}) => (
  <ChakraLink
    px={2}
    py={1}
    rounded={"md"}
    href={href}
    color={"#DCE1DE"}
    _hover={{
      textDecoration: "underline",
      color: "#DCE1DE",
      bg: "transparent",
    }}
    style={{ fontWeight: "500" }}
  >
    {children}
  </ChakraLink>
);

const NavbarSignedIn = ({
  stateVariable,
  updateState,
}: {
  stateVariable: any;
  updateState: any;
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    updateState.setToken("");
    updateState.setUser("");
    navigate("/");
  };

  return (
    <Box bg={"#216869"} px={4}>
      <Flex
        minH={"60px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex align="center" ml={2}>
          <Link href="/">
            <Image src={logo} alt="Logo" boxSize="32px" mr={3} />
          </Link>
          <Text fontSize="lg" color={"#DCE1DE"} ml={1}>
            Welcome, {stateVariable.user.username}!
          </Text>
        </Flex>
        <HStack spacing={8} alignItems={"center"}>
          <NavLink href="#">My Items</NavLink>
          <NavLink href="#">My Groups</NavLink>
          <ChakraLink
            as={Link}
            to="/FriendsList"
            px={2}
            py={1}
            rounded={"md"}
            color={"#DCE1DE"}
            _hover={{
              textDecoration: "underline",
              color: "#DCE1DE",
              bg: "transparent",
            }}
            style={{ fontWeight: "500" }}
          >
            My Friends
          </ChakraLink>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
              _focus={{ boxShadow: "0 0 0 3px #49A078" }}
            >
              <Avatar size={"sm"} src={"/path-to-user-image.png"} />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavbarSignedIn;
