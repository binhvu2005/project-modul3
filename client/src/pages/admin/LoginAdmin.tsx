import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "./css/style.css"

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Success',
                    text: 'Login successful!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirect to admin dashboard or home page
                    window.location.href = '/admin-dashboard';
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Invalid credentials',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while logging in',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className='boddy'>
              <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
        </div>
      
    );
};

export default LoginPage;
