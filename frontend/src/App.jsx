// frontend/src/App.jsx
import Layout from "./components/layout/Layout";
import AppRouter from "./router";
import "./App.css";

export default function App() {
  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
}
