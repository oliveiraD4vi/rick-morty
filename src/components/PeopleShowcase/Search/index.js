import { Input, Space } from 'antd';

import './style.scss';

export default function Search() {
	const { Search } = Input;
	const onSearch = value => console.log(value);

	return (
		<div className="people-search">
			<Space direction="vertical">
				<Search 
					placeholder="character search" 
					allowClear 
					onSearch={onSearch} 
					style={{ width: 200 }}
				/>
			</Space>
		</div>
	);
}