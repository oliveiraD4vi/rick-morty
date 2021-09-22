import PeopleShowcase from './components/PeopleShowcase';
import PeopleInfoShowcase from './components/PeopleInfoShowcase';

import { MenuOutlined } from '@ant-design/icons/lib/icons';

import { PeopleInfoProvider } from './context/PeopleContext';
import { PageProvider } from './context/PageContext';

import './styles/global.scss';

function App() {
  return (
    <PeopleInfoProvider>
      <PageProvider>
        <div className="App">
          <div className="base-container">
            <div className="base-showcase">
              <div className="identifier">
                <h1>Rick and Morty</h1>
                <MenuOutlined />
              </div>
              <PeopleInfoShowcase />
            </div>

            <div className="base"></div>
          </div>

          <div className="lateral-showcase-container">
              <PeopleShowcase />
          </div>
        </div>
      </PageProvider>      
    </PeopleInfoProvider>
  );
}

export default App;
