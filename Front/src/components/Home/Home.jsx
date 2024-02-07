import React, { useContext } from 'react'
import './Home.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ModalContext } from '../Context/ModalsContext';
import { Link, useNavigate } from 'react-router-dom';
import dog from '../../assets/dog.png'
import cat from '../../assets/cat.png'
import mouse from '../../assets/mouse.png'

const Home = () => {
  const { handleLoginShow, handleSignupShow, isUserLoggedIn, isAdmin } = useContext(ModalContext);
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const navigate = useNavigate();

  return (
    <div>
      <h1 className='mt-5 fw-bold'>Welcome {isUserLoggedIn && firstName ? <span className='name fst-italic'>{firstName} {lastName}</span> : ""} !</h1>
      <h3 className='firsth3'>We connect loving homes with adorable pets waiting for adoption</h3>

      {!isUserLoggedIn && !isAdmin() && (
        <div className="card-container">
          <Card className="card text-center mt-5">
            <Card.Body>
              <Card.Title>Access your account !</Card.Title>
              <Card.Text className='text'>
                To use our services please login.
              </Card.Text>
              <Button variant="secondary" className='button' onClick={handleLoginShow}>Login</Button>{' '}
              <div className="text-center signup">
                Need an account?  <button className="link-style" onClick={handleSignupShow}>Sign up</button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      {isUserLoggedIn && !isAdmin() && (
        <div className="card-container">
          <Card className="card text-center mt-5">
            <Card.Body>
              <Card.Title>Adoption area</Card.Title>
              <Card.Text className='text'>
                To access your adoption area click here.
              </Card.Text>
              <Button variant="secondary" className='button' onClick={() => navigate('/Mypets')}>My pets</Button>
            </Card.Body>
          </Card>
        </div>
      )}
      {isAdmin() && (
        <div className="card-container">
          <Card className="card text-center mt-5">
            <Card.Body>
              <Card.Title>Manage website</Card.Title>
              <Card.Text className='text'>
                To access the dashboard click here.
              </Card.Text>
              <Button variant="secondary" className='button' onClick={() => navigate('/Dashboard')}>Dashboard</Button>
            </Card.Body>
          </Card>
        </div>
      )}

      <div className="separator"></div>
      <h3 className='secondh3'>What are you looking for ?</h3>

      <div className="icon-container mt-3">
        <div className="icon-circle">
          <Link to="/Search?type=Dog">
            <div className="icon-label">DOG</div>
            <div className="icon">
              <img src={dog} alt="dog" />
            </div>
          </Link>
        </div>

        <div className="icon-circle">
          <Link to="/Search?type=Cat">
            <div className="icon-label">CAT</div>
            <div className="icon">
              <img src={cat} alt="cat" />
            </div>
          </Link>
        </div>

        <div className="icon-circle">
          <Link to="/Search?type=Other">
            <div className="icon-label">OTHER</div>
            <div className="icon">
              <img src={mouse} alt="other" />
            </div>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home