import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UsersList = ({ setUserCount }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('userToken'),
                    },
                });
                setUsers(res.data);
                setUserCount(res.data.length);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
            setLoading(false);
        }
        fetchData();
    }, [setUserCount]);

    const handleUserClick = (id) => {
        navigate(`/UserPage/${id}`);
    }

    if (loading)
        return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2 style={{ color: '#F8A97A' }}>Users List</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} onClick={() => { handleUserClick(user._id) }}>
                                <td style={{ cursor: 'pointer' }}>{user.firstName}{" "}{user.lastName}</td>
                                <td style={{ cursor: 'pointer' }}>{user.email}</td>
                                <td style={{ cursor: 'pointer' }}>{user.phone}</td>
                                <td style={{ cursor: 'pointer' }}>{user.isAdmin ? "✔️" : "❌"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersList;