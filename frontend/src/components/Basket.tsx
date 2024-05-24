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

export interface Basket {
  basketName: string;
  description: string;
  memberIds: string[];
  itemIds: string[];
  created?: Date;
}

interface Props {
  basketId: string;
  stateObj: { user: any; token: any };
  isOwnerView: boolean;
}

const BasketComp = ({ basketId, stateObj, isOwnerView }: Props) => {
  const [basketObj, setBasket] = useState<Basket>({} as Basket);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    msg: "",
    isErrored: false,
  });

  const fetchItem = () => {
    return fetch(`http://localhost:3001/baskets/${basketId}`);
  };

  useEffect(() => {
    setLoading(true);
    fetchItem()
      .then((res) =>
        res.status === 200
          ? res.json()
          : Promise.reject(`Error code ${res.status}`)
      )
      .then((data) => {
        setBasket({
          basketName: data.basketName,
          description: data.description,
          itemIds: data.items,
          memberIds: data.members,
          created: new Date(data.created),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log("Terrible error occured!", err);
        setLoading(false);
        setError({
          msg: err,
          isErrored: true,
        });
      });
  }, [basketId]);

  const memberView = `${basketObj.memberIds === undefined ? "none" : basketObj?.memberIds?.length > 1 ? "auto" : "none"}`;
  const ownerView = `${isOwnerView ? "auto" : "none"}`;

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
          {basketObj.itemIds !== undefined ? (
            <>
              <VStack alignItems="start">
                <Text as="b">
                  {basketObj?.created
                    ? "Created " + basketObj?.created?.toDateString()
                    : ""}
                </Text>
                <Text>
                  <Text as="b">Number of items:</Text>{" "}
                  {basketObj?.itemIds?.length}
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
                  {basketObj?.memberIds?.join(", ")}
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
                    display={ownerView}
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
          <Button>ADD ITEM</Button>
        </Flex>
        <Divider borderColor="black" marginTop="1%" />
        <VStack>
          {basketObj.itemIds !== undefined ? (
            basketObj.itemIds?.map((item) => {
              return <BasketItem key={item.slice(0, 10)} itemId={item} />;
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
