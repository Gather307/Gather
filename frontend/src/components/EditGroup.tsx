import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Box,
    HStack,
    Stack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Radio,
    RadioGroup,
    Text,
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  import {} from "@chakra-ui/react";
  
  //Add Radio for boolean
  //Number input for number type
  
  interface Props {
    GroupId: string;
  }
  
  const Editgroup: React.FC<Props> = ({ GroupId }) => {
    // Note: Colors not added yet, just basic structure
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDesc, setEditedDesc] = useState("");
    const [editedQuant, setEditedQuant] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    const [editedPub, setEditedPub] = useState("");
    const [editedSharable, setEditedSharable] = useState("");
    const [groupData, setgroupData] = useState({
      GroupId: "",
      groupName: "",
      groupDesc: "",
      groupQuant: "",
      groupPrice: "",
      groupPub: "",
      groupSharable: "",
    });
  
    useEffect(() => {
      const fetchgroupData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/groups/${GroupId}`);
          if (response.ok) {
            const data = await response.json();
            setgroupData({
              GroupId: data.GroupId,
              groupName: data.name,
              groupDesc: data.notes,
              groupQuant: data.quantity,
              groupPrice: data.price,
              groupPub: data.isPrivate,
              groupSharable: data.toShare,
            });
            setEditedName(data.name);
            setEditedDesc(data.notes);
            setEditedQuant(data.quantity);
            setEditedPrice(data.price);
            setEditedPub(data.isPrivate);
            setEditedSharable(data.toShare);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchgroupData();
    }, [GroupId]);
  
    const format = (val: any) => `$` + val;
    const parse = (val: any) => val.replace(/^\$/, "");
  
    const handleDelete = async () => {
      try {
        const response = await fetch(`http://localhost:3001/groups/${GroupId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log("group deleted successfully");
      } catch (error) {
        console.error("There was an error deleting the group", error);
      }
    };
  
    const handleSaveChanges = async () => {
      try {
        const updatedgroup = {
          name: editedName,
          notes: editedDesc,
          toShare: editedSharable,
          isPrivate: editedPub,
          price: editedPrice,
          quantity: editedQuant,
        };
        console.log(updatedgroup);
        const response = await fetch(`http://localhost:3001/groups/${GroupId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedgroup),
        });
  
        if (response.ok) {
          setgroupData((prev) => ({
            ...prev,
            groupName: updatedgroup.name,
            groupDesc: updatedgroup.notes,
            groupQuant: updatedgroup.quantity,
            groupPrice: updatedgroup.price,
            groupPub: updatedgroup.isPrivate,
            groupSharable: updatedgroup.toShare,
          }));
          setIsEditing(false);
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };
  
    return (
      <Popover>
        <PopoverTrigger>
          <Button onClick={() => setIsEditing(false)}>
            Some clickable group component / more button
          </Button>
        </PopoverTrigger>
  
        <PopoverContent
          bg="var(--col-bright)"
          color="var(--col-dark)"
          border="2px"
          borderColor="var(--col-dark)"
        >
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader
            fontWeight="bold"
            bg="var(--col-brighter)"
            color="var(--col-dark)"
            fontSize="xl"
          >
            {groupData.groupName}
          </PopoverHeader>
          <PopoverBody>
            <VStack alignitems="flex-left">
              <VStack alignitems="flex-start">
                {isEditing ? (
                  <>
                    <FormControl>
                      <FormLabel fontWeight="bold">group Name</FormLabel>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        borderColor="var(--col-dark)"
                        focusBorderColor="var(--col-bright)"
                        _hover={{ bg: "var(--col-tertiary)" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="bold">Description</FormLabel>
                      <Input
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        borderColor="var(--col-dark)"
                        focusBorderColor="var(--col-bright)"
                        _hover={{ bg: "var(--col-tertiary)" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="bold">Quantity</FormLabel>
                      <Input
                        value={editedQuant}
                        onChange={(e) => setEditedQuant(e.target.value)}
                        borderColor="var(--col-dark)"
                        focusBorderColor="var(--col-bright)"
                        _hover={{ bg: "var(--col-tertiary)" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="bold">Price</FormLabel>
                      <NumberInput
                        onChange={(valueString) =>
                          setEditedPrice(parse(valueString))
                        }
                        value={format(editedPrice)}
                        max={100000}
                      >
                        <NumberInputField
                          fontWeight="bold"
                          borderColor="var(--col-dark)"
                          _hover={{ bg: "var(--col-tertiary)" }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="bold">Visible to Others?</FormLabel>
                      <RadioGroup onChange={setEditedPub} value={editedPub}>
                        <Stack direction="row">
                          <Radio
                            value="false"
                            borderColor="var(--col-dark)"
                            _checked={{
                              borderColor: "var(--col-bright)",
                              bg: "var(--col-bright)",
                              color: "var(--col-dark)",
                              _before: {
                                content: '""',
                                display: "inline-block",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                bg: "var(--col-dark)",
                              },
                            }}
                            _hover={{ bg: "var(--col-tertiary)" }}
                          >
                            Public
                          </Radio>
                          <Radio
                            value="true"
                            borderColor="var(--col-dark)"
                            _checked={{
                              borderColor: "var(--col-bright)",
                              bg: "var(--col-bright)",
                              color: "var(--col-dark)",
                              _before: {
                                content: '""',
                                display: "inline-block",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                bg: "var(--col-dark)",
                              },
                            }}
                            _hover={{ bg: "var(--col-tertiary)" }}
                          >
                            Private
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="bold">Is this sharable?</FormLabel>
                      <RadioGroup
                        onChange={setEditedSharable}
                        value={editedSharable}
                      >
                        <Stack direction="row">
                          <Radio
                            value="true"
                            borderColor="var(--col-dark)"
                            _checked={{
                              borderColor: "var(--col-bright)",
                              bg: "var(--col-bright)",
                              color: "var(--col-dark)",
                              _before: {
                                content: '""',
                                display: "inline-block",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                bg: "var(--col-dark)",
                              },
                            }}
                            _hover={{ bg: "var(--col-tertiary)" }}
                          >
                            Yes
                          </Radio>
                          <Radio
                            value="false"
                            borderColor="var(--col-dark)"
                            _checked={{
                              borderColor: "var(--col-bright)",
                              bg: "var(--col-bright)",
                              color: "var(--col-dark)",
                              _before: {
                                content: '""',
                                display: "inline-block",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                bg: "var(--col-dark)",
                              },
                            }}
                            _hover={{ bg: "var(--col-tertiary)" }}
                          >
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                    <HStack width="100%" spacing={4}>
                      <Button
                        bgColor="var(--col-secondary)"
                        color="white"
                        _hover={{
                          bg: "var(--col-tertiary)",
                          color: "var(--col-dark)",
                        }}
                        mt={2}
                        ml="auto"
                        onClick={handleSaveChanges}
                      >
                        Save
                      </Button>
                      <Button
                        colorScheme="red"
                        _hover={{ bg: "#ff8366", color: "var(--col-dark)" }}
                        mt={2}
                        ml="auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                      <Button
                        mt={2}
                        _hover={{
                          bg: "var(--col-tertiary)",
                          color: "var(--col-dark)",
                        }}
                        ml="auto"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <>
                    <Box>
                      <Text as="span" fontWeight="bold">
                        Description:{" "}
                      </Text>
                      {groupData.groupDesc}
                    </Box>
                    <Box>
                      <Text as="span" fontWeight="bold">
                        Quantity:{" "}
                      </Text>
                      {groupData.groupQuant}
                    </Box>
                    <Box>
                      <Text as="span" fontWeight="bold">
                        Price (per group):{" "}
                      </Text>
                      {groupData.groupPrice}
                    </Box>
                    {+groupData.groupQuant > 1 && (
                      <Box>
                        <Text as="span" fontWeight="bold">{`Total price: `}</Text>
                        {+groupData.groupPrice * +groupData.groupQuant}
                      </Box>
                    )}
                    <Box>
                      <Text as="span" fontWeight="bold">
                        Viewability:
                      </Text>{" "}
                      {groupData.groupPub === "true" ? "Private" : "Public"}
                    </Box>
                    <Box>
                      <Text as="span" fontWeight="bold">
                        Sharable:
                      </Text>{" "}
                      {groupData.groupSharable === "true" ? "Yes" : "No"}
                    </Box>
                    <HStack width="100%">
                      <Button
                        bgColor="var(--col-secondary)"
                        color="white"
                        _hover={{
                          bg: "var(--col-tertiary)",
                          color: "var(--col-dark)",
                        }}
                        mt={4}
                        ml="auto"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit group
                      </Button>
                    </HStack>
                  </>
                )}
              </VStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };
  
  export default Editgroup;
  