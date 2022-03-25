import { useContext } from 'react';
import { RightOutlined, LeftOutlined} from '@ant-design/icons/lib/icons';
import { PageContext } from '../../context/PageContext';

import Search from './Search';
import LateralShowcase from './LateralShowcase';

import './style.scss';

export default function PeopleShowcase() {
	const { page, setPage } = useContext(PageContext);

	function setPageNumber(e) {
		if (e === 'n') {
			if (page === 34) {
				setPage(page);
			} else if (page < 34) {
				setPage(page + 1);
			}
		} else {
			if (page === 1) {
				setPage(page);
			} else if (page > 1){
				setPage(page-1);
			}
		}
	}

	return (
		<div className="people-showcase">
			<Search />

      <div className="showcase-content">
			  <LateralShowcase />
      </div>

			<div className="people-page">
				<div className="page-previous" onClick={() => setPageNumber('p')}>
					<LeftOutlined />
				</div>

				<div className="page-number">
					<h4>{page}</h4>
				</div>
				
				<div className="page-next" onClick={() => setPageNumber('n')}>
					<RightOutlined />
				</div>
			</div>
		</div>
	);
}