import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import NavbarSignedOut from "./components/NavbarSignedOut";
import NavbarSignedIn from "./components/NavbarSignedIn";
import Friends_List from "./components/Friends_List_Component";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import { IUser } from "./../../backend/models/userSchema";

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
        {token != "" ? (
          <NavbarSignedIn
            stateVariable={{ user, token }}
            updateState={{ setUser, setToken }}
          />
        ) : (
          <NavbarSignedOut />
        )}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* this is a dummy page */}
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
          <Route
            path="/search"
            element={
              <SearchBar
                width="300px"
                onSearch={() =>
                  console.log(
                    "Wow, you really just submitted information. How dare you.",
                  )
                }
                placeholder="DO NOT USE THIS."
              />
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
