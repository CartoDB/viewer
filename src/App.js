import {
  BrowserRouter as Router,
  HashRouter,
  Route
} from "react-router-dom";

import './App.css';
// import logo from './logo.svg';

import Home from './views/home';

function App() {

  return (
    <Router>
      <div>
        <HashRouter>
          <Route path="/user/:username/:type">
            <Home />
          </Route>
        </HashRouter>
      </div>
    </Router>
  );
}

export default App;
