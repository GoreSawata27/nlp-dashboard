import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./main.scss";
import { Toaster } from "react-hot-toast";

import NotFound from "./components/Pages/Notfound.js";
import Header from "./components/Pages/Header.js";

import VerifyEmail from "./pages/Verify-email/VerifyEmail.js";
import VerifyOTP from "./pages/Verify-otp/VerifyOTP.js";

import ProtectedRoute from "./utils/ProtectedRoute/ProtectedRoute.js";
import UnAuth from "./components/Pages/UnAuth.js";
import NoAccess from "./components/Pages/NoAccess.js";
import Dashboard from "./pages/Dashboard/main.js";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Toaster />
        <Routes>
          <Route path="/" element={<VerifyEmail />} />
          <Route path="/register" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute sessionKey="isVerified" />}>
            <Route path="/otpvalidation" element={<VerifyOTP />} />

            <Route element={<ProtectedRoute sessionKey="isOtpVerified" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnAuth />} />
          <Route path="/no-access" element={<NoAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
