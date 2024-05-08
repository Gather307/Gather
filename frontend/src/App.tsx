import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import CompactItem from "./components/CompactItem";
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
            path="/ItemComp"
            element={
              <Box height="100vh" padding="50%">
                <CompactItem
                  name="TestItem"
                  desc="Brown. My favorite. Other attributes."
                  price={2.25}
                  quant={1}
                  pub={false}
                  assigned={false}
                />
              </Box>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
