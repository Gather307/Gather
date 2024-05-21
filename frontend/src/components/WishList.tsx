//PLACEHOLDER!!!!!
import React from 'react';
import { Box, List, ListItem, ListIcon, Text } from '@chakra-ui/react';
import { FaGift } from 'react-icons/fa';

const WishList: React.FC = () => {
  return (
    <Box>
      <List spacing={3}>
        {['Kitchen Timer', 'Pillow', 'RGB Keyboard', 'Waffle Maker'].map((item) => (
          <ListItem key={item}>
            <ListIcon as={FaGift} color="green.500" />
            <Text display="inline">{item}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WishList;
