import React, { useContext } from 'react'
import './Footer.css'
import image from '../../assets/logo.png'
import { ModalContext } from '../Context/ModalsContext';

const Footer = () => {
    const { isUserLoggedIn, isAdmin } = useContext(ModalContext);

    return (
        <footer className="py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="d-flex flex-column align-items-center">
                            <img
                                src={image}
                                alt="Logo"
                                className="img-fluid mb-2"
                                style={{ width: '10rem' }}
                            />
                            <p className="text-center text-secondary">We connect loving homes with adorable pets waiting for adoption</p>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <h5 className='linkStyle'>Links</h5>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="/" className="text-secondary">Home</a>
                                    </li>
                                    <li>
                                        <a href="/search" className="text-secondary">Search</a>
                                    </li>
                                    {isUserLoggedIn && !isAdmin() && (<li><a href="/myPets" className="text-secondary">My Pets</a></li>)}
                                    {isUserLoggedIn && <li><a href="/profile" className="text-secondary">Profile</a></li>}
                                    {isAdmin() && (<>
                                        <li><a href="/dashboard" className="text-secondary">Dashboard</a></li>
                                        <li><a href="/add" className="text-secondary">Add Pet</a></li>
                                    </>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer