
import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './compoments/Home';
import Login from './pages/until/Login';
import SignUp from './pages/until/SignUp';
import Products from './pages/user/Products';
import Cart from './pages/user/Cart';
import Profile from './pages/user/Profile';
import ProfileEdit from './pages/user/EditProfile';
import ChangePassword from './pages/user/Changepass';
import ProductDetail from './pages/user/ProductDetail';
import History from './pages/user/History';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/ManagementUser';
import Category from './pages/admin/CategoryManagement';
import LoginPage from './pages/admin/LoginAdmin';
import OrderManagement from './pages/admin/OrderManagement';
const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>

       <Route path='/' element={ <Home />}></Route>
       <Route path='/home' element={ <Home />}></Route>
       <Route path='/login' element={ <Login /> }></Route>
       <Route path='/sign-up' element={ <SignUp/>}></Route>  
       <Route path='/products' element={ <Products/>}></Route> 
       <Route path='/cart' element={ <Cart/>}></Route> 
       <Route path='/profile' element={ <Profile/>}></Route> 
       <Route path='/edit-profile' element={ <ProfileEdit/>}></Route> 
       <Route path='/change-pass' element={ <ChangePassword/>}></Route> 
       <Route path="/product/:id" element={<ProductDetail />} />
       <Route path='/admin-product' element={ <ProductManagement/>}></Route> 
       <Route path='/admin-user' element={ <UserManagement/>}></Route> 
       <Route path='/admin-category' element={ <Category/>}></Route> 
       <Route path='/admin-login' element={ <LoginPage/>}></Route> 
       <Route path='/admin-category' element={ <Category/>}></Route> 
       <Route path='/admin-orders' element={ <OrderManagement/>}></Route> 
       
       <Route path="/history" element={<History/>} />
       <Route path='*' element={ <h1>Page not found</h1>}></Route>
      </Routes>
    
    
    </div>
  );
};

export default App;
