import NavBar from "./components/NavBar";

import { Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { useThemeStore } from "./store/UseThemeStore";


// after this project try to understand how things work like the technolgies used in this project and how to use them in your own projects. Also try to understand the code and how it works. This will help you in your future projects and also in your job interviews.
// you here about node try to know what is node and how it works. Also try to understand the difference between node and express. This will help you in your future projects and also in your job interviews.

function App() {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme} >
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Toaster />
    </div >
  )
}

export default App
