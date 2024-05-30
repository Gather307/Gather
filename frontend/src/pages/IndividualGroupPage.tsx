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
import { fetchMembers, fetchGroupById, fetchGroupBaskets } from "../../lib/fetches";
import BasketComp from "../components/Basket";
import Editgroup from "../components/EditGroup";
import NewBasketOptions from "../components/NewBasketOptions";
import SendInviteToGroup from "../components/SendInvite";

type Props = {
  LoggedInUser: IUser | null;
};

const IndividualGroupPage: React.FC<Props> = ({ LoggedInUser}) => {
  const {groupId} = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<IGroup | null>(null);
  const [groupBaskets, setGroupBaskets] = useState<IBasket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<IUser[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);
  const navigate = useNavigate();
  console.log(LoggedInUser);
  console.log(friends);

  const fetchFriends = async (friendIds: string[]) => {
    try {
      const fetchedFriends = await Promise.all(
        friendIds.map(async (friendId) => {
          const res = await fetch(`http://localhost:3001/users/${friendId}`);
          if (res.ok) {
            return res.json();
          } else {
            throw new Error(`Failed to fetch friends: ${res.statusText}`);
          }
        }),
      );
      setFriends(fetchedFriends);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsersFriends = async () => {
    try {
      const fetchedUser = await fetch(
        `http://localhost:3001/users/${LoggedInUser?._id}`,
      );
      if (fetchedUser.ok) {
        const data = await fetchedUser.json();
        fetchFriends(data.friends);
      } else {
        throw new Error(`Failed to fetch User: ${fetchedUser.statusText}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroup = async (groupId: string) => {
    const groupData = await fetchGroupById(groupId);
    setGroup(groupData);
    fetchUsersFriends();
    return groupData;
  };

  const fetchGroupMembers = async (group: IGroup) => {
    const membersData = await fetchMembers(group.members);
    setMembers(membersData);
  };

  const fetchBaskets = async (group: IGroup) => {
    const basketsData = await fetchGroupBaskets(group);
    setGroupBaskets(basketsData);
  };

  useEffect(() => {
    console.log(`Loading: ${loading}`);
    if (groupId) {
      fetchGroup(String(groupId))
        .then((group) => {
          console.log(`Fetched group: ${group}`);
          fetchGroupMembers(group as IGroup).then(() => {
            console.log(`Fetched group members: ${members}`);
            fetchBaskets(group as IGroup).then(() => {
              console.log(`Fetched group baskets: ${groupBaskets}`);
              setLoading(false);
            }).catch((err) => {
              console.log(`Error fetching group baskets: ${err}`);
            });
          }).catch((err) => {
            console.log(`Error fetching group members: ${err}`);
          });
        })
        .catch((err) => {
          console.log(`Terrible error occurred! ${err}`);
        });
    }
 
  }, [loading]);

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
          <SendInviteToGroup
            groupId={String(groupId)}
            friends={friends}
            members={members ?? []}
          ></SendInviteToGroup>
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
        { loading ? (
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
                    { groupId ? ( 
                      <Editgroup GroupId={String(groupId)} />
                    ) : (
                      <></>
                    )}
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
                      { members ? (
                        members.map((member) => (
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
                        ))
                      ) : (
                        <Text>No members found</Text>
                      )}
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
                    { groupBaskets && members ? (
                      groupBaskets.map((basket) => (
                        console.log(group),
                        console.log(basket),
                        <BasketComp
                          key={String(basket._id)}
                          basketId={String(basket._id)}
                          stateObj={{ user: members, token: "your-token-here" }}
                          groupMembers={members}
                          LoggedInUser={LoggedInUser}
                        />
                      ))
                    ) : (
                      <Text>No baskets available</Text>
                    )}
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
