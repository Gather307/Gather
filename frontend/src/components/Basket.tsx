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

interface Props {
  basketId: string;
  groupMembers: IUser[];
  LoggedInUser: IUser | null;
}

const BasketComp = ({ basketId, groupMembers, LoggedInUser }: Props) => {
  const [basketObj, setBasket] = useState<IBasket>({} as IBasket);
  const [error, setError] = useState({
    msg: "",
    isErrored: false,
  });
  const [memberNames, setMemberNames] = useState<string[]>([]);

  useEffect(() => {
    fetchBasket(basketId)
      .then((res) =>
        res.status === 200
          ? res.json()
          : Promise.reject(`Error code ${res.status}`)
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
            let temp = []; // extract just the usernames from response
            for (let i = 0; i < res.length; i++) {
              temp.push(res[i].username);
            }
            console.log(res);
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
  const multiMemberView = `${memberNames.length === 1 ? "none" : "none"}`;

  return (
    <Flex
      width="100%"
      height="-webkit-fill-available"
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
          justify={{ base: "center", md: "flex-start" }}
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
            display={`${multiMemberView === "auto" ? "none" : "center"}`}
            name={memberNames[0]}
          />
        </Flex>
        <Flex flexDir="column" h="100%" p="5%">
          {basketObj.items !== undefined ? (
            <>
              <VStack alignItems="start">
                <Text as="b">
                  {basketObj?.created
                    ? "Created " + basketObj?.created?.toDateString()
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
              </VStack>
              <Flex direction="column" justifyContent="flex-end" flexGrow="1">
                <Text display={multiMemberView}>
                  <Text as="b">Members:</Text> {memberNames.join(", ")}
                </Text>
                <Flex
                  width="100%"
                  justifyContent={"space-around"}
                  padding="5px"
                  flexDir={{
                    xl: "row",
                    base: "column",
                  }}
                >
                  <AddFriendToBasket
                    basketId={basketId.toString()}
                    memberid={groupMembers}
                    currentUserId={LoggedInUser?._id.toString()}
                  />
                  <EditBasket basketId={basketId.toString()} />
                </Flex>
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
          <NewItemOptions basket={basketId} updateBasket={setBasket} />
        </Flex>
        <Divider borderColor="black" marginTop="1%" />
        <VStack>
          {basketObj ? (
            basketObj.items?.map((item: ObjectId) => {
              return (
                <BasketItem
                  key={item.toString()}
                  basketMemberView={false}
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
