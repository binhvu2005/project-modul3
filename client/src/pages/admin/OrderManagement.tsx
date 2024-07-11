// OrderManagement.tsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import axios from 'axios';

import '../../css/modal.css'; // CSS cho modal
import '../../css/sidebar.css'; // CSS cho sidebar
import './css/style.css'; // CSS chung

interface ProductBuy {
  idProduct: string;
  quantityBuy: number;
}

interface HistoryBuy {
  idUser: string;
  productBuy: ProductBuy[];
  statusOder: string;
}

interface User {
  id: string;
  nameAccount: string;
  img: string;
  email: string;
  phone: string;
  address: string;
  status: number;
  historyBuy: HistoryBuy[];
  lock: 'locked' | 'open';
}

const OrderManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<HistoryBuy | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    new DataTable('#orderTable');
  }, [userList]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/accounts');
      setUserList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showSidebar = () => setIsSidebarOpen(true);
  const hideSidebar = () => setIsSidebarOpen(false);

  const openModal = (order: HistoryBuy) => {
    setSelectedOrder(order);
    const modal = document.getElementById('orderModal');
    if (modal) modal.style.display = 'block';
  };

  const closeModal = () => {
    const modal = document.getElementById('orderModal');
    if (modal) modal.style.display = 'none';
    setSelectedOrder(null);
  };

  const handleConfirmOrder = async (userId: string, orderIndex: number) => {
    const result = await Swal.fire({
      title: "Xác nhận đơn hàng",
      text: "Bạn có chắc chắn muốn chuyển trạng thái đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    });

    if (result.isConfirmed) {
      try {
        // Cập nhật trạng thái đơn hàng trong frontend
        const updatedUserList = userList.map(user => {
          if (user.id === userId) {
            const updatedHistoryBuy = user.historyBuy.map((order, index) =>
              index === orderIndex ? { ...order, statusOder: 'Đang giao hàng' } : order
            );
            return { ...user, historyBuy: updatedHistoryBuy };
          }
          return user;
        });
        setUserList(updatedUserList);

        // Cập nhật trạng thái đơn hàng trên server
        await axios.post(`http://localhost:5000/accounts/${userId}/orders/${orderIndex}/confirm`, {
          statusOder: 'Đang giao hàng'
        });

        Swal.fire('Đã xác nhận đơn hàng', '', 'success');
      } catch (error) {
        console.error('Error confirming order:', error);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xác nhận đơn hàng.', 'error');
      }
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div
            className={`col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark ${isSidebarOpen ? '' : 'd-none'}`}
            id="sidebar"
          >
            <a href="http://localhost:5173/admin-user">Quản lí Người Dùng</a>
            <br />
            <a href="http://localhost:5173/admin-product">Quản lí Sản Phẩm</a><br />
            <a href="/admin-category">Danh mục</a><br />
            <a href="/admin-orders">Đơn hàng</a>
          </div>
          <nav className="header-nav-item"></nav>
          <div className="col py-3">
            <h1>Quản lí đơn hàng</h1>
            <button
              id="bars"
              style={{ display: isSidebarOpen ? 'none' : 'block' }}
              onClick={showSidebar}
            >
              <i className="fa-solid fa-bars" />
            </button>
            <button
              id="hideSidebar"
              style={{ display: isSidebarOpen ? 'block' : 'none' }}
              onClick={hideSidebar}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <table
              id="orderTable"
              className="table table-striped table-hover table-dark"
              style={{ width: '100%' }}
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên người dùng</th>
                  <th>Trạng thái</th>
                  <th>Sản phẩm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {userList.flatMap(user =>
                  user.historyBuy.map((order, index) => (
                    <tr key={`${user.id}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{user.nameAccount}</td>
                      <td>{order.statusOder}</td>
                      <td>
                        {order.productBuy.map(product => (
                          <div key={product.idProduct}>
                            {product.idProduct} (Số lượng: {product.quantityBuy})
                          </div>
                        ))}
                      </td>
                      <td>
                        {order.statusOder === 'Thanh toán thành công' && (
                          <a href="javascript:void(0)" onClick={() => openModal(order)}>
                            <i className="fa-solid fa-eye"></i>
                          </a>
                        )}
                        {order.statusOder === 'Thanh toán thành công' && (
                          <a href="javascript:void(0)" onClick={() => handleConfirmOrder(user.id, index)}>
                            <i className="fa-solid fa-check"></i>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="orderModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Thông Tin Đơn Hàng</h2>
            <span className="close" onClick={closeModal}>
              <i className="fa-solid fa-xmark" />
            </span>
          </div>
          <div className="modal-body">
            <div className="wrapper">
              {selectedOrder && (
                <>
                  <div>
                    <label htmlFor="orderStatus">Trạng Thái Đơn Hàng:</label>
                    <input id="orderStatus" value={selectedOrder.statusOder} disabled />
                    <label htmlFor="orderProducts">Sản Phẩm:</label>
                    <ul id="orderProducts">
                      {selectedOrder.productBuy.map(product => (
                        <li key={product.idProduct}>
                          {product.idProduct} (Số lượng: {product.quantityBuy})
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;
