import PeopleShowcase from './components/PeopleShowcase';

import './styles/global.scss';

function App() {
  return (
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
  );
}

export default App;
