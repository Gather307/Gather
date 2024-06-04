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
import { fetchBasket } from "../../lib/fetches";
import { editBasket } from "../../lib/edits";
import { ObjectId } from "mongoose";

interface Props {
  basketId: string;
  groupMembers: IUser[];
  basketMemberIds: ObjectId[];
  currentUserId: string | undefined; // Add a prop for the current user's ID
}

// Uses member ids that are passed in from basket.tsx
const AddFriendToBasket: React.FC<Props> = ({
  basketId,
  groupMembers,
  basketMemberIds,
  currentUserId,
}) => {
  // Initialize the members state with the filtered memberid prop
  const [members, setMembers] = useState<IUser[]>(() =>
    groupMembers.filter((member) => member._id.toString() !== currentUserId),
  );

  useEffect(() => {
    // This effect runs when memberid prop changes
    setMembers(
      groupMembers.filter((member) => member._id.toString() !== currentUserId),
    );
  }, [groupMembers, currentUserId]);

  const AddToBasket = async (basketId: string, friendId: string) => {
    try {
      const res = await fetchBasket(basketId);
      let basket;
      if (res.ok) {
        basket = await res.json();
        if (!basket.members.includes(friendId)) {
          basket.members.push(friendId);
          console.log("Pushed friend ID to basket's member list");
          const updatedRes1 = await editBasket(basketId, basket);

          if (updatedRes1.ok) {
            console.log("Friend added to group's member list successfully");
          } else {
            console.error("Failed to update group");
          }
        } else {
          console.log("Friend is already in basket");
        }
      } else {
        console.log("Basket not Found");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
    window.location.reload();
  };

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
          <Button
            bgColor="var(--col-secondary)"
            color="white"
            _hover={{
              bg: "var(--col-tertiary)",
              color: "var(--col-dark)",
            }}
          >
            Add Users
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
          <PopoverHeader fontWeight="bold">Members</PopoverHeader>
          <PopoverBody>
            <ul>
              {members.map((member) => (
                <li
                  key={member._id.toString()}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <span>{member.username}</span>
                  <Button
                    size="sm"
                    onClick={() => AddToBasket(basketId, member._id.toString())}
                    isDisabled={basketMemberIds.includes(member._id)}
                  >
                    {basketMemberIds.includes(member._id)
                      ? "Already in basket!"
                      : "Add to Basket"}
                  </Button>
                </li>
              ))}
            </ul>
          </PopoverBody>
          <PopoverFooter></PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddFriendToBasket;
