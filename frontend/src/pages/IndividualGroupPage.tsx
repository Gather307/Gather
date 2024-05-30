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
import BasketComp, { Basket } from "../components/Basket";
import Editgroup from "../components/EditGroup";
import NewBasketOptions from "../components/NewBasketOptions";
import { error } from "console";

type Props = {
  LoggedInUser: string;
};

const IndividualGroupPage: React.FC<Props> = ({ LoggedInUser }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<IGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedInIUSER, setLoggedInIUSER] = useState<IUser>();
  const [members, setMembers] = useState<IUser[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const navigate = useNavigate();

  const fetchLoggedInUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/users/${LoggedInUser}`,
      );
      if (res.ok) {
        const loggedInWholeUser = await res.json();
        setLoggedInIUSER(loggedInWholeUser);
      } else {
        throw new Error(`Failed to fetch user: ${res.statusText}`);
      }
    } catch (err) {
      console.error(err)
    }
  }



  const fetchGroup = async () => {
    try {
      const fetchedGroup = await fetch(
        `http://localhost:3001/groups/${groupId}`,
      );
      if (fetchedGroup.ok) {
        const data = await fetchedGroup.json();
        setGroup(data);
        fetchMembers(data.members);
        fetchBaskets(data.baskets);
        setLoading(false);
      } else {
        throw new Error(`Failed to fetch group: ${fetchedGroup.statusText}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async (memberIds: string[]) => {
    try {
      const fetchedMembers = await Promise.all(
        memberIds.map(async (memberId) => {
          const res = await fetch(`http://localhost:3001/users/${memberId}`);
          if (res.ok) {
            return res.json();
          } else {
            throw new Error(`Failed to fetch user: ${res.statusText}`);
          }
        }),
      );
      setMembers(fetchedMembers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBaskets = async (basketIds: string[]) => {
    try {
      const fetchedBaskets = await Promise.all(
        basketIds.map(async (basketId) => {
          const res = await fetch(`http://localhost:3001/baskets/${basketId}`);
          if (res.ok) {
            return res.json();
          } else {
            throw new Error(`Failed to fetch basket: ${res.statusText}`);
          }
        }),
      );
      setBaskets(fetchedBaskets);
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
            >
              <VStack align="stretch" spacing={4}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  position="relative"
                >
                  <Flex width="33%">
                  </Flex>
                  <Heading
                  size="2xl" textAlign="center" width="33%">
                    {group.groupName}
                  </Heading>
                  <Flex
                  flexDir={"row"}
                  justifyContent={"flex-end"}
                  width="33%"
                  >
                  <Editgroup GroupId={groupId} />
                  </Flex>
                </Flex>
                <Divider marginY="20px" />
                <HStack spacing={4}>
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
                    <VStack align="start">
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
                    </VStack>
                  </Box>
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
                    <Text>{new Date(group.created).toLocaleDateString()}</Text>
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
              <Box mt={8} width="99%">
                <Heading size="xl">Baskets</Heading>
                <NewBasketOptions   user = {loggedInIUSER} group = {group} updateGroup = {group}/>
                <Box maxHeight="300px" mt={4}>
                  <VStack spacing={4} align="stretch">
                    {baskets.map((basket) => (
                      <BasketComp
                        key={basket.basketName}
                        basketId={basket._id}
                        stateObj={{ user: members, token: "your-token-here" }}
                        groupMembers={members}
                        LoggedInUser={LoggedInUser}
                        isOwnerView={false} // Adjust this
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
