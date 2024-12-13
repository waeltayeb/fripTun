import './App.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Shop from './pages/shop';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Pages/Dahsboard.jsx';
import Article from './pages/article';
import ListArticle from './pages/Admin/Pages/ListArticle.jsx';
import ListOrder from './pages/Admin/Pages/ListOrder.jsx';
import Checkout from './pages/checkout.jsx';
import DashboardClient from './pages/Client/DashboardClient.jsx';
import Profile from './pages/Client/Profile.jsx';
import Conversations from './pages/Admin/Pages/Conversations.jsx';
import Settings from './pages/Admin/Pages/Settings.jsx';
import EditArticle from './pages/Admin/Pages/EditArticle.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './Protected/ProtectedRoute.jsx';
import ProtectedAdmin from './Protected/ProtectedAdmin.jsx';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='*' element={<h1>404</h1>} />
          <Route path='/admin' element={ <ProtectedAdmin> <Dashboard /> </ProtectedAdmin>} /> 
          <Route path='/ListArticle' element={<ProtectedAdmin> <ListArticle /> </ProtectedAdmin>} />
          <Route path='/ListOrder' element={<ListOrder />} />
          <Route path='/article' element={<Article />} />
          <Route path='/Settings' element={<Settings />} />
          <Route path='/ClientDashboard' element={ <ProtectedRoute>  <DashboardClient /> </ProtectedRoute>} />
          <Route path='/ClientProfile' element={ <ProtectedRoute> <Profile /></ProtectedRoute>} />
          <Route path='/Conversations' element={<Conversations />} />
          <Route path='/Edit/:id' element={<EditArticle />} />
          
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
