import React, { useEffect, useState } from 'react'
import './Search.css'
import { Button, Collapse, Form, InputGroup } from 'react-bootstrap'
import PetCard from '../petCard/petCard'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const Search = () => {
  const [pets, setPets] = useState([]);
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [status, setStatus] = useState('');
  const [weight, setWeight] = useState('');
  const [color, setColor] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setType('');
    setBreed('');
    setStatus('');
    setWeight('');
    setColor('');
    setSearchTerm('');
    setOpen(false);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const searchQuery = {
        searchTerm,
        type,
        breed,
        status,
        weight,
        color,
      }

      for (let key in searchQuery) {
        if (searchQuery[key] === '') {
          delete searchQuery[key];
        }
      }
      setOpen(false);

      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/search`, { params: searchQuery });
      setResultCount(response.data.length);
      setPets(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchType = searchParams.get('type');
    setType(searchType || '');

    const fetchPets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pets/search`, {
          params: { type: searchType },
        });
        setResultCount(response.data.length);
        setPets(response.data);
      } catch (err) {
        console.log('Error fetching pets', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPets();
  }, [location.search])

  return (
    <div className='search-container'>
      <div className='container-search-bar'>
        <InputGroup className="mb-2 input">
          <Form.Control
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className='searchBtn' variant="outline-secondary" onClick={handleSearch}>
            Search
            <svg className='svgSearch' fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
          </Button>
        </InputGroup>
      </div>
      <button
        onClick={() => setOpen(!open)}
        aria-controls="collapse-filters"
        aria-expanded={open}
        className='filterBtn'
      >
        Filters
        {open ? <span> &#11023;</span> : <span> &#11022;</span>}
      </button>

      <Collapse in={open} className="custom-collapse mt-2">
        <div id="collapse-filters" className="filters-container">
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Breed</Form.Label>
            <Form.Control type="text" value={breed} placeholder="Enter breed.." onChange={(e) => setBreed(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Fostered">Fostered</option>
              <option value="Adopted">Adopted</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Weight</Form.Label>
            <Form.Control type="text" value={weight} placeholder="Enter weight.." onChange={(e) => setWeight(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Control as="select" value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Select Color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="brown">Brown</option>
              <option value="gray">Grey</option>
              <option value="golden">Beige</option>
            </Form.Control>
          </Form.Group>
          <button className='resetBtn' onClick={handleReset}>X Reset</button>
        </div>
      </Collapse>
      <div className="searchSeparator"></div>
      <div className='resultCount'>{isLoading ? "Loading..." : `${resultCount} results`}</div>
      <div className='pet-cards-container mt-5'>
        {pets.map(pet => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    </div>
  )
}

export default Search