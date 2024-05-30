import React, { useState, useEffect } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  PopoverArrow,
} from "@chakra-ui/react";
import { IUser } from "../../../backend/models/userSchema";

interface Props {
  groupId: string | undefined;
  friends: IUser[];
  members: IUser[];
}

const SendInviteToGroup: React.FC<Props> = ({ groupId, friends, members }) => {
  // Create a set of member IDs for efficient lookup  const memberIds = new Set(members.map(member => member._id));
  const memberIds = new Set(members.map((member) => member._id));
  // Initialize the friends state with the filtered friends prop
  const [friendsNotInGroup, setFriendsNotInGroup] = useState<IUser[]>(() =>
    friends.filter((friend) => !memberIds.has(friend._id)),
  );

  useEffect(() => {
    // This effect runs when friends or members prop changes
    const memberIds = new Set(members.map((member) => member._id));
    setFriendsNotInGroup(
      friends.filter((friend) => !memberIds.has(friend._id)),
    );
  }, [friends, members]);

  // Function to handle button click and log members to the console
  const handleLogMembers = () => {
    console.log("friends:", friendsNotInGroup);
    console.log("friend Users:", friends);
  };
  const addToGroup = async (friendId: string, groupId: string | undefined) => {
    try {
      const res1 = await fetch(`http://localhost:3001/groups/${groupId}`);

      const res = await fetch(`http://localhost:3001/users/${friendId}`);
      let friend;
      let group;
      if (res.ok && res1.ok) {
        friend = await res.json();
        group = await res1.json();
        if (!group.members.includes(friendId)) {
          group.members.push(friendId);
          console.log("Pushed friend ID to group's member list");
          const updatedRes1 = await fetch(
            `http://localhost:3001/groups/${groupId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ members: group.members }),
            },
          );
          if (updatedRes1.ok) {
            console.log("Friend added to group's member list successfully");
          } else {
            console.error("Failed to update group");
          }
        }
        if (!friend.groups.includes(groupId)) {
          friend.groups.push(groupId);
          console.log("Pushed to list");

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

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button
            bg="teal"
            color="white"
            marginRight={{ md: "10px" }}
            mb={{ base: 2, md: 0 }}
            alignSelf={{ base: "flex-end", md: "center" }}
            onClick={handleLogMembers}
            _hover={{
              bg: "var(--col-tertiary)",
              color: "var(--col-dark)",
            }}
          >
            Send Invite
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
          <PopoverHeader fontWeight="bold">Friends not in this Group</PopoverHeader>
          <PopoverBody>
            {friendsNotInGroup.length > 0 ? (
              <ul>
                {friendsNotInGroup.map((friend) => (
                  <li
                    key={friend._id.toString()}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px",
                    }}
                  >
                    <span>{friend.username}</span>
                    <Button
                      size="sm"
                      onClick={() => addToGroup(friend._id.toString(), groupId)}
                    >
                      Add to Group
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No friends to add</p>
            )}
          </PopoverBody>
          <PopoverFooter></PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SendInviteToGroup;
