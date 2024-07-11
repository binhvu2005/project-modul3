import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net';
import "./css/user.css"
import "../../css/modal.css"
import "../../css/sidebar.css"
import "./css/style.css"

interface User {
  id: string;
  nameAccount: string;
  img: string;
  phone: string;
  email: string;
  lock: 'locked' | 'open';
  address: string;
}

const ManagementUser: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/accounts')
      .then(response => response.json())
      .then(data => setUserList(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    new DataTable("#table");
  }, [userList]);

  const showSidebar = () => setIsSidebarOpen(true);
  const hideSidebar = () => setIsSidebarOpen(false);

  const openModal = (user: User) => {
    setSelectedUser(user);
    const modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'block';
  };

  const closeModal = () => {
    const modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'none';
    setSelectedUser(null);
  };

  const handleLockAcc = (index: number) => {
    Swal.fire({
      title: "Tài khoản này sẽ bị khóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUserList = [...userList];
        updatedUserList[index].lock = "locked";
        setUserList(updatedUserList);

        fetch(`http://localhost:5000/accounts/${updatedUserList[index].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lock: 'locked' })
        });

        Swal.fire('Đã khóa tài khoản', '', 'success');
      }
    });
  };

  const handleOpenAcc = (index: number) => {
    Swal.fire({
      title: "Tài khoản này sẽ được mở khóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUserList = [...userList];
        updatedUserList[index].lock = "open";
        setUserList(updatedUserList);

        fetch(`http://localhost:5000/accounts/${updatedUserList[index].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lock: 'open' })
        });

        Swal.fire('Đã mở khóa tài khoản', '', 'success');
      }
    });
  };

  return (
  <>
 
  <div>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div
            className={`col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark ${isSidebarOpen ? '' : 'd-none'}`}
            id="sidebar"
          >
            <a href="http://localhost:5173/admin-user">Quản lí Người Dùng</a>
            <br />
            <a href="http://localhost:5173/admin-product">Quản lí Sản Phẩm</a><br />
            <a href="/admin-category">Danh mục</a>
            <br />
            <a href="/admin-orders">Đơn hàng</a>
          </div>
          <nav className="header-nav-item"></nav>
          <div className="col py-3">
          <h1>Quản lí người dùng</h1>
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
              id="table"
              className="table table-striped table-hover table-dark"
              style={{ width: '100%' }}
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Name</th>
                  <th>Account</th>
                  <th>Phone Number</th>
                  <th>Gmail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.nameAccount}</td>
                    <td><img src={user.img} alt=""  /></td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td className="status">
                      <a href="javascript:void(0)" onClick={() => openModal(user)}><i className="fa-solid fa-eye"></i></a>
                      <a href="javascript:void(0)" onClick={() => user.lock === 'locked' ? handleOpenAcc(index) : handleLockAcc(index)}>
                        <i className={`fa-solid fa-lock${user.lock === 'locked' ? '' : '-open'}`}></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="myModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Thông Tin User <i className="fa-solid fa-video" /></h2>
            <span className="close" onClick={closeModal}>
              <i className="fa-solid fa-x" />
            </span>
          </div>
          <br />
          <div className="modal-body">
            <div className="wrapper">
              {selectedUser && (
                <>
                  <img src={selectedUser.img} alt="" height="200px" width="200px" />
                  <div>
                    <label htmlFor="id">ID</label>
                    <input id="id" value={selectedUser.id} disabled />
                    <label htmlFor="name">Họ và Tên:</label>
                    <input id="name" value={selectedUser.nameAccount} disabled />
                    <label htmlFor="email">Email:</label>
                    <input id="email" value={selectedUser.email} disabled />
                  </div>
                  <div>
                    <label htmlFor="phone">Số Điện Thoại:</label>
                    <input id="phone" value={selectedUser.phone} disabled />
                    <label htmlFor="status">Trạng Thái:</label>
                    <input id="status" value={selectedUser.lock} disabled />
                    <label htmlFor="country">Quốc gia:</label>
                    <input id="country" value={selectedUser.address} disabled />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default ManagementUser;
