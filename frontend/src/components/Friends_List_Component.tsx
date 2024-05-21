import React, { useState } from "react";
import { IoIosLink } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";

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
} from "@chakra-ui/react";



type Props = {
  initialUserId?: string;
};

const Friends_List: React.FC<Props> = ({initialUserId = ""}) => {
  const initialFriends = ["Alice", "Bob", "Charlie", "David"];
  const [friends, setFriends] = useState(initialFriends);
  const [userId, setUserId] = useState(initialUserId);

  const removeFriend = (name: string) => {
    setFriends(friends.filter((friend) => friend !== name));
  };

  const sendMessage = (name: string) => {
    const mailtoLink = `mailto:${name.toLowerCase()}@example.com`;
    window.location.href = mailtoLink;
  };

  const addFriend = async (userId: string) => {
    try{
    console.log(userId)

    const res = await fetch(`http://localhost:3001/users/${userId}`);
    const res2 = await fetch(`http://localhost:3001/users/6646a551807f0f5ba99dd1d4`);
    let user;
    let friend;
    console.log("Gets here")
    if (res.ok && res2.ok) {
      console.log("Does it get here?")
      user = await res2.json();
      friend = await res.json();


    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
      console.log("Pushed to list")
      
      const updatedRes = await fetch(`http://localhost:3001/users/6646a551807f0f5ba99dd1d4`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ friends: user.friends }),
        
      });
      console.log("Past Patch")
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

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    try {
      // Convert the input to ObjectId
      console.log("handleClick:", userId);
      await addFriend(userId);
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
              Invite Friend
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
              <Tr key={friend}>
                <Td>{friend}</Td>
                <Td>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      colorScheme="blue"
                      onClick={() => sendMessage(friend)}
                    >
                      <IoIosLink />
                    </Button>
                  </Box>
                </Td>
                <Td>
                  <Button onClick={() => removeFriend(friend)}>
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
