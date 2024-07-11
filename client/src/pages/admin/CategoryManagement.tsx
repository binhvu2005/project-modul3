import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import axios from 'axios';
import "./css/style.css"

const CategoryManagement: React.FC = () => {
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCategories();
        // Initialize DataTable after fetching categories
        new DataTable("#categoryTable");
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/categories');
            setCategoryList(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const showCategoryDetails = (index: number) => {
        setSelectedCategory(categoryList[index]);
        openModal();
    };

    const deleteCategory = (index: number) => {
        const categoryId = categoryList[index].id;
        Swal.fire({
            title: "Bạn có chắc muốn xóa danh mục này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/category/${categoryId}`);
                    fetchCategories();
                    Swal.fire("Deleted!", "Danh mục và các sản phẩm liên quan đã được xóa.", "success");
                } catch (error) {
                    console.error("Error deleting category:", error);
                    Swal.fire("Error!", "Có lỗi xảy ra khi xóa danh mục.", "error");
                }
            }
        });
    };

    const openModal = () => {
        const modal = document.getElementById("myModal") as HTMLDivElement;
        if (modal) {
            modal.style.display = "block";
        }
    };

    const closeModal = () => {
        const modal = document.getElementById("myModal") as HTMLDivElement;
        if (modal) {
            modal.style.display = "none";
        }
        setIsEditing(false);
        setSelectedCategory(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedCategory((prevCategory: any) => ({
            ...prevCategory,
            [name]: value
        }));
    };

    const saveCategory = async () => {
        if (isEditing) {
            try {
                await axios.put(`http://localhost:5000/category/${selectedCategory.id}`, selectedCategory);
                fetchCategories();
                closeModal();
                Swal.fire("Updated!", "Danh mục đã được cập nhật.", "success");
            } catch (error) {
                console.error("Error updating category:", error);
                Swal.fire("Error!", "Có lỗi xảy ra khi cập nhật danh mục.", "error");
            }
        } else {
            try {
                await axios.post('http://localhost:5000/category', selectedCategory);
                fetchCategories();
                closeModal();
                Swal.fire("Added!", "Danh mục đã được thêm.", "success");
            } catch (error) {
                console.error("Error adding category:", error);
                Swal.fire("Error!", "Có lỗi xảy ra khi thêm danh mục.", "error");
            }
        }
    };

    const editCategory = (index: number) => {
        setSelectedCategory(categoryList[index]);
        setIsEditing(true);
        openModal();
    };

    const addCategory = () => {
        setSelectedCategory({
            id: '',
            name: '',
            description: ''
        });
        setIsEditing(false);
        openModal();
    };

    const filteredCategories = categoryList.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
     
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark" id="sidebar">
                    <a href="/admin-product" className="text-light">Sản phẩm</a><br />
                    <a href="/admin-user" className="text-light">Tài khoản</a><br />
                    <a href="/admin-category" className="text-light">Danh mục</a><br />
                    <a href="/admin-orders" className="text-light">Đơn hàng</a><br />
                </div>
                <div className="col py-3">
                <h1>Quản lí danh mục</h1>
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control mb-3"
                    />
                    <button onClick={addCategory} className="btn btn-primary mb-3">Thêm danh mục</button>
                    <table id="categoryTable" className="table table-striped table-hover table-dark" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category, index) => (
                                <tr key={category.id}>
                                    <td>{index + 1}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm" onClick={() => showCategoryDetails(index)}>
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                        <button className="btn btn-warning btn-sm" onClick={() => editCategory(index)}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(index)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedCategory && (
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục"} <i className="fa-solid fa-tags"></i></h2>
                            <span className="close" onClick={closeModal}><i className="fa-solid fa-x"></i></span>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="categoryId">ID:</label>
                                <input id="categoryId" name="id" value={selectedCategory.id} onChange={handleInputChange} className="form-control" disabled={isEditing} />

                                <label htmlFor="categoryName">Name:</label>
                                <input id="categoryName" name="name" value={selectedCategory.name} onChange={handleInputChange} className="form-control" />

                                <label htmlFor="categoryDescription">Description:</label>
                                <input id="categoryDescription" name="description" value={selectedCategory.description} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={saveCategory} className="btn btn-success">{isEditing ? "Save" : "Add"}</button>
                            <button onClick={closeModal} className="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </>
    );
};

export default CategoryManagement;
