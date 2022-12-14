import React from "react";
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Upload from "./Upload";
import List from "./List";
import DisplayView from "./DisplayView"

class App extends React.Component {


  render() {
    return (
      <div className="app">
        <Router>
          <Route exact path={['/', '/upload', '/detail/:file']}>
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/" component={List} />
            <Route exact path="/detail/:file" component={DisplayView} />
          </Route>
        </Router>
      </div>
    );
  }
}


export default App;