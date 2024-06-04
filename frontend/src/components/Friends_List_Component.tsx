import { DeleteIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Box,
  Input,
  Stack,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { IGroup } from "../../../backend/models/groupSchema";
import { IUser } from "../../../backend/models/userSchema";
import {
  fetchUser,
  fetchUserGroupsByUser,
  fetchUserFriendsByUser,
  fetchUserByUsername,
} from "../../lib/fetches";
import { removeFriendFromUserByFriendId } from "../../lib/deletes";
import { addFriendToGroup } from "../../lib/fetches";
import { ObjectId } from "mongoose";
import { addFriendToUser } from "../../lib/edits";

type Props = {
  initialUserId?: string;
  LoggedInUser: any;
};

// Component to manage and display friends list
const Friends_List: React.FC<Props> = ({
  initialUserId = "",
  LoggedInUser,
}) => {
  // State to store the groups the user is part of
  const [groups, setGroups] = useState<IGroup[]>([]);
  // State to store the user's friends
  const [friends, setFriends] = useState<IUser[]>([]);
  // State to store the user ID (or username) entered in the input field
  const [userId, setUserId] = useState(initialUserId);

  // Effect to fetch friends and groups data when the component mounts or when the LoggedInUser changes
  useEffect(() => {
    const fetchFriendsAndGroups = async () => {
      console.log(LoggedInUser);
      try {
        const response = await fetchUser(LoggedInUser);
        if (response.ok) {
          const user = await response.json();

          // Fetch the groups the user is part of
          const groupsList = await fetchUserGroupsByUser(user);
          setGroups(groupsList);
          
          // Fetch the user's friends
          const friendsData = await fetchUserFriendsByUser(user);
          setFriends(friendsData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (LoggedInUser) {
      fetchFriendsAndGroups();
    }
  }, [LoggedInUser]);

  // Function to remove a friend from the user's friends list
  const removeFriend = async (friendId: string) => {
    try {
      console.log(friendId);
      await removeFriendFromUserByFriendId(friendId, LoggedInUser);
      setFriends(
        friends.filter((friend) => friend._id.toString() !== friendId),
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  // Function to add a friend to the user's friends list
  const addFriend = async (username: string) => {
    try {
      console.log(username);
      if (username === LoggedInUser.username) {
        console.log("Cannot add yourself as friend");
      } else {
        const res = await fetchUserByUsername(username);
        const res2 = await fetchUser(LoggedInUser._id);
        let user;
        let friend;
        if (res.ok && res2.ok) {
          user = await res2.json();
          friend = await res.json();

          if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
            console.log("Pushed to list");

            const updatedRes = await addFriendToUser(user, user.friends);
            console.log("Past Patch");
            if (updatedRes.ok) {
              setFriends([...friends, friend]);
            } else {
              console.error("Failed to update user");
            }
          } else {
            console.log("Friend is already in the friends list");
          }
        } else {
          console.error("User or friend not found");
        }
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

    // Function to handle adding a friend when the "Add Friend" button is clicked
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.preventDefault();
    try {
      console.log("handleClick:", userId);
      if (userId === "") {
        console.log("Username is null and cannot be added");
      } else {
        await addFriend(userId);
        setUserId("");
      }
    } catch (error) {
      console.error("Invalid username");
    }
  };

  // Function to handle adding a friend to a group
  const handleGroupClick = async (groupId: string, friendId: ObjectId) => {
    try {
      console.log(`Group ID: ${groupId} clicked`);
      console.log(`USER ID: ${friendId} clicked`);
      await addFriendToGroup(friendId, groupId);
    } catch (error) {
      console.error("Invalid user ID");
    }
  };

  return (
    <Box width="100%">
      <Box
        padding="4"
        borderRadius="md"
        top="0"
        zIndex="1"
        bg="white"
        position="sticky"
      >
        <FormControl>
          <Stack direction="row" spacing={4}>
            <Input
              placeholder="Enter friend's username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button colorScheme="teal" onClick={handleClick}>
              Add Friend
            </Button>
          </Stack>
        </FormControl>
      </Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Friend's Username</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {friends.map((friend) => (
              <Tr key={friend._id.toString()}>
                <Td>{friend.username}</Td>
                <Td>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Menu>
                      <MenuButton
                        as={Button}
                        colorScheme="teal"
                        rightIcon={<FaChevronDown />}
                      >
                        Add to Group
                      </MenuButton>
                      <MenuList bg="#dfe2e1">
                        {groups.length > 0 ? (
                          groups.map((group) => (
                            <MenuItem
                              bg="#dfe2e1"
                              _hover={{ bg: "#bfc2c1" }}
                              key={group._id.toString()}
                              onClick={() =>
                                handleGroupClick(
                                  group._id.toString(),
                                  friend._id,
                                )
                              }
                            >
                              {group.groupName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No groups available</MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Box>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => removeFriend(friend._id.toString())}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
            {friends.length === 0 && (
              <Tr>
                <Td colSpan={2} textAlign="center">
                  No friends currently
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Friends_List;
