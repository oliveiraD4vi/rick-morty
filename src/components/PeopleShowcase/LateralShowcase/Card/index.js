import PropTypes from 'prop-types';

import './style.scss';

export default function PeopleCard({ name }) {
	return (
		<div className="people-card">
			<h3>{name}</h3>
		</div>
	);
}

PeopleCard.propTypes = {
  name: PropTypes.string
};

PeopleCard.defaultProps = {
  name: 'name'
};
