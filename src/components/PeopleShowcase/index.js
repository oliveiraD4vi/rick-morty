import Search from './Search';
import LateralShowcase from './LateralShowcase';

import './style.scss';

export default function PeopleShowcase() {
	return (
		<div className="people-showcase">
			<Search />

			<LateralShowcase />
		</div>
	);
}