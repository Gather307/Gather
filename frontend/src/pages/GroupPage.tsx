import { useState } from "react";
import { CompactGroupV1 } from "../components/CompactGroup";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import SkeletonGroup from "../components/SkeletonGroup";

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
      <Box width="100%" bgColor="gray">
        Header box.
      </Box>
      <Box
        height="2px"
        bgGradient="linear(to-r, rgba(0,0,0,0) 0%, rgba(1,1,1,1) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0))"
      />
      <Grid
        templateColumns="repeat(4, 20vw)"
        templateRows="repeat(2, 20vw)"
        gap="4vw"
        width="100vw"
        height="100vh"
        padding="4vw"
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
