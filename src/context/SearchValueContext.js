import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const SearchValueContext = createContext({});

export function SearchValueProvider({ children }) {
  const [searchValue, setSearchValue] = useState('');

  const value = {
    searchValue,
    setSearchValue,
  };

  return (
    <SearchValueContext.Provider value={value}>
      {children}
    </SearchValueContext.Provider>
  );
}

SearchValueProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
