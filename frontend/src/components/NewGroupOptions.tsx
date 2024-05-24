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

const NewGroupOptions = ({ user }: { user: IUser }) => {
  //Backend notes: If possible,
  //  1) automatically provide default description if none given
  //  2) automatically create a basket for the user rather than having no baskets created upon group creation
  //Frontend notes:
  //  1) When added, update "owner" keyword to be automatically the id of the logged in user
  //  2) If no user logged in, impossible to create group
  const createGroup = async (
    groupName: string,
    privateGroup: boolean,
    description: string,
  ) => {
    const promise = await fetch("http://localhost:3001/groups/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        groupName,
        privateGroup,
        description,
        members: [user._id],
      }), //dummyUserId will need to be replaced
    });
    if (promise.status === 201) {
      const data = await promise.json();
      console.log("Group created successfully", data);
      const newData = [...user.groups, data._id];
      console.log(newData);
      const userPromise = await fetch(
        `http://localhost:3001/users/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ groups: newData }),
        },
      );
      if (userPromise.status === 200) {
        console.log("User updated successfully");
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
      <CreateGroup postGroup={createGroup} />
    </Flex>
  );
};

interface CreateProps {
  postGroup: (name: string, isPublic: boolean, description: string) => void;
}

const CreateGroup = ({ postGroup }: CreateProps) => {
  const [group, setGroup] = useState({
    name: "",
    isPublic: "off",
    description: "",
  });
  const [errored, setError] = useState({ state: false, msg: "" });
  const { onOpen, onClose, isOpen } = useDisclosure();

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
              justifyContent="space-between"
              alignItems="center"
            >
              <Box width="30%">
                <input
                  type="checkbox"
                  name="public"
                  id="public"
                  checked={group.isPublic === "on"}
                  onChange={handleChange}
                  className="checkbox"
                />
                <label htmlFor="public" className="sidenote">
                  public
                </label>
              </Box>
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
