import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const PetsList = ({ setPetCount }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/searchAll`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('userToken'),
                    },
                })
                setPets(res.data);
                setPetCount(res.data.length);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
            setLoading(false);
        }
        fetchData();
    }, [setPetCount]);

    const handleUserClick = (id) => {
        navigate(`/PetPage/${id}`);
    }

    if (loading)
        return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <h2 style={{ color: '#F8A97A' }}>Pets List</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover mb-5">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Breed</th>
                            <th scope="col">Color</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map(pet => (
                            <tr key={pet._id} onClick={() => { handleUserClick(pet._id) }}>
                                <td style={{ cursor: 'pointer' }}>
                                    <img src={pet.image} style={{ objectFit: 'cover' }} alt="" width="50" height="50" />
                                </td>
                                <td style={{ cursor: 'pointer' }}>{pet.name}</td>
                                <td style={{ cursor: 'pointer' }}>{pet.breed}</td>
                                <td style={{ cursor: 'pointer' }}>{pet.color}</td>
                                <td style={{ cursor: 'pointer' }}>{pet.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PetsList;