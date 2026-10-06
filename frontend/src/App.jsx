import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./components/pages/MenuPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
