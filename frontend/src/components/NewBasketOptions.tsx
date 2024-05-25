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
import { IUser } from "backend/models/userSchema";
import { IGroup } from "backend/models/groupSchema";

const NewBasketOptions = ({
  user,
  group,
  updateGroup,
}: {
  user: IUser;
  group: IGroup;
  updateGroup: any;
}) => {
  //Backend notes: If possible,
  //  1) automatically provide default description if none given
  //  2) automatically create a basket for the user rather than having no baskets created upon group creation
  //Frontend notes:
  //  1) When added, update "owner" keyword to be automatically the id of the logged in user
  //  2) If no user logged in, impossible to create group
  const createBasket = async (basketName: string, description: string) => {
    const promise = await fetch("http://localhost:3001/baskets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        basketName,
        description,
        members: [user._id],
      }), //dummyUserId will need to be replaced
    });
    if (promise.status === 201) {
      const data = await promise.json();
      console.log("Basket created successfully", data);
      const newData = [...group.baskets, data._id];
      console.log(newData);
      const groupPromise = await fetch(
        `http://localhost:3001/groups/${group._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ baskets: newData }),
        },
      );
      if (groupPromise.status === 200) {
        const groupData = await groupPromise.json();
        updateGroup(groupData);
        console.log("Group updated successfully");
      }
    }
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

const CreateGroup = ({ postBasket }: CreateProps) => {
  const [basket, setBasket] = useState({
    name: "",
    description: "",
  });
  const [errored, setError] = useState({ state: false, msg: "" });
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    console.log("Edited ", name, " value", value);
    if (name === "name") {
      setBasket({ ...basket, name: value });
    } else {
      setBasket({ ...basket, description: value });
    }
  };

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
