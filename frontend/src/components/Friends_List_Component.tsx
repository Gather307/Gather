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
} from "@chakra-ui/react";

//Props to store LoggedInUser ID
type Props = {
  initialUserId?: string;
  LoggedInUser: any;
};
//Type friend to store Friend Id and Name for table
type Friend = {
  id: string;
  name: string;
};
//Type Group to store Group Id and Name for table
type Group = {
  id: string;
  name: string;
};

const Friends_List: React.FC<Props> = ({
  initialUserId = "", //Initial UserId in the text box to add friend
  LoggedInUser, //current logged user id
}) => {
  //created usestates for Group, Friend, and Friend's userId
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [userId, setUserId] = useState(initialUserId);

  useEffect(() => {
    const fetchFriendsAndGroups = async () => {
      console.log(LoggedInUser);
      try {
        //Grabs logged User
        const response = await fetch(
          `http://localhost:3001/users/${LoggedInUser}`,
        );
        if (response.ok) {
          //Maps groups  of the Logged user
          const user = await response.json();
          const groupData = user.groups.map((groupId: string) => {
            return fetch(`http://localhost:3001/groups/${groupId}`).then(
              (res) => res.json(),
            );
          });
          const groupsList = await Promise.all(groupData);
          //sets the group
          setGroups(
            groupsList.map((group: any) => ({
              id: group._id,
              name: group.groupName,
            })),
          );
          const friendsData = user.friends.map((friendId: string) => {
            // Fetch each friend's details using friendId
            return fetch(`http://localhost:3001/users/${friendId}`).then(
              (res) => res.json(),
            );
          });
          const friendsList = await Promise.all(friendsData);
          //maps all the friends out
          setFriends(
            friendsList.map((friend: any) => ({
              id: friend._id,
              name: friend.username,
            })),
          );
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
    //updates loggedInUser
  }, [LoggedInUser]);

  const removeFriend = async (friendId: string) => {
    try {
      //prints the friend Id that we want to delete
      console.log(friendId);

      // Send a DELETE request to the backend API
      const response = await fetch(
        //Here I get the LoggedInUser and go to the friends array of that user and remove the friend from it
        `http://localhost:3001/users/${LoggedInUser}/remove-friend`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId: friendId }), // Send the friend's ID in the request body
        },
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
  //adds the friend to the group that the loggedin user is already in.
  const addToGroup = async (friendId: string, groupId: string) => {
    try {
      //grabs the info of the friend
      const res = await fetch(`http://localhost:3001/users/${friendId}`);
      let friend;

      if (res.ok) {
        //add the group to the friends group array
        friend = await res.json();
        if (!friend.groups.includes(groupId)) {
          friend.groups.push(groupId);
          console.log("Pushed to list");

          //adds it to the backend
          const updatedRes = await fetch(
            `http://localhost:3001/users/${friendId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ groups: friend.groups }),
            },
          );
          if (updatedRes.ok) {
            console.log("Friend added to group successfully");
          } else {
            console.error("Failed to update user");
          }
        } else {
          console.log("Friend is already in group");
        }
      } else {
        console.log("Group not Found");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  //adds a friend to the logged in user's friends
  const addFriend = async (userId: string) => {
    try {
      console.log(userId);
      //cant add yourself as a friend, sadly
      if (userId == LoggedInUser) {
        console.log("Cannot add yourself as friend");
      } else {
        //fetch both the "userId" which is the friend and the loggedinUser
        const res = await fetch(`http://localhost:3001/users/${userId}`);
        const res2 = await fetch(`http://localhost:3001/users/${LoggedInUser}`);
        let user;
        let friend;
        console.log("Gets here");
        if (res.ok && res2.ok) {
          console.log("Does it get here?");
          user = await res2.json();
          friend = await res.json();

          //push to logged in users friends array
          if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
            console.log("Pushed to list");

            //add logged in's friend in backend
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
            //setfriends to auto load once submitted
            if (updatedRes.ok) {
              setFriends([
                ...friends,
                { id: friend._id, name: friend.username },
              ]);
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

  //handle click just is to test to make sure it all works when clicking
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.preventDefault();
    try {
      console.log("handleClick:", userId);
      await addFriend(userId);
    } catch (error) {
      console.error("Invalid user ID");
    }
  };

  //handle click just is to test to make sure it all works when clicking
  const handleGroupClick = async (groupId: string, friendId: string) => {
    // Handle the logic to add a friend to the group
    try {
      console.log(`Group ID: ${groupId} clicked`);
      console.log(`USER ID: ${friendId} clicked`);
      await addToGroup(friendId, groupId);
    } catch (error) {
      console.error("Invalid user ID");
    }
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
                        {groups.length > 0 ? (
                          groups.map((group) => (
                            <MenuItem
                              key={group.id}
                              onClick={() =>
                                handleGroupClick(group.id, friend.id)
                              }
                            >
                              {group.name}
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
