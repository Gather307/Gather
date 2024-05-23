// src/components/UserProfile.tsx

import React, { useState, ChangeEvent } from 'react';
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
} from '@chakra-ui/react';

interface UserProfileProps {
  profileData: {
    firstName: string;
    lastName: string;
    userImage: string;
    userEmail: string;
    userPassword: string;
  };
  onProfileUpdate: (updatedProfile: { firstName: string; lastName: string; userImage: string; userEmail: string; userPassword: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profileData, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(profileData.firstName);
  const [editedLastName, setEditedLastName] = useState(profileData.lastName);
  const [editedEmail, setEditedEmail] = useState(profileData.userEmail);
  const [editedPassword, setEditedPassword] = useState(profileData.userPassword);
  const [editedImage, setEditedImage] = useState(profileData.userImage);

  const handleSaveChanges = () => {
    onProfileUpdate({
      firstName: editedFirstName,
      lastName: editedLastName,
      userImage: editedImage,
      userEmail: editedEmail,
      userPassword: editedPassword,
    });
    setIsEditing(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={6} mb={4} height="100%">
      <Heading size="md" mb={4}>{profileData.firstName} {profileData.lastName}'s Profile</Heading>
      <Flex justifyContent="center" mb={4}>
        <Avatar size="2xl" src={editedImage} />
      </Flex>
      {isEditing ? (
        <Stack spacing={4}>
          <FormControl id="first-name">
            <FormLabel>First Name</FormLabel>
            <Input value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} />
          </FormControl>
          <FormControl id="last-name">
            <FormLabel>Last Name</FormLabel>
            <Input value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} />
          </FormControl>
          <FormControl id="avatar">
            <FormLabel>Profile Picture</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </FormControl>
          <Button colorScheme="blue" mt={4} onClick={handleSaveChanges}>Save Changes</Button>
          <Button mt={2} onClick={() => setIsEditing(false)}>Cancel</Button>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <Text><strong>First Name:</strong> {profileData.firstName}</Text>
          <Text><strong>Last Name:</strong> {profileData.lastName}</Text>
          <Text><strong>Email:</strong> {profileData.userEmail}</Text>
          <Text><strong>Password:</strong> {profileData.userPassword}</Text>
          <Button colorScheme="blue" mt={4} onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </Stack>
      )}
    </Box>
  );
};

export default UserProfile;
