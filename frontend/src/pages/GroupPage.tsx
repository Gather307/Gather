import { useState } from "react";
import { CompactGroupV1 } from "../components/CompactGroup";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import SkeletonGroup from "../components/SkeletonGroup";
import { IoIosSwap } from "react-icons/io";
import SearchBar from "../components/SearchBar";

export interface Group {
  name: string;
  desc: string;
  members: string[];
  createDate: string;
}

function GroupPage() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const skelIds = [1, 2, 3, 4, 5, 6, 7, 8]; // Yeah this will need to be changed temp sol for now.
  let loading = true;

  return (
    <>
      <Box width="100%" height="100%" alignContent="center" padding="0px 20px">
        <HStack justifyContent="space-between" alignItems="center">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDir="row"
            minHeight="8vh"
          >
            <Heading>Your GROUPS</Heading>
            <Flex margin="10px 0px 0px 20px" alignItems="center">
              <Icon as={IoIosSwap} marginRight="10px" />
              <Text as="i">switch to items</Text>
            </Flex>
          </Box>
          <Box>joingroupcomponent</Box>
          <SearchBar
            onSearch={() => console.log("Hello, reviewer.")}
            placeholder="search for groups"
            width="400px"
          />
        </HStack>
      </Box>
      <Box
        height="4px"
        bgGradient="linear(to-r, rgba(0,0,0,0) 10%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.5) 70%, rgba(0,0,0,0) 90%)"
      />
      <Grid
        templateColumns="repeat(4, 20vw)"
        templateRows="repeat(2, 20vw)"
        gap="2.5vw 4vw"
        width="100vw"
        height="48vw"
        padding="2vw"
        justifyContent="center"
      >
        {loading
          ? skelIds.map((id) => (
              <GridItem id={`skelly${id}`}>
                <SkeletonGroup width="100%" height="100%" />
              </GridItem>
            ))
          : groupList.map((group, ind) => (
              <GridItem w="100%" h="100%" id={`grouprend${ind}`}>
                <CompactGroupV1 group={group} />
              </GridItem>
            ))}
      </Grid>
    </>
  );
}

export default GroupPage;
