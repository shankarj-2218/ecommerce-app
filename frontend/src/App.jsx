import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductEdit from "./pages/admin/ProductEdit";
import ProductCreate from "./pages/admin/ProductCreate";
import AdminRoute from "./components/Admin/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation/:id"
                element={<OrderConfirmation />}
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<ProductCreate />} />
                <Route path="products/edit/:id" element={<ProductEdit />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
