import React, { useState, useEffect } from 'react';
import './EditPetModal.css'
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const EditPetModal = ({ pet, close, updatedPet }) => {
    const [petData, setPetData] = useState({ ...pet });

    useEffect(() => {
        setPetData({ ...pet });
    }, [pet]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setPetData({ ...petData, [name]: checked });
        } else {
            setPetData({ ...petData, [name]: value });
        }
    }

    const handleStatus = (event) => {
        setPetData({ ...petData, status: event.target.value });
    }

    const handleImage = (event) => {
        setPetData({ ...petData, image: event.target.files[0] });
    }

    const handleEditPet = async () => {
        try {
            const updatedPetData = new FormData();
            Object.keys(petData).forEach(key => {
                updatedPetData.append(key, petData[key]);
            })

            await axios.put(`${process.env.REACT_APP_SERVER_URL}/pets/${pet._id}`, updatedPetData, {
                headers: {
                    'x-auth-token': localStorage.getItem('userToken'),
                    'Content-Type': 'multipart/form-data',
                },
            })
            close();
            updatedPet();
        } catch (error) {
            console.error('Error updating pet', error);
        }
    }

    return (
        <Modal show={true} onHide={close} centered>
            <Modal.Header closeButton>
                <Modal.Title className='editModalTitle'>Edit Pet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Type</Form.Label>
                        <Form.Control type="text" name="type" value={petData.type} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Breed</Form.Label>
                        <Form.Control type="text" name="breed" value={petData.breed} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Name</Form.Label>
                        <Form.Control type="text" name="name" value={petData.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Adoption Status</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                label="Adopted"
                                name="status"
                                value="Adopted"
                                onChange={handleStatus}
                                checked={petData.status === "Adopted"}
                            />
                            <Form.Check
                                type="radio"
                                label="Fostered"
                                name="status"
                                value="Fostered"
                                onChange={handleStatus}
                                checked={petData.status === "Fostered"}
                            />
                            <Form.Check
                                type="radio"
                                label="Available"
                                name="status"
                                value="Available"
                                onChange={handleStatus}
                                checked={petData.status === "Available"}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Height</Form.Label>
                        <Form.Control type="number" name="height" value={petData.height} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Weight</Form.Label>
                        <Form.Control type="number" name="weight" value={petData.weight} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Color</Form.Label>
                        <Form.Control type="text" name="color" value={petData.color} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Bio</Form.Label>
                        <Form.Control type="text" name="bio" value={petData.bio} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Hypoallergenic</Form.Label>
                        <Form.Check type='checkbox' name='hypoallergenic' onChange={handleChange} checked={petData.hypoallergenic} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Restrictions</Form.Label>
                        <Form.Control type="text" name="restrictions" value={petData.restrictions} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='editModalLabel'>Image</Form.Label>
                        <Form.Control type='file' name='image' onChange={handleImage} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='editModalButton' onClick={handleEditPet}>Update</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditPetModal;
