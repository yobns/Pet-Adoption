import React, { createContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './ModalContext.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem('userToken'));
    const navigate = useNavigate();

    const handleLoginClose = () => setShowLogin(false);
    const handleLoginShow = () => setShowLogin(true);

    const handleSignupClose = () => {
        setShowSignup(false);
        setErrorMessage('');
    }
    const handleSignupShow = () => setShowSignup(true);

    const toggleModal = (modal) => {
        if (modal === "login") {
            setErrorMessage('');
            setShowLogin(true);
            setShowSignup(false);
        } else if (modal === "signup") {
            setErrorMessage('');
            setShowLogin(false);
            setShowSignup(true);
        }
    }

    const handleUserLogout = () => {
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        setIsUserLoggedIn(false);
    }

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        const email = event.currentTarget.elements.email.value;
        const password = event.currentTarget.elements.password.value;
        const userData = { email: email, password: password };

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, userData);
            if (response.data.token) {
                console.log(response)
                localStorage.setItem('firstName', response.data.firstName);
                localStorage.setItem('lastName', response.data.lastName);
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('isAdmin', response.data.isAdmin);
                setIsUserLoggedIn(true);
                handleLoginClose();
                navigate('/')
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Invalid email or password');
        }
    }

    const handleSubmitSignup = async (event) => {
        event.preventDefault();
        const formData = {
            firstName: event.currentTarget.elements.FirstName.value,
            lastName: event.currentTarget.elements.LastName.value,
            email: event.currentTarget.elements.Email.value,
            phone: event.currentTarget.elements.Phone.value,
            password: event.currentTarget.elements.Password.value,
            confirmPassword: event.currentTarget.elements.PasswordConfirm.value,
            bio: ''
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, formData);
            console.log(response.data);
            toggleModal("login");
        } catch (error) {
            if (error.response)
                setErrorMessage(error.response.data);
            else
                setErrorMessage("Error. Try again later.");
        }
    }

    const isAdmin = () => {
        return localStorage.getItem('isAdmin') === 'true';
    }

    const LoginModal = (
        <Modal show={showLogin} onHide={handleLoginClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {<Form className='LogInForm' onSubmit={handleSubmitLogin}>
                    <Form.Group className='mb-3' controlId='Email'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name='email' type='email' placeholder='Enter email' />
                    </Form.Group>
                    <Form.Group className='mb-4' controlId='Password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name='password' type='password' placeholder='Password' />
                    </Form.Group>

                    <div className="text-center">
                        {errorMessage && <div className="text-danger mb-1">{errorMessage}</div>}
                        <Button variant='primary' type='submit' className='buttonModal mb-3' >Log In</Button>
                    </div>
                </Form>}

                <div className="text-center">
                    Need an account?  <button className="link-style" onClick={() => toggleModal("signup")}>Sign up</button>
                </div>
            </Modal.Body>
        </Modal>
    )

    const SignupModal = (
        <Modal show={showSignup} onHide={handleSignupClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Signup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitSignup}>
                    <Form.Group className='mb-3' controlId='FirstName'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter first name' />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='LastName'>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter last name' />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='Email'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' />
                    </Form.Group>

                    <Form.Group className='mb-5' controlId='Phone'>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type='tel' placeholder='Enter phone number' />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='Password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Password' />
                    </Form.Group>
                    <Form.Group className='mb-4' controlId='PasswordConfirm'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder='Confirm Password' />
                    </Form.Group>

                    <div className="text-center">
                        {errorMessage && <div className="text-danger">{errorMessage}</div>}
                        <Button variant='primary' type='submit' className='buttonModal mb-3 mt-3'>Sign Up</Button>
                    </div>
                </Form>

                <div className="text-center">
                    Already have an account? <button className="link-style" onClick={() => toggleModal("login")}>Log In</button>
                </div>
            </Modal.Body>
        </Modal>
    )

    return (
        <ModalContext.Provider value={{ handleLoginShow, handleLoginClose, handleSignupShow, handleSignupClose, isUserLoggedIn, handleUserLogout, isAdmin }}>
            {children}
            {showLogin && LoginModal}
            {showSignup && SignupModal}
        </ModalContext.Provider>
    )
}