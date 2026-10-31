import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import MenuPage from "./components/pages/MenuPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import PaymentPage from "./components/pages/PaymentPage";
import OrderHistory from "./components/pages/OrderHistory";
import GuestRoute from "./auth/GuestRoute";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/history" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
