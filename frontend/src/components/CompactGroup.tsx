import { Box, VStack, Text, Avatar, HStack } from "@chakra-ui/react";
import { IGroup } from "../../../backend/models/groupSchema";
import "../styles/CompactGroup.css";
import ConstrainedText from "./ConstrainedText";
import { useEffect, useState } from "react";
import { fetchMembers } from "../../lib/fetches";

// Define the props for the component
interface Props {
  group: IGroup;
  width: string;
  height: string;
  corners?: boolean[];
}

// CompactGroupV1 component to display a compact view of a group
const CompactGroupV1 = ({
  group,
  width,
  height,
  corners = [false, false, false, false],
}: Props) => {
  // State to store member names
  const [memberNames, setMemberNames] = useState<string[]>([]);

  // Effect to fetch member names
  useEffect(() => {
    fetchMembers(group.members)
      .then((res) => {
        const temp = []; // extract just the usernames from response
        for (let i = 0; i < res.length; i++) {
          temp.push(res[i].username);
        }
        setMemberNames(temp);
      })
      .catch(() => console.log("Error loading member names"));
  }, [group]);

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
          <Avatar
            width="75px"
            height="75px"
            name={memberNames.length > 0 ? memberNames[0] : ""}
          />
          <VStack justifyContent="end" spacing="5px">
            <Text textAlign="center" fontSize="0.8rem">
              Created {new Date(group.created).toDateString()}
            </Text>
            {memberNames?.length > 1 ? (
              <HStack spacing="20px">
                <Avatar size="md" name={memberNames[1]} />
                {group.members.length > 2 ? (
                  <Avatar size="md" name={memberNames[2]} />
                ) : undefined}
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
