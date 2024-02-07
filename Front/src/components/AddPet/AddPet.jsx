import React, { useEffect, useState } from 'react';
import './AddPet.css';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../Context/ModalsContext';
import { useContext } from 'react';

const AddPet = () => {
    const navigate = useNavigate();
    const { isAdmin } = useContext(ModalContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [petData, setPetData] = useState({
        type: '',
        name: '',
        status: 'Available',
        height: '',
        weight: '',
        color: '',
        bio: '',
        hypoallergenic: false,
        restrictions: '',
        breed: '',
    })

    useEffect(() => {
        if (!isAdmin())
            navigate('/');
    })

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox')
            setPetData({ ...petData, [name]: checked });
        else
            setPetData({ ...petData, [name]: value });
    }

    const handleImage = (e) => {
        setPetData({ ...petData, image: e.target.files[0] });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { type, name, status, height, weight, color, bio, breed, image } = petData;

        if (!type || !name || !status || !height || !weight || !color || !bio || !breed || !image)
            return setErrorMessage('All fields are required');

        const formData = new FormData();
        Object.keys(petData).forEach(key => {
            formData.append(key, petData[key]);
        })

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/pets`, formData, {
                headers: {
                    'x-auth-token': localStorage.getItem('userToken'),
                    'Content-Type': 'multipart/form-data',
                },
            })
            navigate('/')
            alert('Pet added to db')
            console.log(response.data);
        } catch (error) {
            console.error('Error adding pet', error);
            setErrorMessage('Error adding pet');
        }
    }

    return (
        <div className='AddPet'>
            <h1 className="mt-4 mb-4">Add Pet</h1>
            <div className='form-container'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Type <span className="required-star">*</span> </Form.Label>
                        <Form.Control type='text' name='type' placeholder='Enter type' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Breed<span className="required-star">*</span></Form.Label>
                        <Form.Control type='text' name='breed' placeholder='Enter breed' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Name <span className="required-star">*</span> </Form.Label>
                        <Form.Control type='text' name='name' placeholder='Enter name' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Height <span className="required-star">*</span></Form.Label>
                        <Form.Control type='number' name='height' placeholder='Enter height' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Weight<span className="required-star">*</span></Form.Label>
                        <Form.Control type='number' name='weight' placeholder='Enter weight' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Color<span className="required-star">*</span></Form.Label>
                        <Form.Control type='text' name='color' placeholder='Enter color' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Bio<span className="required-star">*</span></Form.Label>
                        <Form.Control as='textarea' rows={3} name='bio' placeholder='Enter bio' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Check type='checkbox' label='Hypoallergenic' name='hypoallergenic' onChange={(e) => setPetData({ ...petData, hypoallergenic: e.target.checked })} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Dietary Restrictions</Form.Label>
                        <Form.Control type='text' name='restrictions' placeholder='Enter dietary restrictions' onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Image<span className="required-star">*</span></Form.Label>
                        <Form.Control type='file' name='image' onChange={handleImage} />
                    </Form.Group>
                    <div className="text-center">
                        <div className='text-danger'>{errorMessage}</div>
                        <Button variant='primary' type='submit' className='button mt-3 mb-3' onClick={handleSubmit}>Add Pet</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default AddPet;