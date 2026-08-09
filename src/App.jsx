import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { Flights } from './pages/Flights'
import { Bus } from './pages/Bus'
import { ShipCruise } from './pages/ShipCruise'
import { BoatCruise } from './pages/BoatCruise'
import { SingleListing } from './pages/SingleListing'
import { Wishlist } from './pages/Wishlist'
import { Bookings } from './pages/Bookings'
import { NotFound } from './pages/NotFound'
import { Dashboard } from './dashboard/Dashboard'
import { Overview } from './dashboard/Overview'
import { ManageListings } from './dashboard/ManageListings'
import { ManageBookings } from './dashboard/ManageBookings'
import { ManageUsers } from './dashboard/ManageUsers'
import { Enquiries } from './dashboard/Enquiries'
import { AddListing } from './dashboard/AddListing'
import { BookingPage } from './pages/BookingPage'
import { EditListing } from './dashboard/EditListing'


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/bus" element={<Bus />} />
        <Route path="/ship-cruise" element={<ShipCruise />} />
        <Route path="/boat-cruise" element={<BoatCruise />} />
        <Route path="/listing/:id" element={<SingleListing />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="add-listing" element={<AddListing />} />
         <Route path="listings/:id" element={<EditListing />} /> 
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App