import { Text, Icon, SkeletonText, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import "../styles/BasketItem.css";

export interface MinimalItem {
  name: string;
  isPrivate: boolean;
  notes: string;
  quantity: number;
}

interface Props {
  itemId: string;
  basketMemberView: boolean;
}

const BasketItem = ({ itemId, basketMemberView }: Props) => {
  const [item, setItem] = useState<MinimalItem>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    msg: "",
    isErrored: false,
  });

  const fetchItem = () => {
    return fetch(`http://localhost:3001/items/${itemId}`);
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
        setItem({
          name: data.name,
          isPrivate: data.isPrivate,
          notes: data.notes,
          quantity: data.quantity,
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
  }, [itemId]);

  // realistically this is NOT a privacy enforcer since the items are still being retrieved & saved
  // on the browser, they just aren't being displayed. to fix this we'd have to do some backend
  // logic, which isn't implemented yet.
  if (!basketMemberView && item?.isPrivate) {
    return;
  }

  return (
    <Box w="100%" overflow="hidden" margin="0.5rem" className="b-item">
      {loading ? (
        <Flex>
          <Box>
            <SkeletonText />
          </Box>
          <Box>
            <SkeletonText />
          </Box>
          <Box>
            <SkeletonText />
          </Box>
        </Flex>
      ) : error.isErrored ||
        item?.notes === undefined ||
        item?.name === undefined ||
        item?.quantity === undefined ? (
        <Flex>
          <Box color="red">Error: {error.msg}</Box>
          <Box></Box>
          <Box color="red">Click to retry</Box>
        </Flex>
      ) : (
        <Flex
          bgColor="var(--col-secondary)"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          padding={`${basketMemberView ? "0px" : "10px"} 2%`}
          borderRadius="20px"
        >
          <Box flexGrow="3">{item?.name}</Box>
          <Box flexGrow="6" display={{ base: "none", md: "block" }}>
            {item?.notes}
          </Box>
          <Flex
            flexDir="column"
            align="center"
            flexGrow="1"
            display={`${basketMemberView ? "auto" : "none"}`}
          >
            <Icon
              w="30px"
              h="30px"
              marginTop="5px"
              as={item?.isPrivate ? VscEyeClosed : VscEye}
              className="b-publicity"
              onClick={() => {
                console.log("changing data!");
                setItem({
                  name: item?.name,
                  isPrivate: !item?.isPrivate,
                  notes: item?.notes,
                  quantity: item?.quantity,
                });
              }}
            />
            <Text
              fontSize="0.7rem"
              fontStyle="italic"
              marginBottom="5px"
              display={{ base: "none", md: "block" }}
            >
              Viewable by other group members
            </Text>
          </Flex>
          <Flex justifyContent="center" flexGrow="1">
            {item?.quantity}
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default BasketItem;
