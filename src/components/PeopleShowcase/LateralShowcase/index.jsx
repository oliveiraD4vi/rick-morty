import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { notification } from 'antd';

import { PageContext } from '../../../context/PageContext';
import { SearchValueContext } from '../../../context/SearchValueContext';

import PeopleCard from './Card';
import axios from 'axios';

import './style.scss';

export default function LateralShowcase() {
	const [people, setPeople] = useState([]);
	const { page } = useContext(PageContext);
	const { searchValue } = useContext(SearchValueContext);

	const openNotification = () => {
		notification.open({
			message: 'Erro',
			description:
				'Algo deu errado',
		});
	};

	useEffect(() => {
    async function fecthData() {
      try {
        const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);

        setPeople(data.results);
      } catch (error) {
        openNotification();
      }
    }

    fecthData();
  }, [page]);

	function filterPeople(person) {
		if (searchValue === '') return person;
		else if (
			person.name.toLowerCase().includes(searchValue.toLowerCase())
		) return person;
	}

	return (
		<div className="people-lateral-showcase">
			{
				people.filter(filterPeople).map((person) => (
					<PeopleCard 
						key={uuidv4()}
						name={person.name}
						id={person.id}
						image={person.image}
					/>
				))
			}
		</div>
	);
}
