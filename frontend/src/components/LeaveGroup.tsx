import { Button } from "@chakra-ui/react";
import { IGroup } from "../../../backend/models/groupSchema";
import { IUser } from "../../../backend/models/userSchema";
import {
  handleDeleteGroupFromUser,
  handleDeleteUserFromGroup,
  handleRemoveUserFromEachBasket,
} from "../../lib/deletes";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../lib/fetches";

// Define the props for the LeaveGroup component
interface Props {
  LoggedInUser: IUser;
  group: IGroup;
  updateUser: (user: IUser) => void;
}

const LeaveGroup = ({ LoggedInUser, group, updateUser }: Props) => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handle leaving the group
  const onLeaveGroup = async (groupId: string, member: string) => {
    console.log("Leaving group", member); // Log the member leaving the group
    try {
      // Remove user from group, group from user, and user from each basket in the group
      await handleDeleteGroupFromUser(groupId, member);
      await handleDeleteUserFromGroup(groupId, member);
      await handleRemoveUserFromEachBasket(groupId, member);

      // Re-fetch the updated user data
      const updatedUserResponse = await fetchUser(member);
      if (updatedUserResponse.ok) {
        const updatedUser = await updatedUserResponse.json();
        updateUser(updatedUser); // Update the user state with the updated data
      }

      // Redirect to MyGroupsPage after leaving the group
      navigate("/groups");
    } catch (error) {
      console.error("An error occurred while leaving the group:", error);
    }
  };

  return (
    <Button
      colorScheme="red"
      marginRight="10px"
      onClick={() =>
        // Call onLeaveGroup with the group and user IDs
        onLeaveGroup(group._id.toString(), LoggedInUser._id.toString())
      }
    >
      Leave Group
    </Button>
  );
};

export default LeaveGroup;
