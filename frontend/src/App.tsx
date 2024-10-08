import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, ChakraProvider, Heading } from "@chakra-ui/react";
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
import HomePage from "./pages/HomePage";

//const vite_backend_url = import.meta.env.VITE_BACKEND_URL as string;
const vite_backend_url = "https://gather-app-307.azurewebsites.net";

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
    getUser();
  }, [token]);

  const [user, setUser] = useState<IUser | null>(null);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box width="100vw" height="100vh" display="flex" flexDirection="column">
          {token ? (
            <NavbarSignedIn
              stateVariable={{ username, token }}
              updateState={{ setUser, setToken }}
            />
          ) : (
            <NavbarSignedOut />
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/moveLetters" element={<MoveLetters />} />
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
                <ProfilePage LoggedInUser={user ? user._id.toString() : ""} />
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
            <Route
              path="/*"
              element={
                <Box>
                  <Heading
                    marginTop="150px"
                    padding="20px"
                    display="flex"
                    justifyContent="space-around"
                    size="2xl"
                    textAlign="center"
                  >
                    404 Not Found
                  </Heading>
                  <Heading
                    marginTop="30px"
                    padding="20px"
                    display="flex"
                    justifyContent="space-around"
                    size="xl"
                    textAlign="center"
                  >
                    Please Navigate Back to the Home Page
                  </Heading>
                </Box>
              }
            />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
