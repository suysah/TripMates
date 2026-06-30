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
import Billing from "./pages/Billing";
import Wishlist from "./pages/Wishlist";
import ManageTours from "./pages/ManageTours";
import TourForm from "./pages/TourForm";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageBookings from "./pages/ManageBookings";
import ToursMap from "./pages/ToursMap";
import ChatRoom from "./pages/ChatRoom";

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
          <Route path="/tours-map" element={<ToursMap />} />
          <Route element={<PrivateRoute />}>
            <Route path="/details/:id" element={<Details />} />
            <Route path="review/:id" element={<AddReview />} />
            <Route path="/account" element={<Account />}>
              <Route index element={<Settings />} />
              <Route path="settings" element={<Settings />} />
              <Route path="bookings" element={<Booking />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="billing" element={<Billing />} />
              <Route path="manage-tours" element={<ManageTours />} />
              <Route path="manage-tours/new" element={<TourForm />} />
              <Route path="manage-tours/edit/:id" element={<TourForm />} />
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-bookings" element={<ManageBookings />} />
              <Route path="chat/:tourId" element={<ChatRoom />} />
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
