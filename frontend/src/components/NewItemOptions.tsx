import {
  IconButton,
  Flex,
  Box,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
  FormControl,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import "../styles/JoinGroup.css";
import { AddIcon } from "@chakra-ui/icons";
import { fetchBasket } from "../../lib/fetches";
import { createNewItem } from "../../lib/posts";
import { addItemToBasket } from "../../lib/edits";
import { ObjectId } from "mongoose";
import { IBasket } from "../../../backend/models/basketSchema";

const NewItemOptions = ({
  basket,
  updateBasket,
  display = "flex",
}: {
  basket: string;
  updateBasket: any;
  display?: string;
}) => {
  const createItem = async (
    name: string,
    toShare: boolean,
    isPrivate: boolean,
    type: string,
    notes: string,
    price: number,
    quantity: number,
  ) => {
    const res = await fetchBasket(basket);

    if (res.ok) {
      const currentBasket = (await res.json()) as IBasket;
      const payload = {
        name,
        toShare,
        isPrivate,
        type,
        notes,
        price,
        quantity,
        basket: [currentBasket._id],
      };

      const promise = await createNewItem(payload);

      if (promise.status === 201) {
        const data = await promise.json();
        const newData = [...currentBasket.items, data._id] as ObjectId[];
        const basketPromise = await addItemToBasket(currentBasket._id, newData);

        if (basketPromise.status === 200) {
          const basketData = await basketPromise.json();
          updateBasket(basketData);
        }
      }
    }
    window.location.reload();
  };

  return (
    <Flex display={display} alignItems="center">
      <Heading as="h3" fontWeight="normal" size="sm" marginRight="10px">
        Add Item
      </Heading>
      <CreateItem postItem={createItem} />
    </Flex>
  );
};

interface CreateProps {
  postItem: (
    name: string,
    toShare: boolean,
    isPrivate: boolean,
    type: string,
    notes: string,
    price: number,
    quantity: number,
  ) => void;
}

const CreateItem = ({ postItem }: CreateProps) => {
  const [item, setItem] = useState({
    name: "",
    toShare: true,
    isPrivate: false,
    type: "",
    notes: "",
    price: 0,
    quantity: 0,
  });
  const [errored, setError] = useState({ state: false, msg: "" });
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.currentTarget;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log(item);
    postItem(
      item.name,
      (item.toShare = true),
      item.isPrivate,
      (item.type = "No type"),
      item.notes === "" ? "No description given" : item.notes,
      item.price,
      item.quantity,
    );
    setItem({
      name: "",
      toShare: true,
      isPrivate: false,
      type: "No type given",
      notes: "",
      price: 0,
      quantity: 0,
    });
  };

  const handleNumberInputChangePrice = (valueAsString: string) => {
    // Convert string to float because the input will provide a formatted string with a dollar sign
    const valueAsNumber = parseFloat(valueAsString.replace(/^\$/, ""));
    setItem((prevItem) => ({ ...prevItem, price: valueAsNumber }));
  };

  const handleNumberInputChangeQuantity = (
    valueAsString: string,
    valueAsNumber: number,
  ) => {
    console.log(valueAsString);
    setItem((prevItem) => ({ ...prevItem, quantity: valueAsNumber }));
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          setError({ state: false, msg: "" });
          onClose();
        }}
        placement="auto"
        autoFocus
        closeOnBlur
      >
        <PopoverTrigger>
          <IconButton
            marginRight="10px"
            display={"flex"}
            justifyContent="center"
            alignSelf={"center"}
            aria-label="Add Item"
            icon={<AddIcon />}
            colorScheme="teal"
          />
        </PopoverTrigger>
        <PopoverContent
          bgColor="var(--col-bright)"
          borderWidth="5px"
          borderColor="var(--col-secondary)"
          p="20px"
          borderRadius="10px"
        >
          <PopoverHeader
            display="flex"
            justifyContent="center"
            fontSize="1.4rem"
            color="var(--col-secondary)"
            borderBottomColor="var(--col-dark)"
            padding="0px"
            paddingBottom="5px"
            marginBottom="10px"
          >
            Create new Item
          </PopoverHeader>
          <form>
            <label htmlFor="name" className="i-b">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={item.name}
              className="i-b text-container"
              onChange={handleChange}
            />
            <label htmlFor="desc" className="i-b">
              Description
            </label>
            <input
              type="text"
              name="notes"
              id="notes"
              value={item.notes}
              onChange={handleChange}
              className="i-b text-container multiline"
            />
            <PopoverFooter
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex width="100%" justifyContent="space-between" mb="10px">
                <FormControl width="45%">
                  <label htmlFor="desc" className="i-b">
                    Price
                  </label>
                  <NumberInput
                    onChange={(valueAsString) =>
                      handleNumberInputChangePrice(valueAsString)
                    }
                    value={item.price || ""}
                    precision={2} // Allows two decimal places
                    step={1.0} // Step size for increment and decrement steppers
                    max={100000}
                    min={0}
                    clampValueOnBlur={false} // Prevents automatic rounding on blur
                    format={(val) => `$${val}`} // Prefixing the dollar sign
                  >
                    <NumberInputField
                      id="price"
                      borderColor="var(--col-dark)"
                      _hover={{ bg: "var(--col-tertiary)" }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl width="45%">
                  <label htmlFor="desc" className="i-b">
                    Quantity
                  </label>
                  <NumberInput
                    onChange={handleNumberInputChangeQuantity}
                    value={item.quantity || ""}
                    max={100000}
                    min={0}
                  >
                    <NumberInputField
                      borderColor="var(--col-dark)"
                      _hover={{ bg: "var(--col-tertiary)" }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Flex>
              <Box
                display="flex"
                width="100%"
                justifyContent="space-between"
                mb="10px"
              >
                <Box>
                  <input
                    type="checkbox"
                    name="isPrivate"
                    id="isPrivate"
                    checked={item.isPrivate === true}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <label htmlFor="isPrivate" className="sidenote">
                    Private
                  </label>
                </Box>
              </Box>
              <Box
                display={`${errored.state ? "inherit" : "none"}`}
                color="red"
                fontSize="0.6rem"
                wordBreak="break-word"
                width="100%"
                mb="10px"
              >
                Error: {errored.msg}
              </Box>
              <input
                type="button"
                value="Add Item"
                onClick={handleSubmit}
                className="submit-button"
              />
            </PopoverFooter>
          </form>
          <PopoverCloseButton color="var(--col-dark)" />
        </PopoverContent>
      </Popover>
    </>
  );
};
export default NewItemOptions;
