import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


interface Account {
  id: number;
  nameAccount: string;
  email: string;
  address: string;
  phone: string;
  img: string;
  password: string;
  status: number;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [matKhauHienTai, setMatKhauHienTai] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [errors, setErrors] = useState({
    matKhauHienTai: '',
    matKhauMoi: '',
    xacNhanMatKhau: '',
    thongBaoLoi: ''
  });

  useEffect(() => {
    axios.get<Account[]>('http://localhost:5000/accounts')
      .then(response => setAccounts(response.data))
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case 'matKhauHienTai':
        setMatKhauHienTai(value);
        break;
      case 'matKhauMoi':
        setMatKhauMoi(value);
        break;
      case 'xacNhanMatKhau':
        setXacNhanMatKhau(value);
        break;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {
      matKhauHienTai: '',
      matKhauMoi: '',
      xacNhanMatKhau: '',
      thongBaoLoi: ''
    };

    let activeUser = accounts.find((account) => account.status === 1);

    if (activeUser && activeUser.password !== matKhauHienTai) {
      newErrors.matKhauHienTai = '! Mật khẩu hiện tại không chính xác';
      isValid = false;
    }

    if (matKhauMoi.length < 6) {
      newErrors.matKhauMoi = '! Password ít nhất phải có 6 ký tự';
      isValid = false;
    }

    if (matKhauHienTai.trim() === '') {
      newErrors.matKhauHienTai = '! Không được để trống';
      isValid = false;
    }

    if (matKhauMoi.trim() === '') {
      newErrors.matKhauMoi = '! Không được để trống';
      isValid = false;
    }

    if (xacNhanMatKhau.trim() === '') {
      newErrors.xacNhanMatKhau = '! Không được để trống';
      isValid = false;
    }

    if (matKhauMoi !== xacNhanMatKhau) {
      newErrors.thongBaoLoi = 'Xác nhận mật khẩu không trùng khớp.';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid && activeUser) {
      Swal.fire({
        title: "Bạn đã chắc về thay đổi mật khẩu mới chưa?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Chắc chắn",
        denyButtonText: `Chưa chắc`,
      }).then((result) => {
        if (result.isConfirmed) {
          activeUser.password = matKhauMoi;
          axios.put(`http://localhost:5000/accounts/${activeUser.id}`, activeUser)
            .then(() => {
              Swal.fire("Thay Đổi mật khẩu thành công!", "", "success");
              setTimeout(() => {
                navigate("/profile")
              }, 1400);
            })
            .catch(error => console.error('Error updating password:', error));
        } else if (result.isDenied) {
          Swal.fire("Thông tin chưa được lưu", "", "info");
        }
      });
    }
  };

  return (
    <div>
      <a href="./profile"><button className="btnn">Quay lại</button></a>
      <div className="container">
        <h2>Đổi Mật Khẩu</h2>
        <form id="formDoiMatKhau" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <input
              type="password"
              id="matKhauHienTai"
              name="matKhauHienTai"
              required
              placeholder="Mật khẩu hiện tại...."
              value={matKhauHienTai}
              onChange={handleInputChange}
            />
          </div>
          {errors.matKhauHienTai && <span id="trong-4">{errors.matKhauHienTai}</span>}
          <div className="form-group">
            <input
              type="password"
              id="matKhauMoi"
              name="matKhauMoi"
              required
              placeholder="Mật khẩu mới...."
              value={matKhauMoi}
              onChange={handleInputChange}
            />
          </div>
          {errors.matKhauMoi && <span id="doDaiMatKhau">{errors.matKhauMoi}</span>}
          <div className="form-group">
            <input
              type="password"
              id="xacNhanMatKhau"
              name="xacNhanMatKhau"
              required
              placeholder="Xác nhận mật khẩu..."
              value={xacNhanMatKhau}
              onChange={handleInputChange}
            />
          </div>
          {errors.xacNhanMatKhau && <span id="trong-3">{errors.xacNhanMatKhau}</span>}
          <div id="thongBaoLoi" className="thong-bao-loi">{errors.thongBaoLoi}</div>
          <button type="submit">Đổi Mật Khẩu</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
