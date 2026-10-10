import { useContext, useEffect, useState } from 'react';
import { notification } from 'antd';
import { PeopleInfoContext } from '../../context/PeopleContext';
import { 
	MinusCircleOutlined, 
	PlusCircleOutlined,  
	CloseCircleOutlined
} from '@ant-design/icons/lib/icons';

import axios from 'axios';

import './style.scss';

export default function PeopleInfoShowcase() {
	const { peopleId } = useContext(PeopleInfoContext);
	const [person, setPerson] = useState([]);
	const [location, setLocation] = useState([]);
	const [status, setStatus] = useState('Alive');

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
        const { data } = await axios.get(`https://rickandmortyapi.com/api/character/${peopleId}`);

        setPerson(data);
				setLocation(data.location);
				setStatus(data.status);
      } catch (error) {
				openNotification();
      }
    }
		
    fecthData();
  }, [peopleId]);
	
	return (
		<div className="people-info-container">
			<div className="people-info-showcase">
				<div className="header">
					<CloseCircleOutlined />
					<PlusCircleOutlined />
					<MinusCircleOutlined />
				</div>

				<div className="content">
					<div className="content-left">
						<div className="content-avatar">
							<img alt="avatar" src={person.image}></img>
						</div>
					</div>

					<div className="content-right">
						<div className="content-name">
							<h3>{person.name}</h3>
						</div>

						<div className="content-info">
							<h4>Specie: {person.species}</h4>
							<h4>Gender: {person.gender}</h4>
							<h4>Origin: {location.name}</h4>

							{status.toLowerCase() === 'alive' ? (
									<h5 style={{ color: "green" }} >{status}</h5>
								) : (
									<h5 style={{ color: "red" }} >{status}</h5>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}