import PeopleShowcase from './components/PeopleShowcase';

import { PeopleInfoProvider } from './context/PeopleContext';
import { PageProvider } from './context/PageContext';

import './styles/global.scss';

function App() {
  return (
    <PeopleInfoProvider>
      <PageProvider>
        <div className="App">
          <div className="base-container">
            <div className="base-showcase"></div>

            <div className="base"></div>
          </div>

          <div className="lateral-showcase-container">
            <div className="lateral-showcase">
              <PeopleShowcase />
            </div>

            <div className="element">
              <span>by me</span>
            </div>
          </div>
        </div>
      </PageProvider>      
    </PeopleInfoProvider>
  );
}

export default App;
