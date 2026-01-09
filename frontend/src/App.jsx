// frontend/src/App.jsx
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import AppRouter from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export default function App() {
  // Optional: Initialize analytics or other global setups
  useEffect(() => {
    console.log("Blogify app initialized");
  }, []);

  return (
    <>
      <Layout>
        <AppRouter />
      </Layout>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
