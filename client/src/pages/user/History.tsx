import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import "../../css/history.css"


interface Product {
  id: number;
  nameProduct: string;
  price: number;
  img: string;
  quantity: number;
  category: string;
}

interface CartItem {
  idProduct: number;
  quantityBuy: number;
}

interface Order {
  idUser: number;
  productBuy: CartItem[];
  statusOder: string;
}

interface Account {
  id: number;
  status: number;
  cart: CartItem[];
  historyBuy: Order[];
}

const History: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccountsAndProducts = async () => {
      try {
        const accountsResponse = await axios.get('http://localhost:5000/accounts');
        const productsResponse = await axios.get('http://localhost:5000/products');
        setAccounts(accountsResponse.data);
        setProducts(productsResponse.data);

        const user = accountsResponse.data.find((account: Account) => account.status === 1);
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAccountsAndProducts();
  }, []);

  const findProduct = (id: number) => {
    return products.find(product => product.id === id);
  };

  return (
   <>
   <Header/>
   <div className="content-container">
      <div className="private-list">
        <a href="./profile"><div className="person choose-private">Thông tin cá nhân</div></a>
        <a href="./history"> <div className="history-info choose-private">Lịch sử mua hàng</div></a>
      </div>
      <div className="private-info" id="profileContent">
        <table className="historyList" >
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody id="historyList">
            {currentUser && currentUser.historyBuy.map(order => (
              order.productBuy.map(item => {
                const product = findProduct(item.idProduct);
                return (
                  product && (
                    <tr key={item.idProduct}>
                      <td>{product.nameProduct}</td>
                      <td>{item.quantityBuy}</td>
                      <td>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td>{(product.price * item.quantityBuy).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td className='status1'>{order.statusOder} <br />
                      </td>
                    </tr>
                  )
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    </div>
   <Footer/>
   </>
  );
};

export default History;
