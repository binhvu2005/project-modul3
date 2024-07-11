import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/cart.css';
import { Link } from 'react-router-dom';
import { Account, CartItem, Product } from '../../interfaces/types';

const Cart: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartList, setCartList] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingFee] = useState<number>(30000);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccountsAndProducts = async () => {
      try {
        const accountsResponse = await axios.get('http://localhost:5000/accounts');
        const productsResponse = await axios.get('http://localhost:5000/products');
        setAccounts(accountsResponse.data);
        setProducts(productsResponse.data);

        // Tìm và đặt người dùng hiện tại
        const user = accountsResponse.data.find((account: Account) => account.status === 1);
        if (user) {
          setCurrentUser(user);
          setCartList(user.cart);
          updateCartTotal(user.cart, productsResponse.data);
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

  const updateCartTotal = (cart: CartItem[], products: Product[]) => {
    let subtotal = 0;
    for (const item of cart) {
      const product = findProduct(item.idProduct);
      if (product) {
        subtotal += product.price * item.quantityBuy;
      }
    }
    setSubtotal(subtotal);
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) {
      Swal.fire('Số lượng mua tối thiểu là 1');
      return;
    }

    const updatedCart = cartList.map(item => {
      if (item.idProduct === productId) {
        return { ...item, quantityBuy: quantity };
      }
      return item;
    });

    setCartList(updatedCart);
    updateCartTotal(updatedCart, products);
    if (currentUser) {
      const updatedUser = { ...currentUser, cart: updatedCart };
      updateAccount(updatedUser);
    }
  };

  const handleRemoveItem = (productId: number) => {
    Swal.fire({
      title: 'Bạn chắc chứ?',
      text: 'Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
    }).then(result => {
      if (result.isConfirmed) {
        const updatedCart = cartList.filter(item => item.idProduct !== productId);
        setCartList(updatedCart);
        updateCartTotal(updatedCart, products);
        if (currentUser) {
          const updatedUser = { ...currentUser, cart: updatedCart };
          updateAccount(updatedUser);
        }
        Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa thành công', 'success');
      }
    });
  };

  const updateAccount = async (updatedUser: Account) => {
    try {
      await axios.put(`http://localhost:5000/accounts/${updatedUser.id}`, updatedUser);
      const updatedAccounts = accounts.map(account =>
        account.id === updatedUser.id ? updatedUser : account
      );
      setAccounts(updatedAccounts);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error updating accounts:', error);
    }
  };

  const handleCheckout = async () => {
    const cname = (document.getElementById('cname') as HTMLInputElement).value.trim();
    const cnum = (document.getElementById('cnum') as HTMLInputElement).value.trim();
    const exp = (document.getElementById('exp') as HTMLInputElement).value.trim();
    const cvv = (document.getElementById('cvv') as HTMLInputElement).value.trim();

    if (!cname || !cnum || !exp || !cvv) {
      Swal.fire('Vui lòng điền đầy đủ thông tin thanh toán');
      return;
    }

    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    if (!cardNumberRegex.test(cnum) || !cvvRegex.test(cvv)) {
      Swal.fire('Số thẻ hoặc CVV không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    if (currentUser) {
      const newOrder = {
        idUser: currentUser.id,
        productBuy: cartList,
        statusOder: 'Thanh toán thành công',
      };

      const updatedUser = { ...currentUser, historyBuy: [...currentUser.historyBuy, newOrder], cart: [] };

      try {
        await axios.put(`http://localhost:5000/accounts/${currentUser.id}`, updatedUser);
        const updatedAccounts = accounts.map(account =>
          account.id === currentUser.id ? updatedUser : account
        );
        setAccounts(updatedAccounts);
        setCurrentUser(updatedUser);
        setCartList([]);
        updateCartTotal([], products);
        Swal.fire('Thanh toán thành công!');
      } catch (error) {
        console.error('Error updating account:', error);
      }
    }
  };

  return (
    <div className="container px-4 py-5 mx-auto">
      <Link to="/products">Tiếp tục mua sắm</Link>
      <div className="row d-flex justify-content-center">
        <div className="col-5">
          <h4 className="heading">Giỏ hàng</h4>
        </div>
        <div className="col-7">
          <div className="row text-right">
            <div className="col-4">
              <h6 className="mt-2">Danh mục</h6>
            </div>
            <div className="col-4">
              <h6 className="mt-2">Số lượng</h6>
            </div>
            <div className="col-4">
              <h6 className="mt-2">Giá</h6>
            </div>
          </div>
        </div>
      </div>

      <div id="cartContent">
        {cartList.length > 0 ? (
          cartList.map(item => {
            const product = findProduct(item.idProduct);
            return (
              product && (
                <div key={product.id} className="row d-flex justify-content-center border-top">
                  <div className="col-5">
                    <div className="row d-flex">
                      <span
                        className="material-symbols-outlined delete"
                        data-id={product.id}
                        onClick={() => handleRemoveItem(product.id)}
                      >
                        delete
                      </span>
                      <div className="book">
                        <img src={product.img} className="book-img" alt={product.nameProduct} />
                      </div>
                      <div className="my-auto flex-column d-flex pad-left">
                        <h6 className="mob-text">{product.nameProduct}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="my-auto col-7">
                    <div className="row text-right">
                      <div className="col-4">
                        <p className="mob-text">{product.category}</p>
                      </div>
                      <div className="col-4">
                        <div className="row d-flex justify-content-end px-3">
                          <button
                            className="btn btn-sm btn-primary minus"
                            data-id={product.id}
                            onClick={() => handleQuantityChange(product.id, item.quantityBuy - 1)}
                          >
                            -
                          </button>
                          <p className="mb-0 ml-2 mr-2 quantity">{item.quantityBuy}</p>
                          <button
                            className="btn btn-sm btn-primary plus"
                            data-id={product.id}
                            onClick={() => handleQuantityChange(product.id, item.quantityBuy + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-4">
                        <h6 className="mob-text">
                          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              )
            );
          })
        ) : (
          <p>Giỏ hàng trống!</p>
        )}
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card">
            <div className="row">
              <div className="col-lg-3 radio-group">
                <div className="row d-flex px-3 radio gray">
                  <img className="pay" src="https://th.bing.com/th/id/OIP.E6olZ2NeGRb1qmT0uLTp5AHaHa?rs=1&pid=ImgDetMain" alt="Credit Card" />
                  <p className="my-auto">Credit Card</p>
                </div>
                <div className="row d-flex px-3 radio gray">
                  <img className="pay" src="https://www.freefx.com/img/Funding%20Icons/VisaMastercard.png" alt="Debit Card" />
                  <p className="my-auto">Debit Card</p>
                </div>
                <div className="row d-flex px-3 radio gray mb-3">
                  <img className="pay" src="https://br.atsit.in/vi/wp-content/uploads/2022/01/paypal-co-the-dang-phat-trien-stablecoin.jpg" alt="PayPal" />
                  <p className="my-auto">PayPal</p>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="row px-2">
                  <div className="form-group col-12">
                    <label className="form-control-label">Tên trên thẻ</label>
                    <input type="text" id="cname" name="cname" placeholder="Johnny Doe" required className="form-control" />
                  </div>
                  <div className="form-group col-12">
                    <label className="form-control-label">Số thẻ</label>
                    <input type="text" id="cnum" name="cnum" placeholder="1111 2222 3333 4444" required className="form-control" />
                  </div>
                </div>
                <div className="row px-2">
                  <div className="form-group col-md-6">
                    <label className="form-control-label">Ngày hết hạn</label>
                    <input type="date" id="exp" name="exp" placeholder="MM/YYYY" required className="form-control" />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="form-control-label">CVV</label>
                    <input type="password" id="cvv" name="cvv" placeholder="***" required className="form-control" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mt-2">
                <div className="row d-flex justify-content-between px-4">
                  <p className="mb-1 text-left">Tạm tính</p>
                  <h6 className="mb-1 text-right">{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h6>
                </div>
                <div className="row d-flex justify-content-between px-4">
                  <p className="mb-1 text-left">Phí vận chuyển</p>
                  <h6 className="mb-1 text-right">{shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h6>
                </div>
                <div className="row d-flex justify-content-between px-4" id="tax">
                  <p className="mb-1 text-left">Tổng cộng (đã bao gồm thuế)</p>
                  <h6 className="mb-1 text-right">{(subtotal + shippingFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h6>
                </div>
                <button className="btn-block btn-blue" onClick={handleCheckout}>
                  <span>
                    <span id="checkout">Thanh toán</span>
                    <span id="check-amt">{(subtotal + shippingFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
