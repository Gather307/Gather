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
  Link,
} from "@chakra-ui/react";
import logo from "../../public/TheLeaf.png";
import { ReactNode } from "react";
import { useNavigate, Link as ReactLink } from "react-router-dom";

const vite_backend_url = "https://gather-app-307.azurewebsites.net";

const NavLink = ({
  children,
  handleClick,
}: {
  children: ReactNode;
  handleClick: () => void;
}) => (
  <Link
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
    onClick={handleClick}
  >
    {children}
  </Link>
);

interface Props {
  stateVariable: any; // Contains user state information
  updateState: any; // Function to update state
}

// NavbarSignedIn component
const NavbarSignedIn = ({ stateVariable, updateState }: Props) => {
  const navigate = useNavigate();

  // Handle logout action
  const handleLogout = () => {
    updateState.setToken("");
    updateState.setUser("");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Navigate to profile page
  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Navigate to groups page
  const handleGroupsClick = () => {
    navigate("/groups");
  };

  // Navigate to items page
  const handleItemsClick = () => {
    navigate("/items");
  };

  return (
    <Box bg={"#216869"} px={4} width="100vw">
      <Flex
        margin={"3px"}
        minH={"60px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex align="center" ml={2}>
          <Link as={ReactLink} to="/">
            <Image src={logo} alt="Logo" boxSize="48px" mr={3} />
          </Link>
          <Text fontSize="lg" color={"#DCE1DE"} ml={1}>
            Welcome, {stateVariable.username}!
          </Text>
        </Flex>
        <HStack spacing={8} alignItems={"center"}>
          <NavLink handleClick={handleItemsClick}>My Items</NavLink>
          <NavLink handleClick={handleGroupsClick}>My Groups</NavLink>
          <Box position="relative" zIndex={10}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
                _focus={{ boxShadow: "0 0 0 3px #49A078" }}
              >
                <Avatar
                  name={stateVariable.username}
                  src={`${vite_backend_url}/${stateVariable._id}/avatar`}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavbarSignedIn;
