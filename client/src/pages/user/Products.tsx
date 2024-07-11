import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/products.css';
import '../../css/main.css';
import '../../css/style.css';
import Header from './Header';
import "../../interfaces/types";
import { product } from '../../interfaces/types';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState<product[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:5000/products');
        setProducts(productsResponse.data);

        const accountsResponse = await axios.get('http://localhost:5000/accounts');
        setAccounts(accountsResponse.data);

        const user = accountsResponse.data.find((account: any) => account.status === 1);
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product: product) => {
    if (currentUser) {
      const existingCartItem = currentUser.cart.find((item: any) => item.idProduct === product.id);

      let updatedCart;
      if (existingCartItem) {
        updatedCart = currentUser.cart.map((item: any) =>
          item.idProduct === product.id ? { ...item, quantityBuy: item.quantityBuy + 1 } : item
        );
      } else {
        updatedCart = [...currentUser.cart, { idProduct: product.id, quantityBuy: 1 }];
      }

      const updatedUser = { ...currentUser, cart: updatedCart };
      const updatedAccounts = accounts.map((account: any) =>
        account.id === currentUser.id ? updatedUser : account
      );

      try {
        await axios.put(`http://localhost:5000/accounts/${currentUser.id}`, updatedUser);
        setAccounts(updatedAccounts);
        setCurrentUser(updatedUser);
        alert("Product added to cart successfully!");
      } catch (error) {
        console.error("Error updating accounts", error);
      }
    } else {
      alert("No user logged in!");
    }
  };

  return (
    <>
      <Header />
      <div className="products">
        <div className="shoe-prd">
          <div className="container">
            <div className="row">
              <div className="prd-filter col-lg-3">
                <div className="prd-filter-container">
                  <div className="prd-filter-title">
                    <p>Danh mục</p>
                  </div>
                  <div className="prd-filter-content">
                    <div className="prd-filter-content-container">
                      <form action="">
                        <div className="prd-filter-choise">
                          <label htmlFor="">Tất cả</label>
                          <input type="radio" name="cate" id="" onClick={() => { }} value="0" className="categoryChoice" />
                        </div>
                        <div className="prd-filter-choise">
                          <label htmlFor="">Giày</label>
                          <input type="radio" name="cate" id="" onClick={() => { }} value="1" className="categoryChoice" />
                        </div>
                        <div className="prd-filter-choise">
                          <label htmlFor="">Dép da</label>
                          <input type="radio" name="cate" id="" onClick={() => { }} value="2" className="categoryChoice" />
                        </div>
                        <div className="prd-filter-choise">
                          <label htmlFor="">Phụ kiện</label>
                          <input type="radio" name="cate" id="" onClick={() => { }} value="3" className="categoryChoice" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="prd-filter-container">
                  <div className="prd-filter-title">
                    <p>Sắp xếp theo</p>
                  </div>
                  <div className="prd-filter-content">
                    <div className="prd-filter-content-container">
                      <form action="">
                        <div className="prd-filter-choise">
                          <label htmlFor="">Mới nhất</label>
                          <input type="radio" name="sort" id="" onClick={() => { }} className="priceChoice" value="0" />
                        </div>
                        <div className="prd-filter-choise">
                          <label htmlFor="">Giá tăng dần</label>
                          <input type="radio" name="sort" id="" onClick={() => { }} className="priceChoice" value="1" />
                        </div>
                        <div className="prd-filter-choise">
                          <label htmlFor="">Giá giảm dần</label>
                          <input type="radio" name="sort" id="" onClick={() => { }} className="priceChoice" value="2" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="all-shoe col-lg-9 col-12">
                <div className="prd-des">
                  <p>
                    Dép da nam Smartmen sử dụng chất liệu da bò cao cấp nên có độ bền đẹp cao. Đặc biệt, chất da này có khả năng chống nước
                    nên có thể sử dụng ngay cả trong mùa mưa.
                  </p>
                  <p>
                    Đế dép da được làm từ cao su cao cấp mang lại cảm giác êm chân và có độ bền cao. Đặc biệt, đế được thiết kế các đường
                    vân giúp tăng khả năng ma sát, chống trơn trượt hay mài mòn trong quá trình sử dụng.
                  </p>
                  <p>
                    Mẫu dép da Smartmen được thiết đa dạng về kiểu dáng và màu sắc nên bạn có thể dễ dàng lựa chọn và sử dụng trong nhiều
                    hoàn cảnh khác nhau.
                  </p>
                </div>
                <div className="prd-container">
                  <div className="row">
                    {products.map((product: product) => (
                      <div key={product.id} className="product-shoes col-4">
                        <div className="product-shoes-content">
                          <Link to={`/product/${product.id}`}>
                            <img className="shoes-img" src={product.img} alt={product.nameProduct} />
                          </Link>
                          <Link to={`/product/${product.id}`} className="shoes-name">{product.nameProduct}</Link>
                          <p className="shoes-price">{product.price.toLocaleString()}đ</p>
                          <button
                            className="btn-add-to-cart"
                            onClick={() => handleAddToCart(product)}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
