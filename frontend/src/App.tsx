import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ItemsPage from "./pages/ItemsPage";
import NavbarSignedOut from "./components/NavbarSignedOut";
import NavbarSignedIn from "./components/NavbarSignedIn";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/MyGroupsPage";
import IndividualGroupPage from "./pages/IndividualGroupPage";
import { IUser } from "../../backend/models/userSchema";
import MoveLetters from "./components/moveLetters";
import theme from "./theme";

const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;
console.log("Backend URL:", vite_backend_url);

// The azure deployed backend url: gather-app-307.azurewebsites.net

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
    if (token !== "" && vite_backend_url) {
      const res = await fetch(`${vite_backend_url}/`, {
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
          `${vite_backend_url}/users/${data.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
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
              path="/signup"
              element={
                <SignupPage
                  stateVariable={{ user, token }}
                  updateState={{ setUser, setToken }}
                />
              }
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
              path="/groups/:groupId"
              element={
                <IndividualGroupPage LoggedInUser={user} setUser={setUser} />
              }
            />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
