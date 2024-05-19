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
  Link,
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
  const [selectedPage, setSelectedPage] = useState(1);
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
      backgroundColor="var(--col-bright)"
    >
      {/* Header flex */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        padding="0px 20px"
      >
        {/* Header text + Switch items */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir="row"
          minHeight="8vh"
        >
          <Heading
            color="var(--col-secondary)"
            fontWeight="300"
            as="i"
            fontSize="40px"
          >
            Your{" "}
            <Heading
              display="inline"
              fontStyle="normal"
              letterSpacing="2px"
              fontSize="40px"
            >
              GROUPS
            </Heading>
          </Heading>

          <Flex margin="10px 0px 0px 15px" alignItems="center">
            <Icon
              color="var(--col-dark)"
              as={IoIosSwap}
              marginRight="10px"
              width="30px"
              height="30px"
            />
            <Link
              color="var(--col-dark)"
              letterSpacing="2px"
              as="i"
              fontSize="20px"
              href="/items"
            >
              switch to items
            </Link>
          </Flex>
        </Box>

        <Box>joingroupcomponent</Box>

        <SearchBar
          onSearch={(inp) =>
            console.log(`Hello, reviewer. The input was ${inp}`)
          }
          placeholder="search for groups"
          width="500px"
        />
      </HStack>

      {/* Solid line b/t Header & Grid */}
      <Box
        height="2px"
        margin="0px 15px"
        bgColor="rgba(100, 100, 100, 0.8)"
        bgGradient="linear(to-r, rgba(0,0,0,0) 10%, var(--col-secondary) 30%, var(--col-secondary) 70%, rgba(0,0,0,0) 90%)"
      />

      {/* Grid */}
      <Grid
        templateColumns={`repeat(${gridDims[1]}, 20vw)`}
        templateRows={`repeat(${gridDims[0]}, 20vw)`}
        gap="1.5vw 3.5vw"
        width="100vw"
        height="85%"
        padding="2vw"
        justifyContent="center"
        alignItems="center"
      >
        {loading ? (
          skelIds.map((id, ind) => {
            return (
              <GridItem w="100%" h="100%" key={`skelly${id}`}>
                <SkeletonGroup width="100%" height="100%" />
              </GridItem>
            );
          })
        ) : groupList.length !== 0 ? (
          groupList.map((group, ind) => {
            const currentPage = Math.floor(ind / (gridDims[0] * gridDims[1]));
            if (currentPage + 1 != selectedPage) return;
            return (
              <GridItem w="100%" h="100%" key={`groupitem${ind}`}>
                <CompactGroupV1 width="100%" height="100%" group={group} />
              </GridItem>
            );
          })
        ) : (
          <GridItem key="default">
            <Box>You have no groups! Add one.</Box>
          </GridItem>
        )}
      </Grid>

      {/* Page Selector */}
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
          selected={selectedPage}
          onSelect={(n) => setSelectedPage(n)}
          minimal={false}
        />
      </Box>
    </Box>
  );
}

export default GroupPage;
