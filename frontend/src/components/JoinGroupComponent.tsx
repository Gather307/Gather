import {
  Button,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegHandshake } from "react-icons/fa6";

const JoinGroupComponent = () => (
  <Flex justifyContent="center" alignItems="center" marginTop="10px">
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        color="var(--col-dark)"
        borderRadius="30px 0 0 30px"
        borderColor="var(--col-secondary)"
        borderWidth="3px"
        width="100px"
        height="30px"
        marginRight="2px"
        fontWeight="300"
        fontSize="14px"
        letterSpacing="1px"
      >
        CREATE
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
    <Menu>
      <MenuButton
        as={Button}
        variant="outline"
        color="var(--col-dark)"
        borderRadius="0 30px 30px 0"
        borderColor="var(--col-secondary)"
        borderWidth="3px"
        width="100px"
        height="30px"
        marginRight="2px"
        fontWeight="300"
        fontSize="14px"
        letterSpacing="1px"
      >
        JOIN
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  </Flex>
);

export default JoinGroupComponent;
