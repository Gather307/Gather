import React from 'react';
import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
import UserProfile from '../components/UserProfile';
import Friends_List from '../components/Friends_List_Component';
import WishList from '../components/WishList';

interface ProfilePageProps {
  LoggedInUser: string;
  avatarColor: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ LoggedInUser, avatarColor }) => {
  return (
    <Box bg="gray.100" color="gray.800" minH="100vh" minW="100vw" p={4}>
      <Grid templateColumns={{ base: '1fr', md: '2fr 3fr' }} gap={5} height="100%">
        <GridItem p={4} height="auto">
          <UserProfile userId={LoggedInUser} avatarColor={avatarColor} />
        </GridItem>
        <GridItem p={4}>
          <Box bg="white" borderRadius="md" boxShadow="md" mb={4} p={4} height="50%">
            <Heading size="md" mb={4}>
              Friends List
            </Heading>
            <Friends_List LoggedInUser={LoggedInUser} />
          </Box>
          <Box bg="white" borderRadius="md" boxShadow="md" p={4} height="50%">
            <Heading size="md" mb={4}>
              WishList
            </Heading>
            <WishList /> {/* This is a dummy component */}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
