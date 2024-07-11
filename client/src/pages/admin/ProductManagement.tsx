import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import axios from 'axios';

const ProductManagement: React.FC = () => {
    const [productList, setProductList] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
        new DataTable("#productTable");
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProductList(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const showProductDetails = (index: number) => {
        setSelectedProduct(productList[index]);
        openModal();
    };

    const deleteProduct = (index: number) => {
        const productId = productList[index].id;
        Swal.fire({
            title: "Bạn có chắc muốn xóa sản phẩm này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/products/${productId}`);
                    fetchProducts();
                    Swal.fire("Deleted!", "Sản phẩm đã được xóa.", "success");
                } catch (error) {
                    console.error("Error deleting product:", error);
                    Swal.fire("Error!", "Có lỗi xảy ra khi xóa sản phẩm.", "error");
                }
            }
        });
    };

    const openModal = () => {
        const modal = document.getElementById("myModal") as HTMLDivElement;
        modal.style.display = "block";
    };

    const closeModal = () => {
        const modal = document.getElementById("myModal") as HTMLDivElement;
        modal.style.display = "none";
        setIsEditing(false);
        setSelectedProduct(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedProduct((prevProduct: any) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const saveProduct = async () => {
        if (isEditing) {
            try {
                await axios.put(`http://localhost:5000/products/${selectedProduct.id}`, selectedProduct);
                fetchProducts();
                closeModal();
                Swal.fire("Updated!", "Sản phẩm đã được cập nhật.", "success");
            } catch (error) {
                console.error("Error updating product:", error);
                Swal.fire("Error!", "Có lỗi xảy ra khi cập nhật sản phẩm.", "error");
            }
        } else {
            try {
                await axios.post('http://localhost:5000/products', selectedProduct);
                fetchProducts();
                closeModal();
                Swal.fire("Added!", "Sản phẩm đã được thêm.", "success");
            } catch (error) {
                console.error("Error adding product:", error);
                Swal.fire("Error!", "Có lỗi xảy ra khi thêm sản phẩm.", "error");
            }
        }
    };

    const editProduct = (index: number) => {
        setSelectedProduct(productList[index]);
        setIsEditing(true);
        openModal();
    };

    const addProduct = () => {
        setSelectedProduct({
            id: '',
            nameProduct: '',
            category: '',
            quantity: 0,
            price: 0,
            img: ''
        });
        setIsEditing(false);
        openModal();
    };

    const filteredProducts = productList.filter(product =>
        product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
      <h1>Quản lí sản phẩm</h1>
       <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark" id="sidebar">
                    <a href="/admin-product">Sản phẩm</a><br />
                    <a href="/admin-user">Tài khoản</a><br />
                    <a href="/admin-category">Danh mục</a><br />
                    <a href="/admin-orders">Đơn hàng</a><br />
                </div>
                <div className="col py-3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control mb-3"
                    />
                    <button onClick={addProduct} className="btn btn-primary mb-3">Thêm sản phẩm</button>
                    <table id="productTable" className="table table-striped table-hover table-dark" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.nameProduct}</td>
                                    <td>{product.category}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <a href="javascript:void(0)" onClick={() => showProductDetails(index)}><i className="fa-solid fa-eye"></i></a>
                                        <a href="javascript:void(0)" onClick={() => editProduct(index)}><i className="fa-solid fa-pen"></i></a>
                                        <a href="javascript:void(0)" onClick={() => deleteProduct(index)}><i className="fa-solid fa-trash"></i></a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedProduct && (
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"} <i className="fa-solid fa-box"></i></h2>
                            <span className="close" onClick={closeModal}><i className="fa-solid fa-x"></i></span>
                        </div>
                        <div className="modal-body">
                            <div className="wrapper">
                                <div>
                                    <label htmlFor="productId">ID:</label>
                                    <input id="productId" name="id" value={selectedProduct.id} onChange={handleInputChange} disabled={isEditing} />

                                    <label htmlFor="productName">Name:</label>
                                    <input id="productName" name="nameProduct" value={selectedProduct.nameProduct} onChange={handleInputChange} />

                                    <label htmlFor="productCategory">Category:</label>
                                    <input id="productCategory" name="category" value={selectedProduct.category} onChange={handleInputChange} />

                                    <label htmlFor="productQuantity">Quantity:</label>
                                    <input id="productQuantity" name="quantity" value={selectedProduct.quantity} onChange={handleInputChange} />

                                    <label htmlFor="productPrice">Price:</label>
                                    <input id="productPrice" name="price" value={selectedProduct.price} onChange={handleInputChange} />

                                    <label htmlFor="productImg">Image URL:</label>
                                    <input id="productImg" name="img" value={selectedProduct.img} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={saveProduct} className="btn btn-success">{isEditing ? "Save" : "Add"}</button>
                            <button onClick={closeModal} className="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div></>
       
    );
};

export default ProductManagement;
