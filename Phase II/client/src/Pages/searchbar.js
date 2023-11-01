// SearchBar.js
import React from 'react';
import "./searchbar.css"
const SearchBar = () => {
    return (
        <div class="search-container">
  <input type="text" id="search" placeholder="Search..." onkeypress="search(event)"/>
</div>



    );
};

export default SearchBar;
