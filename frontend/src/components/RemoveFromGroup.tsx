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
} from "@chakra-ui/react";
import { IGroup } from "backend/models/groupSchema";
import { IUser } from "backend/models/userSchema";
import { useEffect, useState } from "react";

interface Props {
  groupMembers: IUser[];
  LoggedInUser: IUser;
  group: IGroup;
}

const RemoveFromGroup = ({ groupMembers, LoggedInUser, group }: Props) => {
  // Initialize the members state with the filtered memberid prop
  const [displayMembers, setMembers] = useState<IUser[]>([]);

  const onRemoveMember = (member: IUser) => {
    //window.location.reload();
  };

  useEffect(() => {
    setMembers(
      groupMembers?.filter((member) => member._id !== LoggedInUser._id)
    );
  }, [groupMembers, LoggedInUser]);

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
        >
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="bold">Group members</PopoverHeader>
          <PopoverBody>
            {displayMembers?.map((member) => (
              <Flex
                key={`remmem-${member._id}`}
                width="100%"
                justify="space-between"
                align="center"
              >
                {member.username}
                <Button
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
