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
          <Route
            path="/GCTest"
            element={
              <>
                <CompactGroupV1
                  name="TestGroup Option1"
                  desc="My Test Group! I love this group so much. All of my friends are in this group, which is why I just love it so very much. I'm so happy that I have this group. It is brown."
                  members={["Member1", "Member2", "Member3", "Member4"]}
                  createDate="november 12"
                />
                <CompactGroupV2
                  name="TestGroup Option2"
                  desc="My Test Group! I love this group so much. All of my friends are in this group, which is why I just love it so very much. I'm so happy that I have this group. It is brown."
                  members={["Member1", "Member2", "Member3", "Member4"]}
                  createDate="november 12"
                />
              </>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
