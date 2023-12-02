import React, { useContext, useState, useEffect } from 'react';
import { DarkModeContext } from "../../../context/darkModeContext";
import axios from 'axios';
import './SearchBar.scss';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const SearchBar = ({ onSelect, onSort: propOnSort }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [query, setQuery] = useState('');
  // const [postData, setPostData] = useState([]);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);

  const onSort = (option) => {
    setSelectedSortOption(option);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (query.trim() === '') {
          setAuthorSuggestions([]); // Clear author suggestions when query is empty
          setKeywordSuggestions([]); // Clear keyword suggestions when query is empty
          return;
        }

        // Fetch author suggestions
        const authorResponse = await axios.get(`http://localhost:3001/search/authors?q=${query}`);
        setAuthorSuggestions(authorResponse.data);

        // Fetch keyword suggestions
        const keywordResponse = await axios.get(`http://localhost:3001/search/keywords?q=${query}`);
        setKeywordSuggestions(keywordResponse.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    // Fetch suggestions when the query changes
    fetchSuggestions();
  }, [query]);

  useEffect(() => {
    propOnSort(selectedSortOption);
  }, [selectedSortOption, propOnSort]);

  return (
    <div className='search'>
      <SearchOutlined />
      <div className={`search-container ${darkMode ? 'dark-mode' : ''}`}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="suggestion-section">
          <ul>
            {authorSuggestions.map((author) => (
              <li key={author._id} onClick={() => {
                onSelect("author", author._id);
                setQuery('');
              }}>
                <div className="suggestion-item">
                  {author.username} <div className="suggestion-type">Author</div>
                </div>
              </li>
            ))}
            {keywordSuggestions.map((keyword) => (
              <li key={keyword} onClick={() => {
                onSelect("keyword", keyword);
                setQuery('');
              }}>
                <div className="suggestion-item">
                  #{keyword} <div className="suggestion-type">Tag</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sort-dropdown">
        <TuneOutlinedIcon 
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          style={{ cursor: 'pointer' }}
        />
        {sortDropdownOpen && (
          <div className="sort-options">
            <label>
              <input
                type="radio"
                value="asc"
                checked={selectedSortOption === 'asc'}
                onChange={(e) => onSort(e.target.value)}
              />
              Sort: Likes (Least to Most)
            </label>
            <label>
              <input
                type="radio"
                value="desc"
                checked={selectedSortOption === 'desc'}
                onChange={(e) => onSort(e.target.value)}
              />
              Sort: Likes (Most to Least)
            </label>
            <label>
              <input
                type="radio"
                value="imageTrue"
                checked={selectedSortOption === 'imageTrue'}
                onChange={(e) => onSort(e.target.value)}
              />
              Filter: Images
            </label>
            <label>
              <input
                type="radio"
                value="imageFalse"
                checked={selectedSortOption === 'imageFalse'}
                onChange={(e) => onSort(e.target.value)}
              />
              Filter: No Images
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

