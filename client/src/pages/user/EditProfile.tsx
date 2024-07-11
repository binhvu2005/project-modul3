import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Account {
  id: number;
  nameAccount: string;
  email: string;
  address: string;
  phone: string;
  img: string;
  status: number;
}

const validateEmail = (email: string): boolean => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const ProfileEdit: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    axios.get<Account[]>('http://localhost:5000/accounts')
      .then(response => {
        const activeAccount = response.data.find(acc => acc.status === 1);
        if (activeAccount) {
          setAccount(activeAccount);
        }
      })
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (account) {
      setAccount({
        ...account,
        [id]: value
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account) {
      let formIsValid = true;
      let errors = {
        name: '',
        email: '',
        address: '',
        phone: ''
      };

      if (!account.nameAccount) {
        formIsValid = false;
        errors.name = 'Tên không được để trống';
      }

      if (!account.email) {
        formIsValid = false;
        errors.email = 'Email không được để trống';
      } else if (!validateEmail(account.email)) {
        formIsValid = false;
        errors.email = 'Email không đúng định dạng';
      } else if (account.email.length > 50) {
        formIsValid = false;
        errors.email = 'Email quá dài';
      }

      if (!account.address) {
        formIsValid = false;
        errors.address = 'Địa chỉ không được để trống';
      }

      if (!account.phone) {
        formIsValid = false;
        errors.phone = 'Số điện thoại không được để trống';
      }

      setErrors(errors);

      if (formIsValid) {
        Swal.fire({
          title: 'Bạn có muốn lưu thông tin mới không?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Lưu',
          denyButtonText: `Không lưu`,
        }).then((result) => {
          if (result.isConfirmed) {
            axios.put(`http://localhost:5000/accounts/${account.id}`, account)
              .then(() => {
                Swal.fire('Thay Đổi thông tin thành công!', '', 'success');
                setTimeout(() => {
                  window.location.href = "profile.html";
                }, 1400);
              })
              .catch(error => console.error('Error updating account:', error));
          } else if (result.isDenied) {
            Swal.fire('Thông tin chưa được lưu', '', 'info');
          }
        });
      }
    }
  };

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <section className="h-100 bg-dark">
      <form id="editProfile" onSubmit={handleFormSubmit}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card card-registration my-4">
                <div className="row g-0">
                  <div className="col-xl-6 d-none d-xl-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                      className="img-fluid"
                      alt="Sample image"
                    />
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                      className="img-fluid"
                      alt="Phone image"
                    />
                  </div>
                  <div className="col-xl-6">
                    <a
                      className="material-symbols-outlined"
                      href="./profile"
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                        marginLeft: '600px',
                        marginTop: '10px'
                      }}
                    >
                      close
                    </a>
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-5 text-uppercase">Sửa thông tin</h3>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="name">Tên</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="name"
                              style={{ width: '460px' }}
                              placeholder="Nhập tên"
                              value={account.nameAccount}
                              onChange={handleInputChange}
                            />
                            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="email"
                          placeholder="Nhập email"
                          value={account.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="myAddress">Địa chỉ</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="address"
                          placeholder="Nhập địa chỉ"
                          value={account.address}
                          onChange={handleInputChange}
                        />
                        {errors.address && <div style={{ color: 'red' }}>{errors.address}</div>}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="phone">Điện thoại</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="phone"
                          placeholder="Nhập số điện thoại"
                          value={account.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                      </div>

                      <div className="d-flex justify-content-end pt-3">
                        <button type="reset" className="btn btn-light btn-lg">Xóa tất cả</button>
                        <button type="submit" className="btn btn-warning btn-lg ms-2">Lưu thông tin</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProfileEdit;
