import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../../css/profile.css';
import Header from './Header';
import Footer from './Footer';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl-sWnKIkRYOLxuIZkYPO39Vj37ISPLSE",
  authDomain: "ptit-b51c0.firebaseapp.com",
  projectId: "ptit-b51c0",
  storageBucket: "ptit-b51c0.appspot.com",
  messagingSenderId: "1069516758706",
  appId: "1:1069516758706:web:bf25770ca9f9cea3a033ab"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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

const Profile: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [yourProfile, setYourProfile] = useState<Account | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Account[]>('http://localhost:5000/accounts')
      .then(response => {
        setAccounts(response.data);
        const activeUser = response.data.find(account => account.status === 1);
        setYourProfile(activeUser || null);
      })
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  const confirmProfile = () => {
    Swal.fire({
      title: "Bạn có chắc chắn thay đổi thông tin không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/edit-profile");
      }
    });
  };

  const changePass = () => {
    Swal.fire({
      title: "Bạn có chắc chắn thay đổi mật khẩu không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/change-pass");
      }
    });
  };

  const changeAvatar = () => {
    Swal.fire({
      title: "Chọn ảnh",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value as File;
        const storageRef = ref(storage, `profile-pictures/${file.name}`);
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Uploaded a blob or file!', snapshot);
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            if (yourProfile) {
              const updatedProfile = { ...yourProfile, img: downloadURL };
              setYourProfile(updatedProfile);
              saveAccountToLocalStorage(updatedProfile);
              Swal.fire({
                title: "Ảnh của bạn",
                imageUrl: downloadURL,
                imageAlt: "Ảnh đã tải lên",
              });
            }
          });
        });
      }
    });
  };

  const saveAccountToLocalStorage = (account: Account) => {
    const updatedAccounts = accounts.map(acc => acc.id === account.id ? account : acc);
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    axios.put(`http://localhost:5000/accounts/${account.id}`, account)
      .then(response => console.log('Profile updated:', response.data))
      .catch(error => console.error('Error updating profile:', error));
  };

  return (
    <>
      <Header />
      <div className="content-container">
        <div className="private-list">
          <a href="/profile"><div className="person choose-private">Thông tin cá nhân</div></a>
          <a href="/history"> <div className="history-info choose-private">Lịch sử mua hàng</div></a>
        </div>
        <div className="private-info" id="profileContent">
          {yourProfile && (
            <>
              <div className="image-container">
                <div>
                  <img style={{ width: '100%', height: '326px', borderRadius: '6px' }} src={yourProfile.img} alt="" />
                </div>
                <h3 style={{ backgroundColor: '#f8f9fa', padding: '10px', textAlign: 'center' }}>{yourProfile.nameAccount}</h3>
                <div className="choose-file">
                  <button id="changeAvt" onClick={changeAvatar}>Thay đổi ảnh</button>
                </div>
                <div className="button-choose">
                  <button style={{ padding: '10px 20px', border: 'transparent', borderRadius: '6px', backgroundColor: 'greenyellow' }} onClick={confirmProfile}>Đổi thông tin</button>
                  <button style={{ padding: '10px 20px', border: 'transparent', borderRadius: '6px', backgroundColor: 'greenyellow' }} onClick={changePass}>Đổi mật khẩu</button>
                </div>
              </div>
              <div className="user-infomation">
                <h1 style={{ textAlign: 'center', padding: '10px', backgroundColor: '#343a40', color: '#f8f9fa' }}>Thông tin cá nhân</h1>
                <div className="info-users-container">
                  <label style={{ fontWeight: 600 }}>Tên người dùng:</label>
                  <span>{yourProfile.nameAccount}</span>
                </div>
                <hr />
                <div className="info-users-container">
                  <label style={{ fontWeight: 600 }}>Email:</label>
                  <span>{yourProfile.email}</span>
                </div>
                <hr />
                <div className="info-users-container">
                  <label style={{ fontWeight: 600 }}>Địa chỉ:</label>
                  <span>{yourProfile.address}</span>
                </div>
                <hr />
                <div className="info-users-container">
                  <label style={{ fontWeight: 600 }}>Số điện thoại:</label>
                  <span>{yourProfile.phone}</span>
                </div>
                <hr />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
