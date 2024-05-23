import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import ItemsPage from "./pages/ItemsPage";
import NavbarSignedOut from "./components/NavbarSignedOut";
import NavbarSignedIn from "./components/NavbarSignedIn";
import Friends_List from "./components/Friends_List_Component";
import GroupPage from "./pages/MyGroupsPage";
import { useState } from "react";
import { IUser } from "./../../backend/models/userSchema";
import EditItem from "./components/EditItem";

// TODO: When we integrate the frontend to use the backend, we need to use this API server: gather-app-inv.azurewebsites.net
// fetch("gather-app-inv.azurewebsites.net");

function App() {
  const [user, setUser] = useState<IUser | null>(null); // placeholder for our authentication logic
  const [token, setToken] = useState(""); // placeholder for our authentication logic

  console.log("Token:", token);
  const userId = user?._id ?? "";
  if (!userId) {
    console.log("User ID is not available");
  }
  return (
    <ChakraProvider>
      <Router>
        <Box width="100vw" height="100vh" display="flex" flexDirection="column">
          {token != "" ? (
            <NavbarSignedIn
              stateVariable={{ user, token }}
              updateState={{ setUser, setToken }}
            />
          ) : (
            <NavbarSignedOut />
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* this is a dummy page */}
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
              path="/signup"
              element={
                <SignupPage
                  stateVariable={{ user, token }}
                  updateState={{ setUser, setToken }}
                />
              }
            />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="/EditItem" element={
              <EditItem
              name = {"Toothbrush"}
              desc = {"Best one"}
              quant = {4}
              price = {3.99}
              pub = {true}
              assigned = {true}

             />} 
             
             />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
