import { useContext } from 'react';
import { Input, Space } from 'antd';

import { SearchValueContext } from '../../../context/SearchValueContext';

import './style.scss';

export default function Search() {
	const { Search } = Input;
	const { setSearchValue } = useContext(SearchValueContext);
	const onSearch = value => setSearchValue(value);

	return (
		<div className="people-search">
			<Space direction="vertical">
				<Search 
					placeholder="character search"
					allowClear 
					onSearch={onSearch}
				/>
			</Space>
		</div>
	);
}
