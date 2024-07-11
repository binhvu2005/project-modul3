// src/pages/Home.tsx
import React from 'react';

import '../css/main.css'
import '../css/style.css'
import Header from '../pages/user/Header';
import Banner from '../pages/user/Banner';
import New from '../pages/user/New';
import CustomerSection from '../pages/user/CustomerSection';
import Footer from '../pages/user/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Banner/>
      <br /><br />
      <div className="container">
  <div className="section">
    <ul className="section-ul row">
      <li className="section-list col-4">
        <a href="" className="section-list-link">
          <p>Giày</p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/giay.jpg?alt=media&token=6fa93bde-89f6-470c-8aac-6e2dd56d1c63"
            alt=""
            className="section-list-link-img"
          />
        </a>
      </li>
      <li className="section-list col-4">
        <a href="" className="section-list-link">
          <p>Dép</p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/dep.jpg?alt=media&token=7d04c24c-f6e7-45ad-aa56-714560b54274"
            alt=""
            className="section-list-link-img"
          />
        </a>
      </li>
      <li className="section-list col-4">
        <a href="" className="section-list-link">
          <p>Phụ kiện</p>
          <img src="https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/pk.jpg?alt=media&token=34bffac6-9441-4c1f-8ef5-d7a28c175f60" alt="" className="section-list-link-img" />
        </a>
      </li>
    </ul>
  </div>
</div>

    <New/>
    <CustomerSection/>
      <br />
      <Footer/>
    </div>
  );
};

export default Home;
