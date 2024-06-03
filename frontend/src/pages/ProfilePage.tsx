import React, { useEffect } from "react";
import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import UserProfile from "../components/UserProfile";
import Friends_List from "../components/Friends_List_Component";
import { useNavigate } from "react-router-dom";

interface ProfilePageProps {
  LoggedInUser: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ LoggedInUser }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  });

  return (
    <Box bg="gray.100" color="gray.800" minH="93vh" p={4} overflowY={"auto"}>
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 3fr" }}
        height="100%"
        justifyContent={"space-between"}
      >
        <GridItem p={4} height="auto" width={{ base: "90vw", md: "45vw" }}>
          <UserProfile userId={LoggedInUser} />
        </GridItem>
        <GridItem p={4} width={{ base: "90vw", md: "52vw" }}>
          <Box
            bg="white"
            borderRadius="md"
            boxShadow="md"
            mb={4}
            p={4}
            height="90%"
            display="flex"
            flexDirection="column"
          >
            <Heading size="md" mb={4}>
              Friends List
            </Heading>
            <Box bg="white" flex="1" overflowY="auto">
              <Friends_List LoggedInUser={LoggedInUser} />
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
