import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { IGroup } from "../../../backend/models/groupSchema";
import { IUser } from "../../../backend/models/userSchema";
import { IBasket } from "../../../backend/models/basketSchema";
import { fetchMembers, fetchGroupById } from "../../lib/fetches";
import BasketComp from "../components/Basket";
import Editgroup from "../components/EditGroup";
import NewBasketOptions from "../components/NewBasketOptions";

type Props = {
  LoggedInUser: IUser | null;
};

const IndividualGroupPage: React.FC<Props> = ({ LoggedInUser }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<IGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<IUser[]>([]);
  const [baskets, setBaskets] = useState<IBasket[]>([]);
  const navigate = useNavigate();

  const fetchGroup = async () => {
    try {
      if (!groupId) {
        throw new Error("No group ID provided");
      }
      const fetchedGroup = await fetchGroupById(groupId);
      if (fetchedGroup.ok) {
        const group = await fetchedGroup.json();
        setGroup(group);
        setBaskets(group.baskets);
        fetchMembers(group.members).then((members) => {
          setMembers(members as IUser[]);
        });
        setLoading(false);
      } else {
        throw new Error(`Failed to fetch group: ${fetchedGroup.statusText}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      backgroundColor="var(--col-bright)"
    >
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        padding="10px 20px"
        borderBottom="2px solid"
        borderColor="rgba(100, 100, 100, 0.8)"
        bgGradient="linear(t-b, rgba(0,0,0,0) 10%, var(--col-secondary) 30%, var(--col-secondary) 70%, rgba(0,0,0,0) 90%)"
        flexWrap="wrap"
      >
        <Button
          onClick={() => navigate("/groups")}
          variant="link"
          leftIcon={<IoArrowBack />}
        >
          Go Back
        </Button>
        <Flex
          alignItems="right"
          flexDirection={{ base: "column", md: "row" }}
          mt={{ base: 4, md: 0 }}
        >
          <Button
            onClick={() => console.log("Send Invite clicked")}
            bg="teal"
            color="white"
            _hover={{ bg: "teal" }}
            marginRight={{ md: "10px" }}
            mb={{ base: 2, md: 0 }}
            alignSelf={{ base: "flex-end", md: "center" }}
          >
            Send Invite
          </Button>
          <InputGroup width={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none" children={<IoSearch />} />
            <Input
              placeholder="Search in group"
              backgroundColor="rgba(255, 255, 255, 0.8)"
            />
          </InputGroup>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex
        flexDirection="column"
        padding="20px"
        flex="1"
        overflowY="scroll"
        alignItems="center"
      >
        {loading ? (
          <Box padding="20px">Loading...</Box>
        ) : group ? (
          <>
            <Box
              width="99%"
              padding="20px"
              borderWidth="1px"
              borderRadius="2xl"
              backgroundColor="rgba(255, 255, 255, 0.8)"
              overflow="auto"
            >
              <VStack align="stretch" spacing={4}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  position="relative"
                >
                  <Flex width="33%"></Flex>
                  <Heading size="2xl" textAlign="center" width="33%">
                    {group.groupName}
                  </Heading>
                  <Flex flexDir={"row"} justifyContent={"flex-end"} width="33%">
                    <Editgroup GroupId={groupId} />
                  </Flex>
                </Flex>
                <Divider marginY="20px" />
                <VStack>
                  <Box
                    padding="10px"
                    borderWidth="1px"
                    borderRadius="md"
                    flex="1"
                    backgroundColor="rgba(0, 0, 0, 0.05)"
                  >
                    <Heading size="md" marginBottom="10px">
                      Members
                    </Heading>
                    <HStack align="start">
                      {members.map((member) => (
                        <HStack
                          key={member._id.toString()}
                          spacing={4}
                          align="center"
                        >
                          <Avatar
                            name={member.username}
                            src={`http://localhost:3001/${member._id}/avatar`}
                          />
                          <Text>{member.username}</Text>
                        </HStack>
                      ))}
                    </HStack>
                  </Box>
                  <HStack spacing={4}>
                    <Box
                      padding="10px"
                      borderWidth="1px"
                      borderRadius="md"
                      flex="1"
                      backgroundColor="rgba(0, 0, 0, 0.05)"
                    >
                      <Heading size="md" marginBottom="10px">
                        Created On
                      </Heading>
                      <Text>
                        {new Date(group.created).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box
                      padding="10px"
                      borderWidth="1px"
                      borderRadius="md"
                      flex="2"
                      backgroundColor="rgba(0, 0, 0, 0.05)"
                    >
                      <Heading size="md" marginBottom="10px">
                        Description
                      </Heading>
                      <Text fontSize="lg">
                        {group.description || "No description given"}
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </VStack>
              <Box mt={8} width="99%">
                <Heading size="xl">Baskets</Heading>
                <NewBasketOptions
                  user={LoggedInUser}
                  group={group}
                  updateGroup={group}
                />
                <Box maxHeight="300px" mt={4}>
                  <VStack spacing={4} align="stretch">
                    {baskets.map((basket) => (
                      <BasketComp
                        key={basket.basketName}
                        basketId={basket._id.toString()}
                        stateObj={{ user: members, token: "your-token-here" }}
                        groupMembers={members}
                        LoggedInUser={LoggedInUser}
                      />
                    ))}
                  </VStack>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Box padding="20px">
            <Text fontSize="lg">Group not found!</Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default IndividualGroupPage;
