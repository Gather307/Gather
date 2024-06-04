import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
  Text,
} from "@chakra-ui/react";
import { IGroup } from "../../../backend/models/groupSchema";
import { IUser } from "../../../backend/models/userSchema";
import { ObjectId } from "mongoose";
import { useEffect, useState } from "react";

interface Props {
  LoggedInUser: IUser;
  group: IGroup;
}

const RemoveFromGroup = ({ LoggedInUser, group }: Props) => {
  // Initialize the members state with the filtered memberid prop
  const [displayMembers, setMembers] = useState<ObjectId[]>([]);

  const onRemoveMember = (member: ObjectId) => {
    console.log("Removing member", member);
    //window.location.reload();
  };

  useEffect(() => {
    setMembers(group.members.filter((member) => member !== LoggedInUser._id));
  }, [group, LoggedInUser]);

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button colorScheme="red" marginRight="10px">
            <VStack spacing="1">
              <Box>Remove members</Box>{" "}
              <Box fontSize="0.7rem">(Owner-only permission)</Box>
            </VStack>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          bg="var(--col-bright)"
          color="var(--col-dark)"
          border="2px"
          borderColor="var(--col-dark)"
          width="fit-content"
        >
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="bold">Group members</PopoverHeader>
          <PopoverBody>
            {displayMembers?.map((member) => (
              <Flex
                key={`remmem-${member}`}
                width="100%"
                justify="space-between"
                align="center"
              >
                <Text margin="10px">{member.toString()}</Text>
                <Button
                  margin="5px"
                  colorScheme="red"
                  onClick={() => onRemoveMember(member)}
                >
                  Remove
                </Button>
              </Flex>
            ))}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RemoveFromGroup;
