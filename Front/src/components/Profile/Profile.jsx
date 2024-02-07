import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ModalContext } from '../Context/ModalsContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { handleUserLogout } = useContext(ModalContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${userId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('userToken'),
          },
        })
        const userData = response.data;

        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          password: '',
          confirmPassword: '',
        })
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    }
    loadUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('userId');
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !phone)
      return setErrorMessage('All fields are required');

    if (password !== confirmPassword)
      return setErrorMessage("Passwords don't match");

    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${userId}`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('userToken'),
        },
      })
      localStorage.setItem('firstName', formData.firstName);
      localStorage.setItem('lastName', formData.lastName);
      navigate('/');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      if (error.response)
        setErrorMessage(error.response.data);
    }
  }

  const logoutAndRedirect = () => {
    handleUserLogout();
    navigate('/');
  }

  return (
    <div>
      <h1 className='mb-3'><span className='titleMy'>My</span> Profile</h1>
      <div className='form-container'>
        <Form onSubmit={handleUpdateProfile}>
          <Form.Group className='mb-3' controlId='FirstName'>
            <Form.Label>
              First name<span className="required-star">*</span>
            </Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter first name'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='LastName'>
            <Form.Label>
              Last name<span className="required-star">*</span>
            </Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter last name'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Email'>
            <Form.Label>
              Email<span className="required-star">*</span>
            </Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Phone'>
            <Form.Label>
              Phone<span className="required-star">*</span>
            </Form.Label>
            <Form.Control
              type='tel'
              placeholder='Enter phone number'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-5' controlId='Bio'>
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              maxLength={65}
              name='bio'
              value={formData.bio}
              onChange={handleChange}
              placeholder='Tell us about yourself'
            />
            <Form.Text className="text-muted">
              {65 - formData.bio.length}/65 characters
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3' controlId='Password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-4' controlId='PasswordConfirm'>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-center">
            <div className='text-danger mb-1'>{errorMessage}</div>
            <Button variant='secondary' type='submit' className='button mb-3'>
              Update
            </Button>
          </div>
        </Form>
      </div>

      <div className="separator"></div>

      <h3>Logout here 👋</h3>
      <Button variant='secondary' className='mb-5 buttonLogout' onClick={logoutAndRedirect}>
        Logout
      </Button>
    </div>
  );
}

export default Profile;
