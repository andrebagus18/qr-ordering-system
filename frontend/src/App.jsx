import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import MenuPage from "./components/pages/MenuPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
