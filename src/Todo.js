import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const apiURL = "http://localhost:5000";

    const handleSubmit = () => {
        setError("");
        //check inputs
        if (title.trim() != '' && description.trim() != '') {
            fetch(apiURL + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    //add item to list
                    setTodos([...todos, { title, description }]);
                    setMessage("ToDo item added successfully...");
                    setTitle("");
                    setDescription("");
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                } else {
                    setError("Unable to create ToDo item...");
                }
            }).catch(() => {
                setError("Unable to create ToDo item...");
            });
        }
    }

    useEffect(() => {
        getItems();
    }, [])

    const getItems = () => {
        fetch(apiURL + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            })
    };

    const handleEdit = (e) => {
        setEditId(e._id);
        setEditTitle(e.title);
        setEditDescription(e.description);
    }

    const handleEditCancel = () => {
        setEditId(-1);
    }

    const handleUpdate = () => {
        setError("");
        //check inputs
        if (editTitle.trim() != '' && editDescription.trim() != '') {
            fetch(apiURL + '/todos/' + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    //update item to list
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedTodos);
                    setMessage("ToDo item updated successfully...");
                    setEditTitle("");
                    setDescription("");
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);

                    setEditId(-1);
                } else {
                    setError("Unable to create ToDo item...");
                }
            }).catch(() => {
                setError("Unable to create ToDo item...");
            });
        }
    }

    const handleDelete = (id) => {
        if (window.confirm('Are You Sure Want to delete this task?')) {
            fetch(apiURL + "/todos/" + id, {
                method: "DELETE"
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            })

        }
    }

    return (
        <>
        <div className="container mt-5">
            {/* Header Section with Gradient */}
            <div className="row p-5 text-center bg-gradient-to-right from-success to-dark text-black rounded shadow-lg">
                <div className="col">
                    <h1 className="display-3 fw-bold">ToDo Application with MERN Stack</h1>
                    <p className="lead">Organize your tasks efficiently</p>
                </div>
            </div>
    
            {/* Add Item Section */}
            <div className="row mt-5">
                <div className="col-md-8 offset-md-2">
                    <div className="card bg-dark text-light border-0 shadow-lg rounded-lg">
                        <div className="card-body p-5">
                            <h3 className="card-title text-success mb-4">Add New Task</h3>
                            {message && <p className="text-success text-center fw-bold">{message}</p>}
                            <div className="form-group d-flex gap-3">
                                <input 
                                    className="form-control form-control-lg bg-secondary text-white border-0 shadow-sm" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    type="text" 
                                    placeholder="Enter Task Title" 
                                />
                                <input 
                                    className="form-control form-control-lg bg-secondary text-white border-0 shadow-sm" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    type="text" 
                                    placeholder="Enter Description" 
                                />
                                <button 
                                    className="btn btn-success btn-lg px-5 shadow-sm" 
                                    onClick={handleSubmit}
                                >
                                    <i className="fas fa-plus-circle"></i> Add Task
                                </button>
                            </div>
                            {error && <p className="text-danger text-center fw-bold mt-3">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Tasks Section */}
            <div className="row mt-5">
                <div className="col-md-8 offset-md-2">
                    <h3 className="text-white mb-4">Your Tasks</h3>
                    <ul className="list-group">
                        {todos.map((item, key) => (
                            <li 
                                key={key} 
                                className="list-group-item d-flex justify-content-between align-items-center bg-gradient-to-right from-info to-primary text-black shadow-lg rounded-lg mb-3 p-3"
                            >
                                <div className="d-flex flex-column">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold fs-5">{item.title}</span>
                                            <span className="text-dark">{item.description}</span>
                                        </>
                                    ) : (
                                        <div className="form-group d-flex gap-2">
                                            <input 
                                                className="form-control bg-secondary text-white border-0 shadow-sm" 
                                                value={editTitle} 
                                                onChange={(e) => setEditTitle(e.target.value)} 
                                                type="text" 
                                                placeholder="Title" 
                                            />
                                            <input 
                                                className="form-control bg-secondary text-white border-0 shadow-sm" 
                                                value={editDescription} 
                                                onChange={(e) => setEditDescription(e.target.value)} 
                                                type="text" 
                                                placeholder="Description" 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-3">
                                    {editId === -1 || editId !== item._id ? (
                                        <button className="btn btn-warning btn-sm rounded-pill px-3" onClick={() => handleEdit(item)}>
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                    ) : (
                                        <button className="btn btn-success btn-sm rounded-pill px-3" onClick={handleUpdate}>
                                            <i className="fas fa-check-circle"></i> Update
                                        </button>
                                    )}
                                    {editId === -1 || editId !== item._id ? (
                                        <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={() => handleDelete(item._id)}>
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary btn-sm rounded-pill px-3" onClick={handleEditCancel}>
                                            <i className="fas fa-times-circle"></i> Cancel
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </>
    
    
    )
}

export default Todo
