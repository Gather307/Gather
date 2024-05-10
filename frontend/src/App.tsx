import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import { CompactGroupV1, CompactGroupV2 } from "./components/CompactGroup";
// import HomePage from './pages/HomePage';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />{" "}
          {/* Hardcoded to test since don't have homepage yet*/}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
