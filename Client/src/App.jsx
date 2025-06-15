import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Details from "./pages/Details";
import Settings from "./pages/Settings";
import Booking from "./pages/Booking";
import MyReviews from "./pages/MyReviews";
import Payment from "./pages/Payment";
import PrivateRoute from "./components/PrivateRoute";
import ChatBotWidget from "./components/Ui/ChatBotWidget";
import AddReview from "./components/AddReview";

function App() {
  return (
    <>
      <ToastContainer />
      <ChatBotWidget />

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<AppLayout />} />
          <Route element={<PrivateRoute />}>
            <Route path="/details/:id" element={<Details />} />
            <Route path="review/:id" element={<AddReview />} />
            <Route path="/account" element={<Account />}>
              <Route index element={<Settings />} />
              <Route path="settings" element={<Settings />} />
              <Route path="bookings" element={<Booking />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="billing" element={<MyReviews />} />
            </Route>
            <Route path="/payment/:id" element={<Payment />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
