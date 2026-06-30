# TripMates 🌍✈️

TripMates is a full-stack web application designed for booking tours and travel experiences. Built with a modern tech stack, it provides a seamless user experience for browsing tours, managing bookings, making payments, and communicating with fellow travelers.

---

## 🌟 Key Features & Pro Enhancements

We have enhanced TripMates with advanced, enterprise-ready features to elevate it from a basic CRUD application to a robust travel experience booking platform:

### 1. User Wishlist / Favorites System 💖
*   **Persistent Favorites**: Registered users can save/remove tours of interest by clicking the interactive heart overlay button.
*   **Reactive Updates**: Leverages React Query cache mutation mapping to instantly sync favorited status across tour list cards, detailed maps, and wishlists without page refreshes.
*   **Dedicated Tab**: A custom "My Wishlist" panel is embedded under the user settings dashboard.

### 2. Admin Panel - Tour Management (CRUD) 🛠️
*   **Structured Form Controls**: A unified Add/Edit Tour form allowing admins to create and modify itineraries, input coordinates, set pricing discounts, select dates, and assign guides.
*   **Multi-Image Uploads**: Integrated Multer and Sharp middleware on both `POST` and `PATCH` routes to support drag-and-drop file uploads for cover photos and thumbnail galleries.
*   **Quick Actions Table**: Paginated, searchable master table for admins to view, edit, or delete tours with prompt confirmation modals.

### 3. Admin Panel - Analytics & User Roles 📊
*   **KPI Scorecards**: Tracks financial statistics in real time (Total Revenue Sales, Bookings Count, User Registrations, and Average Tour Rating).
*   **Custom SVG Charts**: Renders interactive Sales Line area graphs and popular Tour booking horizontal bars. Built with native React SVGs to guarantee light load speeds and avoid library hydration issues.
*   **Role Administration**: Master list of users where admins can promote/demote account clearance levels (`user`, `guide`, `lead-guide`, `admin`) using inline dropdown hooks.
*   **Transaction Logs**: Searchable booking log table allowing admins to manage customer purchases and process cancellations.

### 4. Interactive Geospatial Search Map 🗺️
*   **Visual Radius Querying**: Built an interactive full-screen Leaflet Map. Users can click any coordinate on the globe and slide a radial query boundary circle (from 10 to 2000 units) to find nearby tours.
*   **Map Marker Popups**: Markers display details (name, duration, price, rating) and include click links directly to the detailed tour description views.
*   **Device Location Mapping**: Leverages browser Geolocation to set parameters instantly to the user's coordinates on page load.

### 5. Real-Time group chat room for booked travelers 💬
*   **Coordinated Sockets**: Socket.io configuration setup on the Node/Express backend that joins travelers and assigned guides to tour-specific room streams.
*   **Immersive Chat Box**: Booked travelers see a "Group Chat" button on their bookings dashboard to enter rooms, view joining system notifications, see user profile icons, and chat in real time.

---

## 🚀 Tech Stack

### Frontend (Client)
*   **Framework:** React 19 with Vite
*   **Styling:** Tailwind CSS
*   **State Management & Data Fetching:** React Query (@tanstack/react-query)
*   **Routing:** React Router DOM v7
*   **Maps:** Leaflet & React-Leaflet
*   **Sockets:** Socket.io-client
*   **Icons:** Lucide React & React Icons
*   **Notifications:** React Toastify

### Backend (Server)
*   **Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose
*   **Real-time Communication:** Socket.io
*   **Authentication:** JSON Web Tokens (JWT), bcrypt
*   **Payments:** Razorpay
*   **Email Services:** Nodemailer
*   **File Uploads & Image Processing:** Multer, Sharp
*   **Security:** Helmet, express-mongo-sanitize, xss-clean, express-rate-limit, hpp, cors
*   **Chatbot Integration:** Dialogflow (Webhook)

---

## 📁 Project Structure

```text
TripMates/
├── Client/                 # Frontend React Application
│   ├── src/                # React source code (components, pages, hooks, etc.)
│   │   ├── pages/          # Pages (Wishlist, AdminDashboard, ManageTours, TourForm, ToursMap, ChatRoom)
│   │   └── components/     # UI widgets and layouts
│   ├── public/             # Static assets
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── vite.config.js      # Vite bundler configuration
│   └── package.json        # Frontend dependencies
│
└── Server/                 # Backend Node.js Application
    ├── controllers/        # Route controllers (logic)
    ├── models/             # Mongoose schemas (User, Tour, Review, Booking, Payment)
    ├── routes/             # Express API routes
    ├── utils/              # Sockets setup, error handlers, and utility scripts
    ├── app.js              # Express app configuration & middlewares
    ├── server.js           # Server entry point & DB connection
    └── package.json        # Backend dependencies
```

---

## 🔑 Core API Endpoints

*   **Tours:** `/api/v1/tours` - Fetch, create, update, delete tours.
*   **Geospatial Search:** `/api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit`
*   **Users:** `/api/v1/users` - Authentication, user profile management.
*   **Wishlist:** `/api/v1/users/wishlist` - Manage favorites list.
*   **Reviews:** `/api/v1/reviews` - Tour reviews and ratings.
*   **Bookings:** `/api/v1/bookings` - Managing user bookings.
*   **Payments:** `/api/v1/payments` - Payment processing via Razorpay.
*   **Chatbot:** `/api/v1/webhook` - Dialogflow integration for AI assistance.

---

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd TripMates
   ```

2. **Backend Setup:**
   ```bash
   cd Server
   npm install
   ```
   *Create a `config.env` file in the Server directory with your MongoDB URI, JWT Secret, Razorpay keys, and email credentials.*
   ```bash
   npm run dev # Starts the backend server
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Client
   npm install
   ```
   *Create a `.env` file in the Client directory with your backend API URL and Razorpay key.*
   ```bash
   npm run dev # Starts the React development server
   ```

---

## 🛡️ Security Features
*   **Helmet:** Sets secure HTTP headers.
*   **Rate Limiting:** Prevents brute-force attacks by limiting requests from the same IP.
*   **Sanitization:** Protects against NoSQL query injection and Cross-Site Scripting (XSS).
*   **HPP:** Prevents HTTP parameter pollution.
*   **CORS:** Configured to allow requests only from specific origins (local and Vercel deployments).
