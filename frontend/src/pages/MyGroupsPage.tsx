import { useEffect, useState } from "react";
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
import PageSelector from "../components/PageSelector";

export interface Group {
  groupName: string;
  description: string;
  members: string[];
  created: Date;
}

function GroupPage() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const gridDims = [2, 4];

  const fetchGroups = () => {
    const promise = fetch("http://localhost:3001/groups/");
    return promise;
  };
  const skelIds: number[] = [];
  for (let i = 0; i < gridDims[0] * gridDims[1]; i++) {
    skelIds.push(i);
  }

  useEffect(() => {
    fetchGroups()
      .then((res) => {
        console.log("recieved");
        return res.json();
      })
      .then((data) => {
        setGroupList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(`Terrible error occured! ${err}`);
      });
  }, []);

  return (
    <Box
      zIndex={2}
      display="block"
      width="100%"
      height="100%"
      overflow="hidden"
    >
      <Box alignContent="center" padding="0px 20px">
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
        templateColumns={`repeat(${gridDims[1]}, 20vw)`}
        templateRows={`repeat(${gridDims[0]}, 20vw)`}
        gap="1.5vw 4.5vw"
        width="100vw"
        height="85%"
        padding="2vw"
        justifyContent="center"
      >
        {loading ? (
          skelIds.map((id, ind) => {
            let row = Math.floor(ind / gridDims[1]);
            let col = ind % gridDims[1];
            return (
              <GridItem key={`skelly${id}`}>
                <SkeletonGroup
                  width="100%"
                  height="100%"
                  corners={[
                    row === 0 || col === 0,
                    row === 0 || col === gridDims[1] - 1,
                    row === gridDims[0] - 1 || col === 0,
                    row === gridDims[0] - 1 || col === gridDims[1] - 1,
                  ]}
                />
              </GridItem>
            );
          })
        ) : groupList.length !== 0 ? (
          groupList.map((group, ind) => {
            let row = Math.floor(ind / gridDims[1]);
            let col = ind % gridDims[1];
            return (
              <GridItem w="100%" h="100%" key={`grouprend${ind}`}>
                <CompactGroupV1
                  width="100%"
                  height="100%"
                  group={group}
                  corners={[
                    row === 0 || col === 0,
                    row === 0 || col === gridDims[1] - 1,
                    row === gridDims[0] - 1 || col === 0,
                    row === gridDims[0] - 1 || col === gridDims[1] - 1,
                  ]}
                />
              </GridItem>
            );
          })
        ) : (
          <Box>You have no groups! Add one.</Box>
        )}
      </Grid>
      <Box
        display="flex"
        width="100%"
        height="10%"
        justifyContent="right"
        paddingRight="4%"
      >
        <PageSelector
          range={Math.ceil(groupList.length / (gridDims[0] * gridDims[1]))}
          limit={5}
          selected={page}
          onSelect={() => console.log("selected new number.")}
        />
      </Box>
    </Box>
  );
}

export default GroupPage;
