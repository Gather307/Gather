import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Text,
  IconButton,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { fetchUserWithString } from "../../lib/fetches";
import { editUser } from "../../lib/edits";

interface UserProfileProps {
  userId: string;
  avatarColor: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, avatarColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    userId: "",
    username: "",
    firstName: "",
    lastName: "",
    userImage: "",
    userEmail: "",
  });
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const { hasCopied, onCopy } = useClipboard(profileData.userId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchUserWithString(userId);
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            userId: data._id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            userImage: data.userImage,
            userEmail: data.email,
          });
          setEditedFirstName(data.firstName);
          setEditedLastName(data.lastName);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSaveChanges = async () => {
    try {
      const updatedProfile = {
        firstName: editedFirstName,
        lastName: editedLastName,
      };

      const response = await editUser(userId, updatedProfile);

      if (response.ok) {
        setProfileData((prev) => ({
          ...prev,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
        }));
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // const initials =
  //   `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();

  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={6} mb={4}>
      <Flex justifyContent="center" mb={4}>
        <Avatar size={{ base: "xl", md: "2xl" }} bg={avatarColor} color="white">
          {/* {initials} */} {/* it looked weird w initials in the avatar */}
        </Avatar>
      </Flex>
      <Heading size="md" mb={4} alignSelf={"center"} textAlign={"center"}>
        {profileData.firstName} {profileData.lastName}'s Profile
      </Heading>
      {isEditing ? (
        <Stack spacing={4}>
          <FormControl id="first-name">
            <FormLabel>First Name</FormLabel>
            <Input
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
            />
          </FormControl>
          <FormControl id="last-name">
            <FormLabel>Last Name</FormLabel>
            <Input
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" mt={4} onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button mt={2} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <Flex alignItems="center">
            <Text>
              <strong>User ID:</strong> {profileData.userId}
            </Text>
            <Tooltip
              label={hasCopied ? "Copied!" : "Copy"}
              closeOnClick={false}
              hasArrow
            >
              <IconButton
                size="sm"
                ml={2}
                icon={<CopyIcon />}
                onClick={onCopy}
                aria-label="Copy User ID"
              />
            </Tooltip>
          </Flex>
          <Text>
            <strong>Username:</strong> {profileData.username}
          </Text>
          <Text>
            <strong>First Name:</strong> {profileData.firstName}
          </Text>
          <Text>
            <strong>Last Name:</strong> {profileData.lastName}
          </Text>
          <Text>
            <strong>Email:</strong> {profileData.userEmail}
          </Text>
          <Button colorScheme="blue" mt={4} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default UserProfile;
