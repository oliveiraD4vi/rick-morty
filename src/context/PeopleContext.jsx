import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const PeopleInfoContext = createContext({});

export function PeopleInfoProvider({ children }) {
  const [peopleId, setPeopleId] = useState(1);

  const value = {
    peopleId,
    setPeopleId,
  };

  return (
    <PeopleInfoContext.Provider value={value}>
      {children}
    </PeopleInfoContext.Provider>
  );
}

PeopleInfoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
