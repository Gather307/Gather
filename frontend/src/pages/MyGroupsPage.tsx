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
  useBreakpointValue,
} from "@chakra-ui/react";
import SkeletonGroup from "../components/SkeletonGroup";
import { IoIosSwap } from "react-icons/io";
import SearchBar from "../components/SearchBar";
import PageSelector from "../components/PageSelector";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MyGroups.css";
import NewGroupOptions from "../components/NewGroupOptions";
import { IGroup } from "../../../backend/models/groupSchema";
import { IUser } from "../../../backend/models/userSchema";
import { fetchGroups } from "../../lib/fetches";

type Props = {
  stateVariable: {
    user: IUser | null;
    token: string;
  };
  updateState: any;
};

// Component to manage and display group page
const GroupPage: React.FC<Props> = ({
  stateVariable,
  updateState,
}: {
  stateVariable: any;
  updateState: any;
}) => {
  // State for the list of groups, filtered groups, and selected page
  const [groupList, setGroupList] = useState<IGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  let gridDims = useBreakpointValue(
    {
      sm: [2, 2],
      lg: [2, 3],
      xl: [2, 4],
      base: [12, 1],
    },
    { fallback: "base", ssr: false }
  );
  gridDims = gridDims === undefined ? [12, 1] : gridDims;
  const skelIds: number[] = [];
  const navigate = useNavigate();
  // Populate skelIds with a sequence of numbers based on grid dimensions
  for (let i = 0; i < gridDims[0] * gridDims[1]; i++) {
    skelIds.push(i);
  }

  // Function to search and filter groups based on input
  const searchGroups = (input: string) => {
    if (input === "") {
      setFilteredGroups(groupList);
    } else {
      const lowerQuery = input.toLowerCase();
      setFilteredGroups(
        groupList.filter((group) =>
          group.groupName.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  useEffect(() => {
    if (stateVariable.user) {
      // Fetch groups for the current user
      fetchGroups(stateVariable.user.groups)
        .then((tempGroupList) => {
          setGroupList(tempGroupList); // Update state with the fetched groups
          setFilteredGroups(tempGroupList); // Initialize with full list
        })
        .catch((err) => {
          console.log(`Terrible error occurred! ${err}`);
        });
    } else {
      // If no user is found, navigate to the login page if no token is present
      if (!stateVariable.token) {
        navigate("/login");
      }
    }
  }, [stateVariable.user]);

  // Log the user ID to the console
  console.log(stateVariable?.user?._id);

  return (
    <Box
      display="block"
      width="100%"
      height="100%"
      overflowY={{ base: "auto" }}
      overflowX="hidden"
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
            <Link to="/items" className="custom-link">
              switch to items
            </Link>
          </Flex>
        </Box>

        <NewGroupOptions
          user={stateVariable.user}
          updateUser={updateState.setUser}
        />

        <Box display={{ base: "none", lg: "block" }}>
          <SearchBar
            onSearch={searchGroups}
            placeholder="search for groups"
            width="500px"
          />
        </Box>
      </HStack>

      {/* Solid line b/t Header & Grid */}
      <Box
        height="2px"
        minHeight="2px"
        margin="0px 15px"
        bgColor="rgba(100, 100, 100, 0.8)"
        bgGradient="linear(to-r, rgba(0,0,0,0) 10%, var(--col-secondary) 30%, var(--col-secondary) 70%, rgba(0,0,0,0) 90%)"
      />

      {/* Grid */}
      <Grid
        templateColumns={{
          base: "repeat(1, 90vw)",
          sm: "repeat(2, 40vw)",
          lg: "repeat(3, 27vw)",
          xl: "repeat(4, 20vw)",
        }}
        templateRows={{
          base: "repeat(12, 90vw)",
          sm: "repeat(2, 40vw)",
          lg: "repeat(2, 27vw)",
          xl: "repeat(2, 20vw)",
        }}
        gap="1.5vw 3.5vw"
        width="100vw"
        flexGrow={1}
        padding="1vw"
        justifyContent="center"
        alignItems="center"
      >
        {stateVariable.user?.groups.length !== 0 &&
        filteredGroups.length === 0 ? (
          skelIds.map((id, ind) => {
            const currentPage = Math.floor(ind / (gridDims[0] * gridDims[1]));
            if (currentPage + 1 != selectedPage) return null;
            const row = Math.floor(
              (ind % (gridDims[1] * gridDims[0])) / gridDims[1]
            );
            const col = ind % gridDims[1];
            return (
              <GridItem w="100%" h="100%" key={`skelly${id}`}>
                <SkeletonGroup
                  width="100%"
                  height="100%"
                  corners={[
                    row === 0 || col === 0,
                    row === 0 || col === gridDims[1] - 1,
                    row === gridDims[0] - 1 || col === gridDims[1] - 1,
                    row === gridDims[0] - 1 || col === 0,
                  ]}
                />
              </GridItem>
            );
          })
        ) : filteredGroups.length !== 0 ? (
          filteredGroups.map((group, ind) => {
            const currentPage = Math.floor(ind / (gridDims[0] * gridDims[1]));
            if (currentPage + 1 != selectedPage) return null;
            const row = Math.floor(
              (ind % (gridDims[1] * gridDims[0])) / gridDims[1]
            );
            const col = ind % gridDims[1];
            return (
              <GridItem w="100%" aspectRatio={1 / 1} key={`groupitem${ind}`}>
                <Link to={`/groups/${group._id}`}>
                  <CompactGroupV1
                    width="100%"
                    height="100%"
                    group={group}
                    corners={[
                      row === 0 || col === 0,
                      row === 0 || col === gridDims[1] - 1,
                      row === gridDims[0] - 1 || col === gridDims[1] - 1,
                      row === gridDims[0] - 1 || col === 0,
                    ]}
                  />
                </Link>
              </GridItem>
            );
          })
        ) : (
          <GridItem key="default">
            <Box>No groups found! Do you want to add one?</Box>
          </GridItem>
        )}
      </Grid>

      {/* Page Selector */}
      <Box
        display="flex"
        width="100%"
        height="10%"
        justifyContent="flex-end"
        paddingRight="4%"
      >
        <PageSelector
          range={Math.ceil(filteredGroups.length / (gridDims[0] * gridDims[1]))}
          limit={5}
          selected={selectedPage}
          onSelect={(n) => setSelectedPage(n)}
          minimal={false}
        />
      </Box>
    </Box>
  );
};

export default GroupPage;
