import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png'
import { useLocation } from 'react-router-dom';
import { ModalContext } from '../Context/ModalsContext';
import { Button } from 'react-bootstrap';

const NavBar = () => {
  const location = useLocation();
  const { handleLoginShow, handleSignupShow, isUserLoggedIn, isAdmin } = useContext(ModalContext);

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : 'btn-bar';
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar mb-5">
      <Container className='navContainer'>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="200"
            height="70"
            className="align-center logo"
          />

        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" style={{ zIndex: 10 }}>
          <Nav className="me-auto link">
            {!isUserLoggedIn && (
              <>
                <Nav.Link href="/" className={`${isActive('/')} homeLink`}>Home</Nav.Link>
                <button className="nav-link-style btn-bar" onClick={handleLoginShow}>Login</button>
                <button className="nav-link-style btn-bar" onClick={handleSignupShow}>Signup</button>
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Nav.Link href="/" className={`${isActive('/')} homeLink`}>Home</Nav.Link>
                {!isAdmin() && (<Nav.Link href="/Mypets" className={isActive('/Mypets')}>My Pets</Nav.Link>)}
                {isAdmin() && <Nav.Link href="/Add" className={isActive('/Add')}>Add Pet</Nav.Link>}
                {isAdmin() && <Nav.Link href="/Dashboard" className={isActive('/Dashboard')}>Dashboard</Nav.Link>}
                <Nav.Link href="/Profile" className={isActive('/Profile')}>Profile</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Link href="/Search" className={`${isActive('/Search')} buttonSearchSmall`}>Search..</Nav.Link>
            <Nav.Link href="/Search">
              <Button variant="outline-secondary buttonSearch">
                <svg className="feather feather-search" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
                Search...
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar