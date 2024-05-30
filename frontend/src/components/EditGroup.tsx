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
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {} from "@chakra-ui/react";
import { fetchGroupById } from "../../lib/fetches";
import { handleDeleteGroup } from "../../lib/deletes";
import { editGroup } from "../../lib/edits";

//Add Radio for boolean
//Number input for number type

interface Props {
  GroupId: string | undefined;
}

const Editgroup: React.FC<Props> = ({ GroupId }) => {
  // Note: Colors not added yet, just basic structure
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editedPub, setEditedPub] = useState("");
  const [groupData, setgroupData] = useState({
    GroupId: "",
    groupName: "",
    groupDesc: "",
    groupPub: "",
  });

  useEffect(() => {
    const fetchgroupData = async () => {
      try {
        const response = await fetchGroupById(GroupId);
        if (response.ok) {
          const data = await response.json();
          setgroupData({
            GroupId: data.GroupId,
            groupName: data.groupName,
            groupDesc: data.description,
            groupPub: data.privateGroup,
          });
          setEditedName(data.name);
          setEditedDesc(data.description);
          setEditedPub(data.privateGroup);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchgroupData();
  }, [GroupId]);

  const handleSaveChanges = async () => {
    try {
      const updatedgroup = {
        groupName: editedName,
        description: editedDesc,
        privateGroup: editedPub,
      };
      console.log(updatedgroup);
      const response = await editGroup(GroupId, updatedgroup);

      if (response.ok) {
        setgroupData((prev) => ({
          ...prev,
          groupName: updatedgroup.groupName,
          groupDesc: updatedgroup.description,
          groupPub: updatedgroup.privateGroup,
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
        <Button onClick={() => setIsEditing(true)}>Edit Group</Button>
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
          <VStack alignItems="flex-left">
            <VStack alignItems="flex-start">
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
                      onClick={() => handleDeleteGroup(GroupId)}
                    >
                      Delete
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
                      Viewability:
                    </Text>{" "}
                    {groupData.groupPub === "true" ? "Private" : "Public"}
                  </Box>
                  <HStack width="100%"></HStack>
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
