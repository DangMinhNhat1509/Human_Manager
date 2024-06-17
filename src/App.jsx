import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import User from "./pages/User";
import UserDetail from "./components/User/UserDetailPage";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<User />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;