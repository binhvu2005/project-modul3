import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '../../store/store';
import "../../css/main.css";
import "../../css/style.css";

const Header: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const [userStatus, setUserStatus] = useState<number | null>(null);
  const [userImg, setUserImg] = useState<string | undefined>();
  const [name, setName] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  // Fetch user status and products from API
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/accounts');
        const users = response.data;
        const user = users.find((u: { status: number }) => u.status === 1);
        if (user) {
          setUserStatus(user.status);
          setUserImg(user.img);
          setName(user.nameAccount);
        } else {
          setUserStatus(0);
        }
      } catch (error) {
        console.error('There was an error fetching the user status!', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
      }
    };

    fetchUserStatus();
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filteredResults = products.filter(product =>
        product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="header">
          <div className="container">
            <div className="header-content">
              <a id="show-menu">
                <i className="fas fa-bars"></i>
              </a>
              <div className="logo-header col-8 col-lg-2">
                <Link to="/" className="logo">Men</Link>
              </div>
              <div className="header-search col-lg-5">
                <div className="header-search-wrap">
                  <input
                    type="text"
                    className="header-search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                
                  {searchTerm && searchResults.length > 0 && (
                    <ul id="search-results">
                      {searchResults.map(product => (
                        <li key={product.id}>
                          <img src={product.img} alt={product.nameProduct} />
                          <Link to={`/product/${product.id}`}>
                            {product.nameProduct}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="header-contact col-lg-3">
                <div className="header-contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="header-contact-number">
                  <h4>Hotline</h4>
                  <p>0963.646.444 - 0968.592.4444</p>
                </div>
              </div>
              <div className="cart col-1 col-lg-2">
                <i className="fas fa-shopping-cart">
                  <span id="cart-product">{items}</span>
                </i>
                <div className="cart-info">
                  <Link to="/cart">
                    <h3>Giỏ hàng</h3>
                  </Link>
                  <p id="cart-Product">{items} sản phẩm</p>
                </div>
              </div>
              {userStatus === 1 ? (
                <div className="login" id="logout">
                  <Link to="/profile">
                    <img src={userImg} alt="User Status Image" />
                  </Link>
                  <p>Hi, {name}</p>
                  <button onClick={handleLogout} className="material-symbols-outlined">
                    logout
                  </button>
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
        <br /><br /><br /><br />
        <div className="container-fluid bg-black">
          <div className="container" style={{ width: "1600px", marginLeft: "100px" }}>
            <div className="navigation">
              <ul className="nav-menu" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <li className="nav-item">
                  <Link to="/" className="nav-item-link">
                    <i className="fas fa-home"></i>Trang chủ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/products" className="nav-item-link">Sản phẩm</Link>
                </li>
                <li className="nav-item nav-has-child">
                  <Link to="/shoes" className="nav-item-link">Giày</Link>
                </li>
                <li className="nav-item">
                  <Link to="/sandals" className="nav-item-link">Dép da</Link>
                </li>
                <li className="nav-item nav-has-child">
                  <Link to="/accessories" className="nav-item-link">Phụ kiện</Link>
                </li>
                <li className="nav-item">
                  <Link to="/search" className="nav-item-link">Tra cứu</Link>
                </li>
                <li className="nav-item nav-has-child">
                  <Link to="/news" className="nav-item-link">Tin tức</Link>
                  <span className="nav-arrow"></span>
                  <ul className="nav-sub-menu" style={{ width: '250px' }}>
                    <li className="sub-nav-item">
                      <Link to="/about" className="sub-nav-item-link">Về shop</Link>
                    </li>
                    <li className="sub-nav-item">
                      <Link to="/shoe-addiction" className="sub-nav-item-link">Nghiện giày</Link>
                    </li>
                    <li className="sub-nav-item">
                      <Link to="/smart-men" className="nav-item-link">Đàn ông thông minh</Link>
                    </li>
                  </ul>
                </li>
                <div className="login" id="logout">
                  {userStatus === 1 ? (
                    <div />
                  ) : (
                    <div className='header-right'>
                      <Link to="/login">
                        <button id="btn-dang-nhap" className="nav-item-link">
                          Đăng Nhập
                        </button>
                      </Link>
                      <Link to="/sign-up">
                        <button id="btn-dang-nhap" className="nav-item-link">
                          Đăng kí
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
