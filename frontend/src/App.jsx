import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import MenuPage from "./components/pages/MenuPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import PaymentPage from "./components/pages/PaymentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payments" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
