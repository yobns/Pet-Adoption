import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profile/Profile.jsx';
import Search from './components/Search/Search.jsx';
import MyPets from './components/MyPets/MyPets.jsx';
import Error404 from './components/Error404.jsx';
import { ModalProvider } from './components/Context/ModalsContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AddPet from './components/AddPet/AddPet.jsx';
import PetPage from './components/PetPage/PetPage.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import UserPage from './components/UserPage/UserPage.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  return (
    <ModalProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Mypets" element={<PrivateRoute><MyPets /></PrivateRoute>} />
          <Route path="/PetPage/:id" element={<PetPage />} />
          <Route path="/Add" element={<AddPet />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/UserPage/:id" element={<UserPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
      <Footer/>
    </ModalProvider>
  );
}

export default App;
