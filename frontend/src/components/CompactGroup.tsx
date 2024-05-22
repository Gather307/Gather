import { Box, VStack, Text, Avatar, HStack } from "@chakra-ui/react";
import { Group } from "../pages/MyGroupsPage";
import "../styles/CompactGroup.css";
import ConstrainedText from "./ConstrainedText";

interface Props {
  group: Group;
  width: string;
  height: string;
  corners?: Array<boolean>;
}

const CompactGroupV1 = ({
  group,
  width,
  height,
  corners = [false, false, false, false],
}: Props) => {
  return (
    <Box
      width={width}
      height={height}
      borderRadius={`${corners[0] ? "0%" : "20%"} ${
        corners[1] ? "0%" : "20%"
      } ${corners[2] ? "0%" : "20%"} ${corners[3] ? "0%" : "20%"}`}
      padding="15px 20px 15px"
      className="container"
    >
      <VStack justifyContent="space-between" height="100%">
        <ConstrainedText
          text={group.groupName}
          charLimit={14}
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            textAlign: "center",
          }}
          postfix="..."
        />
        <ConstrainedText
          text={group.description}
          charLimit={150}
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
export { CompactGroupV1 };
