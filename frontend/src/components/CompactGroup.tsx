import { Box, VStack, Text, Avatar, HStack } from "@chakra-ui/react";
import { Group } from "../pages/MyGroupsPage";
import "../styles/CompactGroup.css";
import ConstrainedText from "./ConstrainedText";

interface Props {
  group: Group;
  width: string;
  height: string;
}

const CompactGroupV1 = ({ group, width, height }: Props) => {
  console.log("Group!", group);

  return (
    <Box
      width={width}
      height={height}
      borderRadius="25%"
      backgroundColor="gray"
      padding="15px 25px 20px"
      className="container"
    >
      <VStack justifyContent="space-between" height="100%">
        <ConstrainedText
          text={group.groupName}
          charLimit={15}
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
          postfix="..."
        />
        <ConstrainedText
          text={group.description}
          charLimit={20}
          style={{ fontSize: "1rem", flexGrow: "20" }}
          postfix="...(see more)"
        />
        <HStack justifyContent="space-between" spacing="15px">
          <Avatar width="75px" height="75px" />
          <VStack justifyContent="end" spacing="5px">
            <Text textAlign="center" fontSize="0.8rem">
              Created {new Date(group.created).toDateString()}
            </Text>
            {group.members.length > 1 ? (
              <HStack spacing="20px">
                <Avatar size="md" />
                {group.members.length > 2 ? <Avatar size="md" /> : undefined}
                {group.members.length > 3 ? (
                  <Box
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    backgroundColor="darkgray"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    +{group.members ? group.members.length - 3 : ""}
                  </Box>
                ) : undefined}
              </HStack>
            ) : undefined}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

/*
const CompactGroupV2 = ({ name, desc, members, createDate }: Props) => {
  // Added in case we want to just display usernames instead of pfps

  return (
    <Box
      width="400px"
      height="400px"
      borderRadius="100px"
      backgroundColor="gray"
      padding="15px 40px 20px"
    >
      <VStack justifyContent="space-between" height="100%">
        <Text fontSize="2rem">{name}</Text>
        <Text fontSize="1rem" flexGrow="20">
          {desc}
        </Text>
        <VStack justifyContent="space-between" spacing="15px">
          <Text>Created {createDate}</Text>
          <Box textAlign="center">
            Members:
            {members?.map((mem, index) => {
              if (index <= 3 && index < members.length - 1) {
                return <Text display="inline"> {mem},</Text>;
              } else if (index === 4 || index === members.length - 1) {
                return <Text display="inline"> {mem}</Text>;
              }
            })}
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};*/

export { CompactGroupV1 };