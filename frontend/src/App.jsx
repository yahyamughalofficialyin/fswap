import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import Sidebar from "./Components/sidebar";
import Navbar from "./Components/Navbar";
import Role from "./Pages/role";

const App = () => {
  return (
    <BrowserRouter>
      <div class="container-scroller">
        <Sidebar />

        <div class="container-fluid page-body-wrapper">
          <Navbar />
          <Routes>
            <Route path="/Role" element={<Role />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
