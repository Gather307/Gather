import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import "../styles/Basket.css";
import { useEffect, useState } from "react";
import BasketItem from "./BasketItem";
import NewItemOptions from "./NewItemOptions";
import EditBasket from "./EditBasket";
import AddFriendToBasket from "./AddFriendToBasket";
import { fetchBasket, fetchMembers } from "../../lib/fetches";
import { IBasket } from "../../../backend/models/basketSchema";
import { IUser } from "../../../backend/models/userSchema";
import { ObjectId } from "mongoose";

// Define the props for the component
interface Props {
  basketId: string;
  groupMembers: IUser[];
  LoggedInUser: IUser | null;
  groupId: string;
}

// Basket component to display and manage basket details
const BasketComp = ({
  basketId,
  groupMembers,
  LoggedInUser,
  groupId,
}: Props) => {
  // State to store basket details
  const [basketObj, setBasket] = useState<IBasket>({} as IBasket);
  // State to handle errors
  const [error, setError] = useState({
    msg: "",
    isErrored: false,
  });
  // State to store member names
  const [memberNames, setMemberNames] = useState<string[]>([]);

  // Effect to fetch basket details and member names
  useEffect(() => {
    fetchBasket(basketId)
      .then((res) =>
        res.status === 200
          ? res.json()
          : Promise.reject(`Error code ${res.status}`),
      )
      .then((data) => {
        setBasket({
          _id: data._id,
          basketName: data.basketName,
          description: data.description,
          items: data.items,
          members: data.members,
          created: new Date(data.created),
        });
        fetchMembers(data.members)
          .then((res) => {
            const temp = []; // extract just the usernames from response
            for (let i = 0; i < res.length; i++) {
              temp.push(res[i].username);
            }
            setMemberNames(temp);
          })
          .catch(() => console.log("Error loading member names"));
      })
      .catch((err) => {
        console.log("Error: ", err);
        setError({
          msg: err,
          isErrored: true,
        });
      });
  }, [basketId]);

  // Render things differently depending on how many members are in a basket
  const multiMemberView = memberNames.length !== 1;
  // Determine if the logged in user is a member of the basket
  // Note: Privacy wise, this is terrible design. This is logic that should be done on the backend since by only rendering/derendering
  // items whether or not you're actually allowed to view them doesn't stop anyone from just checking the data that was recieved by the
  // frontend (it SHOULD be that the backend either approves/declines your request based on if you're authorized). Because of the way
  // we designed our database, it was nearly impossible to fix this design flaw by the time we realized (we just didn't have enough time
  // to change the rest of our project since it was so late in the train). We acknowledge that this is a privacy problem and we would have
  // liked to fix it but because of time constraints we were unable to.

  // Determine if the logged-in user is a member of the basket
  const isMemberOfBasket =
    LoggedInUser &&
    basketObj &&
    basketObj.members &&
    basketObj.members.includes(LoggedInUser?._id);

  // Determine if the logged-in user is the owner of the basket
  const isOwnerOfBasket =
    LoggedInUser &&
    basketObj &&
    basketObj.members &&
    basketObj.members[0] === LoggedInUser?._id;

  return (
    <Flex
      width="100%"
      height="auto"
      overflow="auto"
      maxHeight="400px"
      className="basket"
      flexDir={{ base: "column", md: "row" }}
      borderRadius={{ base: "50px", md: "0px 50px 50px 0px" }}
    >
      <Flex
        className="b-desc"
        width={{
          lg: "20%",
          md: "30%",
        }}
        direction="column"
        borderRightWidth={{ base: "0px", md: "5px" }}
        borderBottomWidth={{ base: "5px", md: "0px" }}
      >
        <Flex
          className="b-header"
          height="fit-content"
          width={{ base: "100%", md: "fit-content" }}
          borderBottomRightRadius={{ base: "0px", md: "30px" }}
          justify={"space-between"}
        >
          <Box
            fontSize="1.5rem"
            maxWidth="80%"
            margin="10px"
            color="var(--col-bright)"
          >
            {basketObj.basketName === undefined ? "" : basketObj.basketName}
          </Box>
          <Avatar
            marginRight="10px"
            display={`${multiMemberView ? "none" : "center"}`}
            name={memberNames[0]}
          />
        </Flex>
        <Flex flexDir="column" h="100%" p="5%" justifyContent="space-between">
          {basketObj.items !== undefined ? (
            <>
              <VStack alignItems="start">
                <Text as="b">
                  {basketObj?.created
                    ? "Created " + basketObj?.created?.toLocaleDateString()
                    : ""}
                </Text>
                <Text>
                  <Text as="b">Number of items:</Text>{" "}
                  {basketObj?.items?.length}
                </Text>
                <Text wordBreak="break-word">
                  <Text as="b">Description: </Text>
                  {basketObj?.description === undefined
                    ? "missing"
                    : basketObj?.description}
                </Text>
                <Text
                  display={multiMemberView ? "auto" : "none"}
                  marginBottom={multiMemberView ? "10px" : "none"}
                >
                  <Text as="b">Members:</Text> {memberNames.join(", ")}
                </Text>
              </VStack>
              <Flex
                width="100%"
                justifyContent={"space-around"}
                padding="5px"
                flexDir={{
                  xl: "row",
                  base: "column",
                }}
              >
                {isOwnerOfBasket ? (
                  <AddFriendToBasket
                    groupId={groupId}
                    basketId={basketId.toString()}
                    groupMembers={groupMembers}
                    basketMemberIds={basketObj?.members}
                    currentUserId={LoggedInUser?._id.toString()}
                  />
                ) : LoggedInUser &&
                  basketObj.members.includes(LoggedInUser._id) ? (
                  <AddFriendToBasket
                    groupId={groupId}
                    basketId={basketId.toString()}
                    groupMembers={[LoggedInUser]}
                    basketMemberIds={basketObj?.members}
                    currentUserId={LoggedInUser?._id.toString()}
                  />
                ) : (
                  <></>
                )}

                {isMemberOfBasket ? (
                  <EditBasket
                    groupId={groupId}
                    basketId={basketId.toString()}
                  />
                ) : (
                  <></>
                )}
              </Flex>
            </>
          ) : (
            <></>
          )}
        </Flex>
      </Flex>
      <Box
        className="b-itemside"
        width={{ base: "100%", md: "80%" }}
        borderLeftWidth={{ base: "0px", md: "5px" }}
        borderTopWidth={{ base: "5px", md: "0px" }}
      >
        <Flex justifyContent="space-between">
          <Heading>Basket Items</Heading>
          <NewItemOptions
            display={isMemberOfBasket ? "flex" : "none"}
            basket={basketId}
            updateBasket={setBasket}
          />
        </Flex>
        <Divider borderColor="black" marginTop="1%" />
        <VStack>
          {basketObj ? (
            basketObj.items?.map((item: ObjectId) => {
              return (
                <BasketItem
                  key={item.toString()}
                  bid={basketId}
                  basketMemberView={isMemberOfBasket ? isMemberOfBasket : false}
                  itemId={item.toString()}
                />
              );
            })
          ) : error.isErrored ? (
            <Text color="red">Error loading basket data.</Text>
          ) : (
            ""
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default BasketComp;
