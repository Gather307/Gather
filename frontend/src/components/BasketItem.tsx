import { Text, Icon, SkeletonText, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import "../styles/BasketItem.css";
import { fetchItem } from "../../lib/fetches";
import { IItem } from "../../../backend/models/itemSchema";
import EditItem from "./EditItem";

interface Props {
  itemId: string;
  basketMemberView: boolean;
}

const BasketItem = ({ itemId, basketMemberView }: Props) => {
  const [item, setItem] = useState<IItem>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    msg: "",
    isErrored: false,
  });

  useEffect(() => {
    setLoading(true);
    fetchItem(itemId)
      .then((res) =>
        res.status === 200
          ? res.json()
          : Promise.reject(`Error code ${res.status}`)
      )
      .then((data) => {
        setItem(data);
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
      ) : error.isErrored || !item ? (
        <Flex>
          <Box color="red">Error: {error.msg}</Box>
          <Box />
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
          <Box display={{ base: "none", md: "block" }}>
            <EditItem itemId={item._id.toString()}></EditItem>
          </Box>
          <Flex
            flexDir="column"
            align="center"
            justifyContent="center"
            flexGrow="1"
            display={basketMemberView ? "flex" : "none"}
          >
            <Icon
              w="30px"
              h="30px"
              marginTop="5px"
              as={item?.isPrivate ? VscEyeClosed : VscEye}
              className="b-publicity"
            />
            <Text
              fontSize="0.7rem"
              fontStyle="italic"
              marginBottom="5px"
              display={{ base: "none", md: "block" }}
            >
              {item.isPrivate ? "Not v" : "V"}iewable by other group members
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
