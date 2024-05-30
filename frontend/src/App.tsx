import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ItemsPage from "./pages/ItemsPage";
import NavbarSignedOut from "./components/NavbarSignedOut";
import NavbarSignedIn from "./components/NavbarSignedIn";
import Friends_List from "./components/Friends_List_Component";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/MyGroupsPage";
import IndividualGroupPage from "./pages/IndividualGroupPage";
import EditItem from "./components/EditItem";
import EditGroup from "./components/EditGroup";
import EditBasket from "./components/EditBasket";
import { IUser } from "../../backend/models/userSchema";
import MoveLetters from "./components/moveLetters";
import theme from "./theme";

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
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
  const [username, setUsername] = useState("");
  const getUser = async () => {
    if (token !== "") {
      const res = await fetch("http://localhost:3001/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        const data = (await res.json()) as { username: string };
        console.log(data);
        setUsername(data.username);
        const userres = await fetch(
          `http://localhost:3001/users/${data.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (userres.status === 200) {
          const user = await userres.json();
          console.log(user);
          setUser(user);
        }
      }
    }
  };

  useEffect(() => {
    getUser().then(() => {
      setLoggedIn(!loggedIn);
    });
  }, [token]);

  const [user, setUser] = useState<IUser | null>(null);
  const avatarColor = getRandomColor();
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box width="100vw" height="100vh" display="flex" flexDirection="column">
          {loggedIn && username != "" ? (
            <NavbarSignedIn
              stateVariable={{ username, token, avatarColor }}
              updateState={{ setUser, setToken }}
            />
          ) : (
            <NavbarSignedOut />
          )}
          <Routes>
            <Route path="/" element={<MoveLetters />} />
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
              path="/groups/:groupId"
              element={<IndividualGroupPage LoggedInUser={user} />}
            />
            {/* added route for individual group page */}
            <Route
              path="/items"
              element={<ItemsPage stateVariable={{ user, token }} />}
            />
            <Route
              path="/groups"
              element={
                <GroupPage
                  stateVariable={{ user, token }}
                  updateState={{ setUser }}
                />
              }
            />
            <Route
              path="/EditItem"
              element={<EditItem itemId={"6650c4318d467368f1558344"} />}
            />
            <Route
              path="/EditGroup"
              element={<EditGroup GroupId={"663e9cbc1bdb0bb660da0e8b"} />}
            />
            <Route
              path="/EditBasket"
              element={<EditBasket basketId={"663eb1db466bf9f40e994da4"} />}
            />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
