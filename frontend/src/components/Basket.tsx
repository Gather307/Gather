import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BasketItem from "./BasketItem";
import "../styles/Basket.css";
import NewItemOptions from "./NewItemOptions";
import { fetchBasket } from "../../lib/fetches";
import { IBasket } from "backend/models/basketSchema";

interface Props {
  basketId: string;
  stateObj: { user: any; token: any };
  isOwnerView: boolean;
}

const BasketComp = ({ basketId, stateObj, isOwnerView }: Props) => {
  const [basketObj, setBasket] = useState<IBasket>({} as IBasket);
  const [error, setError] = useState({
    msg: "",
    isErrored: false,
  });

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
      })
      .catch((err) => {
        console.log("Terrible error occured!", err);
        setError({
          msg: err,
          isErrored: true,
        });
      });
  }, [basketId]);

  const memberView = `${basketObj.members === undefined ? "none" : basketObj?.members?.length > 1 ? "auto" : "none"}`;
  const groupOwnerView = `${isOwnerView ? "auto" : "none"}`;
  const basketMemberView = basketObj?.members?.includes(stateObj?.user?._id);

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
          <Avatar display={`${memberView === "auto" ? "auto" : "none"}`} />
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
                <Text display={memberView}>
                  <Text as="b">Members:</Text>{" "}
                  {basketObj?.members?.join(", ")}
                </Text>
                <Flex
                  width="100%"
                  flexDir={{
                    xl: "row",
                    base: "column",
                  }}
                >
                  <Button
                    fontSize="0.9rem"
                    marginRight="10px"
                    p="3px"
                    bgColor="var(--col-secondary)"
                    opacity="70%"
                  >
                    Edit basket
                  </Button>
                  <Button
                    fontSize="0.9rem"
                    display={groupOwnerView}
                    p="3px"
                    bgColor="rgba(255, 100, 100, 0.3)"
                  >
                    Remove from group
                  </Button>
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
          {basketObj.items.length > 0 ? (
            basketObj.items.map((item) => {
              return (
                <BasketItem
                  key={item.toString()}
                  basketMemberView={basketMemberView}
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
