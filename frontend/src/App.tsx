// src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import NavbarSignedOut from './components/NavbarSignedOut';
import NavbarSignedIn from './components/NavbarSignedIn';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [userIsSignedIn, setUserIsSignedIn] = useState(true); // placeholder for authentication logic
  const firstName = "Bob"; // replace with actual user data
  const lastName = "Johnson"; // replace with actual user data
  const userImage = "/path-to-user-image.png"; // replace with actual user data
  const userEmail = "bobjohnson111@gmail.com"; // replace with actual user data
  const userPassword = "*********"; // replace with actual user data

  const handleLogout = () => {
    setUserIsSignedIn(false);
  };

  return (
    <ChakraProvider>
      <Router>
        {userIsSignedIn ? (
          <NavbarSignedIn
            firstName={firstName}
            userImage={userImage}
            onLogout={handleLogout}
          />
        ) : (
          <NavbarSignedOut />
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={
              <ProfilePage
                firstName={firstName}
                lastName={lastName}
                userImage={userImage}
                userEmail={userEmail}
                userPassword={userPassword}
              />
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
