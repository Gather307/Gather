import React, { useState, useEffect } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
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
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

type Props = {
  initialUserId?: string;
};

type Friend = {
  id: string;
  name: string;
};

type Group = {
  id: string;
  name: string;
};

const Friends_List: React.FC<Props> = ({
  initialUserId = "664d0381bc2fb1e5216c2e8d",
}) => {
  //hard coded for now until we have log in logic
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [userId, setUserId] = useState(initialUserId);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/664d0381bc2fb1e5216c2e8d`
        );
        if (response.ok) {
          const user = await response.json();
          const groupData = user.groups.map((groupId: string) => {
            console.log(groupId)
            return fetch(`http://localhost:3001/groups/${groupId}`).then(
              (res) => res.json()
            );
          });
          const groupsList = await Promise.all(groupData);
          setGroups(
            groupsList.map((group: any) => ({
              id: group._id,
              name: group.groupName,
            }))
          );
          const friendsData = user.friends.map((friendId: string) => {
            // Fetch each friend's details using friendId
            return fetch(`http://localhost:3001/users/${friendId}`).then(
              (res) => res.json()
            );
          });
          const friendsList = await Promise.all(friendsData);
          setFriends(
            friendsList.map((friend: any) => ({
              id: friend._id,
              name: friend.username,
            }))
          );
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId, friends]);

  const removeFriend = async (friendId: string) => {
    try {
      console.log(friendId);
      // Assuming you have the userId available in your state or props
      const userId = "664d0381bc2fb1e5216c2e8d"; // Replace this with the actual user ID

      // Send a DELETE request to the backend API
      const response = await fetch(
        `http://localhost:3001/users/${userId}/remove-friend`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId: friendId }), // Send the friend's ID in the request body
        }
      );

      if (response.ok) {
        // If the backend request was successful, update the frontend state
        setFriends(friends.filter((friend) => friend.id !== friendId));
      } else {
        console.error("Failed to remove friend from backend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const addToGroup = (name: string) => {
    
  };
  const sendMessage = (name: string) => {
    const mailtoLink = `mailto:${name.toLowerCase()}@example.com`;
    window.location.href = mailtoLink;
  };

  const addFriend = async (userId: string) => {
    try {
      console.log(userId);
      if (userId == "664d0381bc2fb1e5216c2e8d") {
        console.log("Cannot add yourself as friend");
      } else {
        const res = await fetch(`http://localhost:3001/users/${userId}`);
        const res2 = await fetch(
          `http://localhost:3001/users/664d0381bc2fb1e5216c2e8d`
        );
        let user;
        let friend;
        console.log("Gets here");
        if (res.ok && res2.ok) {
          console.log("Does it get here?");
          user = await res2.json();
          friend = await res.json();

          if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
            console.log("Pushed to list");

            const updatedRes = await fetch(
              `http://localhost:3001/users/664d0381bc2fb1e5216c2e8d`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ friends: user.friends }),
              }
            );
            console.log("Past Patch");
            if (updatedRes.ok) {
              setFriends([...friends, friend.username]);
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

    //.then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     console.log(data); // Handle the response data here
    //   })
    //   .catch(error => {
    //     console.error('There was a problem with the fetch operation:', error);
    //   });
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    try {
      // Convert the input to ObjectId
      console.log("handleClick:", userId);
      await addFriend(userId);
    } catch (error) {
      console.error("Invalid user ID");
    }
  };

  const handleGroupClick = (groupId: string) => {
    // Handle the logic to add a friend to the group
    console.log(`Group ID: ${groupId} clicked`);
  };

  return (
    <Box width="100vw">
      <Box padding="4" bg="gray.100" borderRadius="md">
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
              <Th>Friend's Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {friends.map((friend) => (
              <Tr key={friend.id}>
                <Td>{friend.name}</Td>
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
                        {groups.map((group) => (
                          <MenuItem
                            key={group.id}
                            onClick={() => handleGroupClick(group.id)}
                          >
                            {group.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Box>
                </Td>
                <Td>
                  <Button onClick={() => removeFriend(friend.id)}>
                    <FaTrashCan />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
          {friends.length === 0 && (
            <Tfoot>
              <Tr>
                <Td colSpan={2} textAlign="center">
                  No friends currently
                </Td>
              </Tr>
            </Tfoot>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Friends_List;
