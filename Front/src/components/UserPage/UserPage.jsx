import React, { useContext, useEffect, useState } from 'react'
import './UserPage.css'
import { useNavigate, useParams } from 'react-router-dom'
import { ModalContext } from '../Context/ModalsContext'
import axios from 'axios'
import PetCard from '../petCard/petCard'

const UserPage = () => {
  const navigate = useNavigate()
  const { isAdmin } = useContext(ModalContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [fosteredPets, setFosteredPets] = useState([]);
  const [savedPets, setSavedPets] = useState([]);
  const [petDetails, setPetDetails] = useState([]);
  const [activeTab, setActiveTab] = useState('Adopted');

  useEffect(() => {
    if (!isAdmin())
      navigate('/');
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('userToken'),
          },
        });
        setUser(res.data);
        setSavedPets(res.data.savedPets);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    }

    const fetchAdoptedAndFosteredPets = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/searchAll`);
        const allPets = res.data;
        const adopted = allPets.filter(pet => pet.adoptedBy === id);
        const fostered = allPets.filter(pet => pet.fosteredBy === id);
        setAdoptedPets(adopted);
        setFosteredPets(fostered);
      } catch (err) {
        console.error('Error fetching adopted and fostered pets', err);
      }
    }
    fetchData();
    fetchAdoptedAndFosteredPets();
  }, [id])

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const petDetailsData = await Promise.all(savedPets.map(async (petId) => {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/${petId}`);
          return res.data;
        }))
        setPetDetails(petDetailsData);
      } catch (err) {
        console.error('Error fetching pet details', err);
      }
    }
    fetchPetDetails();
  }, [savedPets]);

  if (loading)
    return <div>Loading...</div>;

  return (
    <div className='userPageContainer'>
      <div className="userCard mb-5">
        <p className="userListName" title='Full Name'>{user?.firstName} {user?.lastName}</p>
        <p className="userList" title='Email'>✉️<span style={{ marginRight: '10px' }}></span>{user?.email}</p>
        <p className="userList" title='Phone'>📞<span style={{ marginRight: '10px' }}></span>{user?.phone}</p>
        <p className="userList" title='Bio'>📝<span style={{ marginRight: '10px' }}></span>{user?.bio}</p>
        <p className="userList" title='Is Admin ?'>🔐<span style={{ marginRight: '10px' }}></span>{user?.isAdmin ? "Yes" : "No"}</p>
      </div>
      <div className="separatorUserPage"></div>
      <div className='tab-container mb-3'>
        <p className={`tab ${activeTab === 'Adopted' ? 'active' : ''}`} onClick={() => setActiveTab('Adopted')}>Adopted</p>
        <p className={`tab ${activeTab === 'Fostered' ? 'active' : ''}`} onClick={() => setActiveTab('Fostered')}>Fostered</p>
        <p className={`tab ${activeTab === 'Saved' ? 'active' : ''}`} onClick={() => setActiveTab('Saved')}>Saved</p>
      </div>
      <div>
        <div className="pet-cards-container">
          {activeTab === 'Adopted' && (
            adoptedPets.length === 0 ? (<p>{user?.firstName} don't have any adopted pets.</p>) :
              (adoptedPets.map(pet => (<PetCard key={pet._id} pet={pet} />)))
          )}
          {activeTab === 'Fostered' && (fosteredPets.length === 0 ? (<p>{user?.firstName} don't have any fostered pets.</p>) :
            (fosteredPets.map(pet => (<PetCard key={pet._id} pet={pet} />)))
          )}
          {activeTab === 'Saved' && (petDetails.length === 0 ? (<p>{user?.firstName} don't have any saved pets.</p>) :
            (petDetails.map(pet => (<PetCard key={pet._id} pet={pet} />)))
          )}
        </div>
      </div>
    </div>
  )
}

export default UserPage;