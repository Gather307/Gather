import { Box, VStack, Text, Avatar, HStack } from "@chakra-ui/react";
import { Group } from "../pages/GroupPage";

interface Props {
  group: Group;
}

const CompactGroupV1 = ({ group }: Props) => {
  /* Some notes for whoever's checking this out later:
    1. Group interface 
      --> This should definitely either be exported as its own module or 
          pulled up to the component above this for use in other locations, since I 
          doubt this will be the only place that we reference groups... that said this 
          could also be an abridged group interface since we only need so many fields 
          here, we don't need everything about baskets, items, etc
      --> members was represented as a string[] for testing reasons but realistically should 
          be changed to be a list of maybe user interface objects? whatever we decide it needs to have 
          things like the user image in it if we use this compact group version so ye
      --> createDate is also modeled by a string here, but this should probably be changed to 
          be a date object. we'd need to change its usage below (and the formatting of the create 
          statement at the bottom of the page)
    2. Props interface
      --> realistically this should only take a group interface object.. for testing reasons 
          i added all of the fields that would be in a group object used here, but this will 
          need to be changed once we get backend and data working 
    3. UI 
      --> There's a lot of weird "px" values and spacing values that i just kinda used 
          to get the scaling right, these will need to be changed in the final implementation along 
          with some @media queueries (chakra's version). There's also no color here because i wasn't sure 
          what we were going for for the theme, so that'll needed to be added to. i just wanted to get 
          the basic structure down more than anything because i feel like that's the hardest 
          part. 
  */

  return (
    <Box
      width="400px"
      height="400px"
      borderRadius="100px"
      backgroundColor="gray"
      padding="15px 40px 20px"
    >
      <VStack justifyContent="space-between" height="100%">
        <Text fontSize="2rem">{group.name}</Text>
        <Text fontSize="1rem" flexGrow="20">
          {group.desc}
        </Text>
        <HStack justifyContent="space-between" spacing="20px">
          <Avatar size="xl" />
          <VStack justifyContent="space-between" spacing="15px">
            <Text>Created {group.createDate}</Text>
            {group.members.length > 1 ? (
              <HStack spacing="20px">
                <Avatar size="lg" />
                {group.members.length > 2 ? <Avatar size="lg" /> : undefined}
                {group.members.length > 3 ? (
                  <Box
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    backgroundColor="darkgray"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    +{group.members ? group.members.length - 3 : ""}
                  </Box>
                ) : undefined}
              </HStack>
            ) : undefined}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

/*
const CompactGroupV2 = ({ name, desc, members, createDate }: Props) => {
  // Added in case we want to just display usernames instead of pfps

  return (
    <Box
      width="400px"
      height="400px"
      borderRadius="100px"
      backgroundColor="gray"
      padding="15px 40px 20px"
    >
      <VStack justifyContent="space-between" height="100%">
        <Text fontSize="2rem">{name}</Text>
        <Text fontSize="1rem" flexGrow="20">
          {desc}
        </Text>
        <VStack justifyContent="space-between" spacing="15px">
          <Text>Created {createDate}</Text>
          <Box textAlign="center">
            Members:
            {members?.map((mem, index) => {
              if (index <= 3 && index < members.length - 1) {
                return <Text display="inline"> {mem},</Text>;
              } else if (index === 4 || index === members.length - 1) {
                return <Text display="inline"> {mem}</Text>;
              }
            })}
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};*/

export { CompactGroupV1 };
