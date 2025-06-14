import React, { useState} from 'react';
import './Search.css';
import profile from './profile.png'
import { Button } from 'antd';
import { SearchOutlined }from '@ant-design/icons';

function Search() 
{
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleInputChange = (e) => 
  {
    setSearchQuery(e.target.value);
  };
  
  const handleSearch = () => 
  {
    console.log('Searching for:', searchQuery);
  };

  return (
  <div className="search-page">
    {/* SEARCH BAR */}
    <div className='search-container'>
      <div className='search-bar'>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Type to search . . ."
          className="search-input"
        />
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
        </Button>
      </div>
    </div>

    {/* SEARCH RESULTS */}
    <div className="profile-page">
      <img src={profile} className='profile-picture' />
      <h2 className="username">Name</h2>
      <p className="user-role">Student</p>

      <div className="description-box">
        Description
      </div>

      <div className="reservations-box">
        <strong>Current Reservations:</strong>
        <ul>
          <li> GK302A – June 20, 2025 | 0730 - 1000</li>
          <li> GK302B – July 4, 2025 | 1230 - 1415</li>
          <li> AG1707 – July 21, 2025 | 0900 - 1030</li>
          <li> AG1902 – July 29, 2025 | 1600 - 1830</li>
        </ul>
      </div>
    </div>
  </div>
);

}

export default Search;