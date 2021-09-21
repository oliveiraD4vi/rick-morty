import { useEffect, useState } from 'react';
import { RightOutlined, LeftOutlined} from '@ant-design/icons/lib/icons';
import { v4 as uuidv4 } from 'uuid';

import PeopleCard from './Card';
import axios from 'axios';

import './style.scss';

export default function LateralShowcase() {
	const [people, setPeople] = useState([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
    async function fecthData() {
      try {
        const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);

        setPeople(data.results);
      } catch (error) {
        console.log('error');
      }
    }

    fecthData();
  }, [page]);

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
		<div className="people-lateral-showcase">
			{
				people.map((person) => (
					<PeopleCard name={person.name} key={uuidv4()} />
				))
			}
			<div className="people-page">
				<div className="page-previous" onClick={() => setPageNumber('p')}>
					<LeftOutlined />
				</div>
				
				<div className="page-next" onClick={() => setPageNumber('n')}>
					<RightOutlined />
				</div>
			</div>
		</div>
	);
}