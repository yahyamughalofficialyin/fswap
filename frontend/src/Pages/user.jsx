import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const User = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newUser, setNewUser] = useState({
        Username: "",
        Email: "",
        RoleId: "",
        Password: "",
        Image: ""
    });
    const [userToDelete, setUserToDelete] = useState(null);
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

    useEffect(() => {
        // Fetch users
        axios.get('https://66ff0ee32b9aac9c997e2a03.mockapi.io/user')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('Error fetching users:', error));

        // Fetch roles
        axios.get('https://66ff0ee32b9aac9c997e2a03.mockapi.io/role')
            .then((response) => setRoles(response.data))
            .catch((error) => console.error('Error fetching roles:', error));
    }, []);

    const handleOpenAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    // Input validation functions
    const isValidUsername = (username) => /^[A-Za-z]+$/.test(username);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = (password) => password.length >= 8;

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    // Add user handler
    const handleAddUser = async (e) => {
        e.preventDefault();
        
        if (!isValidUsername(newUser.Username)) {
            alert("Username should not contain spaces, numbers, or special characters.");
            return;
        }
        if (!isValidEmail(newUser.Email)) {
            alert("Please enter a valid email.");
            return;
        }
        if (!isValidPassword(newUser.Password)) {
            alert("Password should be at least 8 characters long.");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(newUser.Password, 10);
        
        const userData = {
            ...newUser,
            Password: hashedPassword
        };

        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append("file", userData.Image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryResponse = await axios.post(CLOUDINARY_URL, formData, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        
        userData.Image = cloudinaryResponse.data.secure_url;

        axios.post('https://66ff0ee32b9aac9c997e2a03.mockapi.io/user', userData)
            .then((response) => {
                setUsers([...users, response.data]);
                setNewUser({ Username: "", Email: "", RoleId: "", Password: "", Image: "" });
                handleCloseAddModal();
            })
            .catch((error) => console.error('Error adding user:', error));
    };

    // Delete user handler
    const handleDeleteUser = () => {
        axios.delete(`https://66ff0ee32b9aac9c997e2a03.mockapi.io/user/${userToDelete.id}`)
            .then(() => {
                setUsers(users.filter((user) => user.id !== userToDelete.id));
                handleCloseDeleteModal();
            })
            .catch((error) => console.error('Error deleting user:', error));
    };

    return (
        <div className="content-wrapper mt-5">
            <div className="row mt-5">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-10">
                                    <h4 className="card-title">User Table</h4>
                                </div>
                                <div className="col-sm-2">
                                    <p className="card-description">
                                        <button
                                            className="nav-link btn btn-success create-new-button"
                                            onClick={handleOpenAddModal}
                                        >
                                            + Add
                                        </button>
                                    </p>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Image</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.Username}</td>
                                                <td>{user.Email}</td>
                                                <td className="text-success">{roles.find(role => role.id === user.RoleId)?.Role}</td>
                                                <td><img src={user.Image} alt="" width="50" /></td>
                                                <td>
                                                    <button className="btn btn-warning mr-3">Update</button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleOpenDeleteModal(user)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal fade show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add User</h5>
                                <button type="button" className="close" onClick={handleCloseAddModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleAddUser}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input type="text" name="Username" className="form-control" onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" name="Email" className="form-control" onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select name="RoleId" className="form-control" onChange={handleInputChange} required>
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>{role.Role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" name="Password" className="form-control" onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Image</label>
                                        <input type="file" name="Image" className="form-control" onChange={(e) => setNewUser({...newUser, Image: e.target.files[0]})} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseAddModal}>Close</button>
                                    <button type="submit" className="btn btn-primary">Add User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="close" onClick={handleCloseDeleteModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this user?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
