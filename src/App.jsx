import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CategoriesPage from "./pages/CategoriesPage";
import SigleBlogPage from "./pages/SigleBlogPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:slug" element={<SigleBlogPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
