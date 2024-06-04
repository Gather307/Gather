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
import { IGroup } from "../../../backend/models/groupSchema";
import { addBasketToGroup } from "../../lib/edits";
import { createNewBasket } from "../../lib/posts";

// Component for displaying options to create a new basket
const NewBasketOptions = ({
  user,
  group,
  updateGroup,
}: {
  user: IUser | null;
  group: IGroup;
  updateGroup: any;
}) => {
  // Function to handle the creation of a new basket
  const createBasket = async (basketName: string, description: string) => {
    if (user === null) {
      console.error("No user logged in");
      return;
    }
    // Prepare basket data
    const basketData = {
      basketName: basketName,
      description: description,
      members: [user._id],
    };
    // Create new basket
    const promise = await createNewBasket(basketData);
    if (promise.status === 201) {
      const data = await promise.json();
      console.log("Basket created successfully", data);
      // Add new basket to the group
      const newData = [...group.baskets, data._id];
      console.log(newData);
      const groupPromise = await addBasketToGroup(group, newData);

      if (groupPromise.status === 200) {
        const groupData = await groupPromise.json();
        updateGroup(groupData);
        console.log("Group updated successfully");
      }
    }
    // Reload the page
    window.location.reload();
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="bottom"
      marginTop="10px"
      width="15%"
    >
      <CreateGroup postBasket={createBasket} />
    </Flex>
  );
};

interface CreateProps {
  postBasket: (name: string, description: string) => void;
}

// Component for creating a new group
const CreateGroup = ({ postBasket }: CreateProps) => {
  const [basket, setBasket] = useState({
    name: "",
    description: "",
  });
  const [errored, setError] = useState({ state: false, msg: "" });
  const { onOpen, onClose, isOpen } = useDisclosure();

  // Handle input change
  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "name") {
      setBasket({ ...basket, name: value });
    } else {
      setBasket({ ...basket, description: value });
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    postBasket(
      basket.name,
      basket.description === "" ? "No description given" : basket.description,
    );
    setBasket({ name: "", description: "" });
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
            height="30px"
            marginRight="2px"
            fontWeight="300"
            fontSize="14px"
            letterSpacing="1px"
          >
            ADD NEW
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
            Create new basket
          </PopoverHeader>
          <form>
            <label htmlFor="name" className="i-b">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={basket.name}
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
              value={basket.description}
              onChange={handleChange}
              className="i-b text-container multiline"
            />
            <PopoverFooter
              display="flex"
              justifyContent="space-between"
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

export default NewBasketOptions;
