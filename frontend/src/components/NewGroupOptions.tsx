import {
  Button,
  Flex,
  Box,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import "../styles/JoinGroup.css";
import { IUser } from "../../../backend/models/userSchema";
import { createNewGroup, createNewBasket } from "../../lib/posts";
import { addGroupToUser } from "../../lib/edits";

// Component for creating new group options
const NewGroupOptions = ({
  user,
  updateUser,
}: {
  user: IUser;
  updateUser: any;
}) => {
  // Function to create a new group
  const createGroup = async (
    groupName: string,
    privateGroup: boolean,
    description: string,
  ) => {
    const firstBasket = {
      basketName: `${groupName} - ${user.username}'s Items`,
      description: "Default basket",
      members: [user._id],
    };
    let basketData;
    const basketPromise = await createNewBasket(firstBasket);
    if (basketPromise.status === 201) {
      basketData = await basketPromise.json();
      console.log("Basket created successfully", basketData);
    } else {
      console.error("Basket creation failed");
    }
    const groupData = {
      groupName,
      privateGroup,
      description,
      members: [user._id],
      baskets: [basketData._id],
    };
    const promise = await createNewGroup(groupData);
    if (promise.status === 201) {
      const data = await promise.json();
      console.log("Group created successfully", data);

      // Add new group to user's list of groups
      const newData = [...user.groups, data._id];

      const userPromise = await addGroupToUser(user, newData);
      if (userPromise.status === 200) {
        const userData = await userPromise.json();
        updateUser(userData);
        console.log("User updated successfully");
      }
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="bottom"
      marginTop="10px"
      width="15%"
    >
      <CreateGroup postGroup={createGroup} />
    </Flex>
  );
};

interface CreateProps {
  postGroup: (name: string, isPublic: boolean, description: string) => void;
}

// Component for creating a new group
const CreateGroup = ({ postGroup }: CreateProps) => {
  const [group, setGroup] = useState({
    name: "",
    isPublic: "off",
    description: "",
  });
  const [errored, setError] = useState({ state: false, msg: "" });
  const { onOpen, onClose, isOpen } = useDisclosure();

  // Handle input change
  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    console.log("Edited ", name, " value", value);
    if (name === "name") {
      setGroup({ ...group, name: value });
    } else if (name === "public") {
      setGroup({ ...group, isPublic: group.isPublic === "on" ? "off" : "on" });
    } else {
      setGroup({ ...group, description: value });
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    postGroup(
      group.name,
      group.isPublic === "on",
      group.description === "" ? "No description given" : group.description,
    );
    setGroup({ name: "", isPublic: "off", description: "" });
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          setError({ state: false, msg: "" });
          onClose();
        }}
        placement="bottom-end"
        autoFocus
        closeOnBlur
      >
        <PopoverTrigger>
          <Button
            color="var(--col-dark)"
            borderRadius="30px"
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
          </Button>
        </PopoverTrigger>
        <PopoverContent
          bgColor="var(--col-bright)"
          borderWidth="5px"
          borderColor="var(--col-secondary)"
          p="20px"
          borderRadius="10px"
        >
          <PopoverHeader
            display="flex"
            justifyContent="center"
            fontSize="1.4rem"
            color="var(--col-secondary)"
            borderBottomColor="var(--col-dark)"
            padding="0px"
            paddingBottom="5px"
            marginBottom="10px"
          >
            Create new group
          </PopoverHeader>
          <form>
            <label htmlFor="name" className="i-b">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={group.name}
              className="i-b text-container"
              onChange={handleChange}
            />
            <label htmlFor="desc" className="i-b">
              Description
            </label>
            <input
              type="text"
              name="desc"
              id="desc"
              value={group.description}
              onChange={handleChange}
              className="i-b text-container multiline"
            />
            <PopoverFooter
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display={`${errored.state ? "inherit" : "none"}`}
                color="red"
                fontSize="0.6rem"
                wordBreak="break-word"
                width="30%"
              >
                Error: {errored.msg}
              </Box>
              <input
                type="button"
                value="Submit"
                onClick={handleSubmit}
                className="submit-button"
              />
            </PopoverFooter>
          </form>
          <PopoverCloseButton color="var(--col-dark)" />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default NewGroupOptions;
