import React, { useState, useEffect } from "react";
import { FaTrashCan } from "react-icons/fa6";
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
} from "../../lib/fetches";
import { removeFriendFromUserByFriendId } from "../../lib/deletes";
import { addFriendToGroup } from "../../lib/fetches";
import { ObjectId } from "mongoose";

type Props = {
  initialUserId?: string;
  LoggedInUser: any;
};

const Friends_List: React.FC<Props> = ({
  initialUserId = "",
  LoggedInUser,
}) => {
  //hard coded for now until we have log in logic
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [userId, setUserId] = useState(initialUserId);

  useEffect(() => {
    const fetchFriendsAndGroups = async () => {
      console.log(LoggedInUser);
      try {
        const response = await fetchUser(LoggedInUser);
        if (response.ok) {
          const user = await response.json();

          const groupsList = await fetchUserGroupsByUser(user);
          setGroups(groupsList);

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

  const removeFriend = async (friendId: string) => {
    try {
      console.log(friendId);
      // Assuming you have the userId available in your state or props
      await removeFriendFromUserByFriendId(friendId, LoggedInUser);
      setFriends(
        friends.filter((friend) => friend._id.toString() !== friendId),
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const addFriend = async (userId: string) => {
    try {
      console.log(userId);
      if (userId == LoggedInUser) {
        console.log("Cannot add yourself as friend");
      } else {
        const res = await fetch(`http://localhost:3001/users/${userId}`);
        const res2 = await fetch(`http://localhost:3001/users/${LoggedInUser}`);
        let user;
        let friend;
        if (res.ok && res2.ok) {
          user = await res2.json();
          friend = await res.json();

          if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
            console.log("Pushed to list");

            const updatedRes = await fetch(
              `http://localhost:3001/users/${LoggedInUser}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ friends: user.friends }),
              },
            );
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

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.preventDefault();
    try {
      console.log("handleClick:", userId);
      if (userId == "") {
        console.log("User is null and cannot be added");
      } else {
        await addFriend(userId);
        setUserId("");
      }
    } catch (error) {
      console.error("Invalid user ID");
    }
  };

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
              placeholder="Enter friend's user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleClick}>
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
                      <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                        Add to Group
                      </MenuButton>
                      <MenuList>
                        {groups.length > 0 ? (
                          groups.map((group) => (
                            <MenuItem
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
                  <Button onClick={() => removeFriend(friend._id.toString())}>
                    <FaTrashCan />
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
