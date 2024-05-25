import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";
import ItemGroup from "../components/ItemGroup";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../../backend/models/userSchema";
import { IGroup } from "../../../backend/models/groupSchema";

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

  const handleGroupsClick = () => {
    navigate("/groups");
  };

  const fetchGroups = async () => {
    const groupPromises = stateVariable.user.groups.map(
      async (group: string) => {
        const res = await fetch(`http://localhost:3001/groups/${group}`);
        if (res.status === 200) {
          const data = await res.json();
          return data;
        }
      },
    );

    const tempGroupList = await Promise.all(groupPromises);
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
    }
  }, [stateVariable.user]);

  return (
    <Box w="100vw" p={4} bg="gray.100">
      <Flex direction="column" minH="100vh" width="full">
        <Box mb={4} width="full">
          <Heading as="h1" size="lg">
            Your Items
          </Heading>
          <Flex mt={2} alignItems="center">
            <Button
              leftIcon={<ArrowForwardIcon />}
              onClick={handleGroupsClick}
              colorScheme="teal"
              variant="solid"
              mr={4}
            >
              Switch to Groups
            </Button>
            <InputGroup width="300px">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                placeholder="Search for group"
                isDisabled
                _disabled={{
                  bg: "white",
                  color: "gray.500",
                  cursor: "not-allowed",
                }}
              />
            </InputGroup>
          </Flex>
        </Box>

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
            }))
            : (
              <Heading as="h2" size="md">
                Loading...
              </Heading>
            )
          }
        </VStack>
      </Flex>
    </Box>
  );
};

export default ItemsPage;
