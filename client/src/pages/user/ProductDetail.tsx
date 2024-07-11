// components/user/ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/productDetail.css';
import Header from './Header';
import Footer from './Footer';

interface Product {
  id: number;
  nameProduct: string;
  description: string;
  price: number;
  img: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <>
    <Header/>
   <Link to="/products"> <button> tiếp tục mua sắm</button></Link>
    <div className='product-detail-main'>
    <div className="product-detail">
      <h1>{product.nameProduct}</h1>
      <img src={product.img} alt={product.nameProduct} />
      <p>{product.description}</p>
   
    </div>
    <div className='product-detail1'>
<h1>Thông tin sản phẩm</h1>
<p>Chào mừng bạn đến với trang chi tiết sản phẩm! Tại đây, bạn sẽ tìm thấy thông tin đầy đủ và chi tiết về sản phẩm của chúng tôi. Từ hình ảnh, mô tả, đến giá cả và các đặc tính nổi bật, tất cả đều được cung cấp để bạn có cái nhìn toàn diện nhất. Hãy khám phá và lựa chọn sản phẩm phù hợp với nhu cầu của bạn.</p>
<h3>Giá: {product.price.toLocaleString()}đ</h3>
<h4>Số lượng:<input type="number"style={{width:"100px"}} min={1}/></h4> 
    <button className='btn-add'>Thêm vào giỏ hàng</button>
    </div>
    </div>
    
      <Footer/>
    </>
   
  );
};

export default ProductDetail;
