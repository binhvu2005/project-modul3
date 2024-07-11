import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAccounts, loginUser } from '../../store/reducers/accountsSlice';
import '../../css/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.accounts.currentUser);


  useEffect(() => {
    const initializeAccounts = async () => {
      await dispatch(fetchAccounts());
      await axios.get('http://localhost:5000/accounts')
        .then((response) => {
          response.data.forEach(async (account: { id: number; status: number }) => {
            if (account.status !== 0) {
              await axios.patch(`http://localhost:5000/accounts/${account.id}`, { status: 0 });
            }
          });
        })
        .catch((error) => {
          console.error('Failed to reset account statuses:', error);
        });
    };

    initializeAccounts();
  }, [dispatch]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors: { [key: string]: string } = {};
    if (!email) formErrors.email = 'Email không được để trống';
    if (!password) formErrors.password = 'Mật khẩu không được để trống';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Dispatch loginUser action
    dispatch(loginUser({ email, password }));

    if (currentUser) {
      if (currentUser.lock === 'lock') {
        alert('Tài khoản này đã bị khóa!');
      } else {
        await axios.patch(`http://localhost:5000/accounts/${currentUser.id}`, { status: 1 });
        alert('Đăng nhập thành công!');
        navigate('/home');
      }
    } else {
      alert('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  return (
    <section className="vh-100" style={{ marginTop: "-64px" }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div style={{ textAlign: 'center', fontSize: '45px' }}>
              ĐĂNG NHẬP
            </div>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg"
                  placeholder="Nhập email"
                  value={email}
                  onChange={handleEmailChange}
                />
                {errors.email && (
                  <div style={{ color: 'red' }}>{errors.email}</div>
                )}
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errors.password && (
                  <div style={{ color: 'red' }}>{errors.password}</div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Lưu mật khẩu
                  </label>
                </div>
                <a href="#!" className="text-body">Quên mật khẩu?</a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Đăng nhập
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Bạn chưa có tài khoản?
                  <Link to="/sign-up" className="link-danger">Đăng kí</Link> tại đây
                </p>
              </div>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Hoặc</p>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                <p className="lead fw-normal mb-0 me-3">Đăng nhập bằng</p>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-twitter"></i>
                </button>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>

        <div>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-google"></i>
          </a>
          <a href="#!" className="text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;
