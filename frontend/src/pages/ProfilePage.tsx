// src/pages/ProfilePage.tsx

import React from 'react';
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
} from '@chakra-ui/react';
import FriendsList from '../components/FriendsList';
import WishList from '../components/WishList';

interface ProfilePageProps {
  firstName: string;
  lastName: string;
  userImage: string;
  userEmail: string;
  userPassword: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ firstName, lastName, userImage, userEmail, userPassword }) => {
  return (
    <Box bg="gray.100" color="gray.800" minH="100vh" minW="100vw" p={4}>
      <Flex justifyContent="center" alignItems="flex-start" flexDirection={{ base: 'column', md: 'row' }}>
        <Box flex="1" maxW="lg" p={6} bg="white" borderRadius="md" boxShadow="md" mb={{ base: 4, md: 0 }}>
          <Heading size="md" mb={4}>{firstName} {lastName}'s Profile</Heading>
          <Flex justifyContent="center" mb={4}>
            <Avatar size="2xl" src={userImage} />
          </Flex>
          <Stack spacing={4}>
            <FormControl id="first-name">
              <FormLabel>First Name</FormLabel>
              <Input defaultValue={firstName} />
            </FormControl>
            <FormControl id="last-name">
              <FormLabel>Last Name</FormLabel>
              <Input defaultValue={lastName} />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input defaultValue={userEmail} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" defaultValue={userPassword} />
            </FormControl>
            <Button colorScheme="blue" mt={4}>Save Changes</Button>
          </Stack>
        </Box>

        <Box flex="1" maxW="lg" ml={{ md: 4 }} mb={{ base: 4, md: 0 }}>
          <Box p={4} bg="white" borderRadius="md" boxShadow="md" mb={4}>
            <Heading size="md" mb={4}>Friends List</Heading>
            <FriendsList />
          </Box>

          <Box p={4} bg="white" borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>WishList</Heading>
            <WishList />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProfilePage;
