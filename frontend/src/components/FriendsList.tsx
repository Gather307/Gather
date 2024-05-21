//PLACEHOLDER!!!!!
import React from 'react';
import { Box, List, ListItem, ListIcon, Text } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';

const FriendsList: React.FC = () => {
  return (
    <Box>
      <List spacing={3}>
        {['Joseph Miller', 'Jason Lynn', 'Steve French', 'Tommy Smith'].map((friend) => (
          <ListItem key={friend}>
            <ListIcon as={FaUserCircle} color="blue.500" />
            <Text display="inline">{friend}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendsList;
