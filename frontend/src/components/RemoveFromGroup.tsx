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
import { useEffect, useState } from "react";
import {
  handleDeleteGroupFromUser,
  handleDeleteUserFromGroup,
  handleRemoveUserFromEachBasket,
} from "../../lib/deletes";

interface Props {
  LoggedInUser: IUser;
  group: IGroup;
  members: IUser[];
}

const RemoveFromGroup = ({ LoggedInUser, group, members }: Props) => {
  // Initialize the members state with the filtered memberid prop
  const [displayMembers, setMembers] = useState<IUser[]>([]);
  const onRemoveMember = async (groupId: string, member: string) => {
    console.log("Removing member", member);
    try {
      await handleDeleteGroupFromUser(groupId, member);
      await handleDeleteUserFromGroup(groupId, member);
      await handleRemoveUserFromEachBasket(groupId, member);

      window.location.reload();
    } catch (error) {
      console.error("An error occurred while deleting:", error);
    }
  };

  useEffect(() => {
    setMembers(members.filter((member) => member._id !== LoggedInUser._id));
  }, [group, LoggedInUser]);

  return (
    <div>
      <Popover
        placement="auto"
        modifiers={[
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
              altBoundary: true,
              padding: 8,
            },
          },
        ]}
      >
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
                key={`remmem-${member._id}`}
                width="100%"
                justify="space-between"
                align="center"
              >
                <Text margin="10px">{member.username}</Text>
                <Button
                  margin="5px"
                  colorScheme="red"
                  onClick={() =>
                    onRemoveMember(group._id.toString(), member._id.toString())
                  }
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
