import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { useContext } from 'react';
import { ModalContext } from '../Context/ModalsContext';
import { useNavigate } from 'react-router-dom';
import UsersList from './UsersList';
import PetsList from './PetsList';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useContext(ModalContext);
  const [userCount, setUserCount] = useState(null);
  const [petCount, setPetCount] = useState(null);

  useEffect(() => {
    if (!isAdmin())
      navigate('/');
  });

  return (
    <div>
      <h1><span className='titleMyDashboard'>My</span>Dashboard</h1>
      <div className='counts'>
        <span title="Total users" style={{ cursor: 'default' }}>👤 {userCount}</span>
        <span>•</span>
        <span title="Total pets" style={{ cursor: 'default' }}>🐶 {petCount}</span>
      </div>
      <UsersList setUserCount={setUserCount} />
      <PetsList setPetCount={setPetCount} />
    </div>
  )
}

export default Dashboard