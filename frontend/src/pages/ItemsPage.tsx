import React, { useEffect } from "react";
import { Box, Flex, HStack, Heading, Icon, VStack } from "@chakra-ui/react";
import ItemGroup from "../components/ItemGroup";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../../../backend/models/userSchema";
import { IGroup } from "../../../backend/models/groupSchema";
import { fetchUserGroupsByUser } from "../../lib/fetches";
import { IoIosSwap } from "react-icons/io";
import SearchBar from "../components/SearchBar";

type Props = {
  stateVariable: {
    user: IUser | null;
    token: string;
  };
};

const ItemsPage: React.FC<Props> = ({
  stateVariable,
}: {
  stateVariable: any;
}) => {
  const [groupList, setGroupList] = React.useState<IGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    const tempGroupList = await fetchUserGroupsByUser(stateVariable.user);
    setGroupList(tempGroupList);
  };

  useEffect(() => {
    if (stateVariable.user) {
      fetchGroups()
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(`Terrible error occurred! ${err}`);
        });
    } else {
      if (!stateVariable.token) {
        navigate("/login");
      }
    }
  }, [stateVariable.user]);

  return (
    <Box w="100vw" p="0px 20px" bg="var(--col-bright)">
      <Flex direction="column" minH="100%" width="full">
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
                ITEMS
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
              <Link to="/groups" className="custom-link">
                switch to groups
              </Link>
            </Flex>
          </Box>
          <SearchBar
            onSearch={() => console.log("Absolutely not implemented yet.")}
            placeholder="search for groups"
            width="500px"
          />
        </HStack>
        {/* Solid line b/t Header & Grid */}
        <Box
          height="2px"
          margin="0px 15px"
          marginBottom={{ base: "10px", md: "20px" }}
          bgColor="rgba(100, 100, 100, 0.8)"
          bgGradient="linear(to-r, rgba(0,0,0,0) 10%, var(--col-secondary) 30%, var(--col-secondary) 70%, rgba(0,0,0,0) 90%)"
        />

        <VStack spacing={4} flex="1" align="stretch" width="full">
          {!loading ? (
            groupList.map((group) => {
              return (
                <ItemGroup
                  key={group._id.toString()}
                  group={group}
                  stateVariable={stateVariable}
                />
              );
            })
          ) : (
            <Heading as="h2" size="md">
              Loading...
            </Heading>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};

export default ItemsPage;
