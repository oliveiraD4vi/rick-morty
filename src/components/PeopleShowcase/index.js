import { useContext } from 'react';
import { RightOutlined, LeftOutlined} from '@ant-design/icons/lib/icons';
import { PageContext } from '../../context/PageContext';

import Search from './Search';
import LateralShowcase from './LateralShowcase';

import './style.scss';

export default function PeopleShowcase() {
	const { page, setPage } = useContext(PageContext);

  const next = () => {
    if (page < 34) setPage(page + 1);
  }

  const previous = () => {
    if (page > 1) setPage(page - 1);
  }

	return (
		<div className="people-showcase">
			<Search />

      <div className="showcase-content">
			  <LateralShowcase />
      </div>

			<div className="people-page">
				<button className="page-previous" onClick={() => previous()}><LeftOutlined /></button>
				<h4 className="page-number">{page}</h4>
				<button className="page-next" onClick={() => next()}><RightOutlined /></button>
			</div>
		</div>
	);
}