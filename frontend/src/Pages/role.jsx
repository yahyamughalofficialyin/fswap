import React, { useEffect, useState } from 'react';

const Role = () => {
    const [roles, setRoles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newRole, setNewRole] = useState("");
    const [roleToDelete, setRoleToDelete] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        fetch('https://66ff0ee32b9aac9c997e2a03.mockapi.io/role')
            .then((response) => response.json())
            .then((data) => setRoles(data))
            .catch((error) => console.error('Error fetching roles:', error));
    }, []);

    // Open and close modal handlers
    const handleOpenAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleOpenDeleteModal = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setRoleToDelete(null);
        setShowDeleteModal(false);
    };

    // Add role handler
    const handleAddRole = (e) => {
        e.preventDefault();
        const newRoleData = {
            Role: newRole,
            UserCount: "0"
        };

        fetch('https://66ff0ee32b9aac9c997e2a03.mockapi.io/role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoleData)
        })
            .then((response) => response.json())
            .then((data) => {
                setRoles([...roles, data]);
                setNewRole("");
                handleCloseAddModal();
            })
            .catch((error) => console.error('Error adding role:', error));
    };

    // Delete role handler
    const handleDeleteRole = () => {
        fetch(`https://66ff0ee32b9aac9c997e2a03.mockapi.io/role/${roleToDelete.id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setRoles(roles.filter((role) => role.id !== roleToDelete.id));
                handleCloseDeleteModal();
            })
            .catch((error) => console.error('Error deleting role:', error));
    };

    return (
        <div className="content-wrapper mt-5">
            <div className="row mt-5">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-10">
                                    <h4 className="card-title">Role Table</h4>
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
                                            <th>Role</th>
                                            <th>User Count</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role) => (
                                            <tr key={role.id}>
                                                <td>{role.Role}</td>
                                                <td className="text-success">{role.UserCount}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleOpenDeleteModal(role)}
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

            {/* Add Role Modal */}
            {showAddModal && (
                <div className="modal fade show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Role</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={handleCloseAddModal}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleAddRole}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="role">Role Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="role"
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseAddModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Role
                                    </button>
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
                                <button
                                    type="button"
                                    className="close"
                                    onClick={handleCloseDeleteModal}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this role?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseDeleteModal}
                                >
                                    No
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteRole}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {(showAddModal || showDeleteModal) && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Role;
