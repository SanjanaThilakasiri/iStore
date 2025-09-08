import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import Checkout from './Pages/Checkout';
import PaymentSuccess from './Pages/PaymentSuccess';
import GlobalAlert from './Components/GlobalAlert/GlobalAlert';
import UserProfile from './Pages/UserProfile';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>} />
        <Route path='/iphone' element={<ShopCategory  category="iphone"/>} />
        <Route path='/mac' element={<ShopCategory  category="mac"/>} />
        <Route path='/ipad' element={<ShopCategory category="ipad"/>} />
        <Route path='/iwatch' element={<ShopCategory category="iwatch"/>} />
        <Route path='/airpods' element={<ShopCategory  category="airpod"/>} />
        <Route path='/accessories' element={<ShopCategory  category="accessories"/>} />
        <Route path="/product/:productId" element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
      <Footer/>
       <GlobalAlert />
      </BrowserRouter>
    </div>
  );
}

export default App;
