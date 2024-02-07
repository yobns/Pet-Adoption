import React, { useContext, useState } from 'react';
import './petCard.css';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../Context/ModalsContext';
import EditPetModal from '../EditPetModal/EditPetModal';
import axios from 'axios';

const PetCard = ({ pet }) => {
    const navigate = useNavigate();
    const { isAdmin } = useContext(ModalContext);
    const [showEditModal, setShowEditModal] = useState(false);
    const [petInfo, setPetInfo] = useState(pet);

    const handleViewMore = () => {
        navigate(`/PetPage/${pet._id}`)
    }

    const updatedPet = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/${petInfo._id}`);
            console.log(response.data)
            setPetInfo(response.data);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error fetching updated pet data', error);
        }
    };

    return (
        <div className="pet-card">
            <img src={petInfo.image} alt={petInfo.name} className="pet-image" onClick={handleViewMore} />
            <div className="pet-info">
                <h3 className="pet-name">{petInfo.name}</h3>
                <p className="pet-type">{petInfo.type}</p>
                <p className="pet-bio">{petInfo.bio}</p>
            </div>

            <div className="pet-actions">
                {isAdmin() && <button className="btn-adopt" onClick={() => setShowEditModal(true)}>Edit</button>}
                <button className="btn-view" onClick={handleViewMore}>More..</button>
            </div>

            {showEditModal && (
                <EditPetModal
                    pet={petInfo}
                    close={() => setShowEditModal(false)}
                    updatedPet={updatedPet}
                />
            )}
        </div>
    );
}

export default PetCard;