import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, ChakraProvider, VStack } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import ItemsPage from "./pages/ItemsPage";
import NavbarSignedOut from "./components/NavbarSignedOut";
import NavbarSignedIn from "./components/NavbarSignedIn";
import Friends_List from "./components/Friends_List_Component";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/MyGroupsPage";
import { useState } from "react";
import { IUser } from "./../../backend/models/userSchema";
import BasketComp from "./components/Basket";
import { Basket } from "./components/Basket";

// TODO: When we integrate the frontend to use the backend, we need to use this API server: gather-app-inv.azurewebsites.net
// fetch("gather-app-inv.azurewebsites.net");
const getRandomColor = () => {
  //prob have to change this later but made for demo
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function App() {
  const [user, setUser] = useState<IUser | null>(null); // placeholder for our authentication logic
  const [token, setToken] = useState(""); // placeholder for our authentication logic

  console.log("Token:", token);
  const userId = user?._id ?? "";
  if (!userId) {
    console.log("User ID is not available");
  }

  const avatarColor = getRandomColor();

  const dummyBasket: Basket = {
    basketName: "Zach's first basket",
    description: "This is the description",
    memberIds: ["memid1", "memid2"],
    itemIds: [],
  };

  return (
    <ChakraProvider>
      <Router>
        <Box width="100vw" height="100vh" display="flex" flexDirection="column">
          {token != "" ? (
            <NavbarSignedIn
              stateVariable={{ user, token, avatarColor }}
              updateState={{ setUser, setToken }}
            />
          ) : (
            <NavbarSignedOut />
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route
              path="/login"
              element={<LoginPage updateState={{ setUser, setToken }} />}
            />
            <Route
              path="/FriendsList"
              element={<Friends_List LoggedInUser={user ? user._id : ""} />}
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  LoggedInUser={user ? user._id.toString() : ""}
                  avatarColor={avatarColor}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <SignupPage
                  stateVariable={{ user, token }}
                  updateState={{ setUser, setToken }}
                />
              }
            />
            <Route
              path="/basket"
              element={
                <Box
                  width="100%"
                  height="100%"
                  bgColor="gray"
                  p="20px"
                  overflow="auto"
                >
                  <VStack>
                    <BasketComp
                      basketId={"663eb1db466bf9f40e994da4"}
                      isOwnerView
                      stateObj={{ user, token }}
                    />
                    <BasketComp
                      basketId={"663eb1db466bf9f40e994da4"}
                      isOwnerView
                      stateObj={{ user, token }}
                    />
                    <BasketComp
                      basketId={"663eb1db466bf9f40e994da4"}
                      isOwnerView
                      stateObj={{ user, token }}
                    />
                    <BasketComp
                      basketId={"663eb1db466bf9f40e994da4"}
                      isOwnerView
                      stateObj={{ user, token }}
                    />
                  </VStack>
                </Box>
              }
            />
            <Route path="/groups" element={<GroupPage />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
