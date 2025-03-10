import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { PaymentStatus } from "./pages/PaymentStatus.jsx";
import { Signup } from "./pages/signup.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/paymentstatus" element={<PaymentStatus />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;