import { useContext } from 'react';
import { PeopleInfoContext } from '../../../../context/PeopleContext';

import PropTypes from 'prop-types';

import './style.scss';

export default function PeopleCard({ name, id }) {
	const { setPeopleId } = useContext(PeopleInfoContext);

	return (
		<div className="people-card" onClick={() => setPeopleId(id)}>
			<h3>{name}</h3>
		</div>
	);
}

PeopleCard.propTypes = {
  name: PropTypes.string,
	id: PropTypes.number.isRequired
};

PeopleCard.defaultProps = {
  name: 'name'
};
