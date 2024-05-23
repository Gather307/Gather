import React, { useState } from 'react';
import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
import UserProfile from '../components/UserProfile';
import FriendsList from '../components/FriendsList';
import WishList from '../components/WishList';

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState({
    firstName: "Bob",
    lastName: "Johnson",
    userImage: "/path-to-user-image.png",
    userEmail: "bobjohnson111@gmail.com",
    userPassword: "*********"
  });

  const handleProfileUpdate = (updatedProfile: { firstName: string; lastName: string; userImage: string; userEmail: string; userPassword: string }) => {
    setProfileData(updatedProfile);
  };

  return (
    <Box bg="gray.100" color="gray.800" minH="100vh" minW = "100vw" p={4}>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5} >
        <GridItem p={4}>
          <UserProfile
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
          />
        </GridItem>
        <GridItem p={4}>
          <Box bg="white" borderRadius="md" boxShadow="md" mb={4} p={4}>
            <Heading size="md" mb={4}>Friends List</Heading>
            <FriendsList />
          </Box>
          <Box bg="white" borderRadius="md" boxShadow="md" p={4}>
            <Heading size="md" mb={4}>WishList</Heading>
            <WishList />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
