import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PetCard from '../petCard/petCard';
import './MyPets.css'

const MyPets = () => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [fosteredPets, setFosteredPets] = useState([]);
  const [savedPets, setSavedPets] = useState([]);
  const [petDetails, setPetDetails] = useState([]);
  const userId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('Adopted');

  useEffect(() => {
    const fetchAdoptedAndFosteredPets = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/searchAll`);
        const allPets = res.data;
        const adopted = allPets.filter(pet => pet.adoptedBy === userId);
        const fostered = allPets.filter(pet => pet.fosteredBy === userId);
        setAdoptedPets(adopted);
        setFosteredPets(fostered);
      } catch (err) {
        console.error('Error fetching adopted and fostered pets', err);
      }
    }
    const fetchSavedPets = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${userId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('userToken'),
          },
        });
        console.log(res.data)
        const saved = res.data.savedPets;
        console.log(res.data.savedPets)
        setSavedPets(saved);
      } catch (err) {
        console.error('Error fetching adopted and fostered pets', err);
      }
    }
    fetchSavedPets();
    fetchAdoptedAndFosteredPets();
  }, [userId]);

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

  return (
    <div className='myPets'>
      <h1 className='mb-3'><span className='titleMyPets'>My</span> Pets</h1>
      <div className='tab-container'>
        <p className={`tab ${activeTab === 'Adopted' ? 'active' : ''}`} onClick={() => setActiveTab('Adopted')}>Adopted</p>
        <p className={`tab ${activeTab === 'Fostered' ? 'active' : ''}`} onClick={() => setActiveTab('Fostered')}>Fostered</p>
        <p className={`tab ${activeTab === 'Saved' ? 'active' : ''}`} onClick={() => setActiveTab('Saved')}>Saved</p>
      </div>
      <div className="separatorMyPets"></div>
      {(adoptedPets.length > 0 || fosteredPets.length > 0) && <p className='mt-4 adminContact'>An admin will contact you ⏳</p>}
      <div>
        <div className="pet-cards-container mt-5 mb-5">
          {activeTab === 'Adopted' && (adoptedPets.length === 0 ? (<p>You don't have any adopted pets.</p>) :
            (adoptedPets.map(pet => (<PetCard key={pet._id} pet={pet} />)))
          )}
          {activeTab === 'Fostered' && (
            fosteredPets.length === 0 ? (<p>You don't have any fostered pets.</p>) : (fosteredPets.map(pet => (<PetCard key={pet._id} pet={pet} />)))
          )}
          {activeTab === 'Saved' && (
            petDetails.length === 0 ? (<p>You don't have any saved pets.</p>) : (petDetails.map(pet => (<PetCard key={pet._id} pet={pet} />)))
          )}
        </div>
      </div>
    </div>
  )
}

export default MyPets;