import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const PageContext = createContext({});

export function PageProvider({ children }) {
  const [page, setPage] = useState(1);

  const value = {
    page,
    setPage,
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

PageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
