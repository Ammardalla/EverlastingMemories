
  import { BrowserRouter, Routes, Route } from "react-router-dom";

  import Header from "./components/Header";
  import Hero from "./components/Hero";
  import Gallery from "./components/Gallery";
  import About from "./components/About";
  import Contact from "./components/Contact";
  import Footer from "./components/Footer";
  import BookingSuccess from "./components/BookingSuccess";
  import Login from "./components/Login";
  import Signup from "./components/Signup";
  import Shopping from "./components/Shopping";
  import Shop from "./components/Shop";
  import ShopSuccess from "./components/ShopSuccess";
  import AdminDashboard from "./pages/AdminDashboard";

  function HomePage() {
    return (
      <>
        <Header />
        <main>
          <Hero />
          <Gallery />
          <Shopping />
          <About />
          <Contact />
        </main>
        <Footer />
      </>
    );
  }

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop-success" element={<ShopSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
