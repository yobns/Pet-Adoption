import React, { useState, useEffect, useContext } from 'react';
import './PetPage.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalContext } from '../Context/ModalsContext';
import EditPetModal from '../EditPetModal/EditPetModal';

const PetPage = () => {
    const [pet, setPet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const { id } = useParams();
    const { isAdmin, isUserLoggedIn, handleLoginShow } = useContext(ModalContext);
    const [savedPets, setSavedPets] = useState([]);
    const [adoptedBy, setAdoptedBy] = useState(null);
    const [fosteredBy, setFosteredBy] = useState(null);
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPet = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/${id}`);
                setPet(res.data);

                if (res.data.adoptedBy) {
                    const nameResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${res.data.adoptedBy}`, {
                        headers: {
                            'x-auth-token': token,
                        }
                    });
                    setAdoptedBy(nameResponse.data.firstName);
                }
                if (res.data.fosteredBy) {
                    const nameResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${res.data.fosteredBy}`, {
                        headers: {
                            'x-auth-token': token,
                        }
                    });
                    setFosteredBy(nameResponse.data.firstName);
                }
            } catch (error) {
                console.error('Error fetching pet details', error);
            }
            setIsLoading(false);
        };

        const fetchSavedPets = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/user/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    }
                })
                if (res.status === 200)
                    setSavedPets(res.data.savedPets);
            } catch (err) {
                console.error('Error fetching saved pets:', err);
            }
        }
        fetchPet();
        fetchSavedPets();
    }, [id, token]);

    if (isLoading) return <div>Loading pet details...</div>;
    if (!pet) return <div>Pet not found</div>;

    const isSaved = (petId) => {
        return savedPets.includes(petId);
    }

    const isOwner = () => {
        const userId = localStorage.getItem('userId');
        if (!pet || !userId)
            return false;

        return pet.adoptedBy === userId || pet.fosteredBy === userId;
    }

    const handleAdoptFoster = async (type) => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/pets/${pet._id}/adoptFoster`, { type }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('userToken'),
                }
            })

            if (res.status === 200) {
                console.log(res.data);
                window.location.reload()
            } else {
                console.error('Failed to adopt or foster the pet');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const handleReturnPet = async () => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pets/${pet._id}/return`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('userToken'),
                }
            })

            if (res.status === 200) {
                console.log('Pet returned successfully');
                window.location.reload()
            } else {
                console.error('Failed to return the pet');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const handleSavePet = async () => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/pets/${pet._id}/save`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('userToken'),
                }
            })

            if (res.status === 200) {
                console.log('Pet saved successfully');
                setSavedPets([...savedPets, pet._id]);
            } else {
                console.error('Failed to save the pet');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const handleUnsavePet = async () => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pets/${pet._id}/unsave`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('userToken'),
                }
            })

            if (res.status === 200) {
                console.log('Pet unsaved successfully');
                setSavedPets(savedPets.filter(savedPetId => savedPetId !== pet._id));
            } else {
                console.error('Failed to unsave the pet');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure ?")) {
            try {
                const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pets/${pet._id}`, {
                    headers: {
                        'x-auth-token': token,
                    }
                })
                if (res.status === 200)
                    navigate('/search')
                else
                    console.log('Failed to unsave the pet');
            } catch (error) {
                console.error('Error deleting pet:', error);
            }
        }
    }

    return (
        <div className='petPage'>

            <div className='container-petPage'>
                <div className="items">
                    <div className='imgNamePet'>
                        <img className='img-petPage' src={pet.image} alt={pet.name} />
                        <p className='title-petPage'>{pet.name}</p>
                        {isUserLoggedIn &&
                            <div className='buttonPetPage'>
                                {!isOwner() && (
                                    <>
                                        {(!adoptedBy && !fosteredBy && !isAdmin()) && (
                                            <>
                                                <button className='btn-petPage' style={{ backgroundColor: '#F8A97A' }} onClick={() => handleAdoptFoster('Adopt')}>Adopt</button>
                                                <button className='btn-petPage' style={{ backgroundColor: '#1caf1ca1' }} onClick={() => handleAdoptFoster('Foster')}>Foster</button>
                                            </>
                                        )}
                                        {adoptedBy && (
                                            <p>Adopted by <span className='fetchedName'>{adoptedBy}</span></p>
                                        )}
                                        {fosteredBy && (
                                            <p>Fostered by <span className='fetchedName'>{fosteredBy}</span></p>
                                        )}
                                    </>
                                )}
                                {isOwner() && (
                                    <button className='btn-petPage' style={{ backgroundColor: '#F8A97A' }} onClick={handleReturnPet} >Return Pet</button>
                                )}
                                {!isAdmin() && (
                                    isSaved(pet._id) ?
                                        <button className='btn-unsave' onClick={handleUnsavePet}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='btn-heart' viewBox="0 0 512 512"><path fill="#ff0000" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                                            Saved
                                        </button> :
                                        <button className='btn-save' onClick={handleSavePet}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='btn-heart' viewBox="0 0 512 512"><path fill="#ff0000" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" /></svg>
                                            Save
                                        </button>
                                )}
                                {isAdmin() && (<>
                                    <button className='btn-petPage' style={{ backgroundColor: '#F8A97A' }} onClick={() => setShowEditModal(true)}>Edit</button>
                                    <button className='btn-petPage' style={{ backgroundColor: '#ff0000a6', padding: '10px' }} onClick={() => handleDelete()}>Delete</button>
                                </>)}
                            </div>
                        }
                        {!isUserLoggedIn && <div className="textLogin mb-5">To use our services please <span className='linkLogin' onClick={handleLoginShow}>login</span></div>}

                        {showEditModal && (
                            <EditPetModal
                                pet={pet}
                                close={() => setShowEditModal(false)}
                                updatedPet={() => window.location.reload()}
                            />
                        )}
                    </div>
                    <div className="infos-container">
                        <p className='infos-petPage'><b>Type:  </b>{pet.type}</p>
                        <p className='infos-petPage'><b>Breed:  </b>{pet.breed}</p>
                        <p className='infos-petPage'><b>Adoption Status:  </b>{pet.status}</p>
                        <p className='infos-petPage'><b>Height:  </b>{pet.height}</p>
                        <p className='infos-petPage'><b>Weight:  </b>{pet.weight}</p>
                        <p className='infos-petPage'><b>Color:  </b>{pet.color}</p>
                        <p className='infos-petPage'><b>Bio:  </b>{pet.bio}</p>
                        <p className='infos-petPage'><b>Hypoallergenic:  </b>{pet.hypoallergenic ? 'Yes' : 'No'}</p>
                        <p className='infos-petPage'><b>Dietary Restrictions: </b>{pet.restrictions ? pet.restrictions : 'No'}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PetPage;
