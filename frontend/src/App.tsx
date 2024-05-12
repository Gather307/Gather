import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import NavbarSignedOut from "./components/NavbarSignedOut";
import NavbarSignedIn from "./components/NavbarSignedIn";
import GroupPage from "./pages/GroupPage";

function App() {
  const userIsSignedIn = false; // was testing but placeholder for our authentication logic

  return (
    <ChakraProvider>
      <Router>
        {userIsSignedIn ? <NavbarSignedIn /> : <NavbarSignedOut />}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* this is a dummy page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/groups" element={<GroupPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
