import React from "react";
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Upload from "./Upload";
import List from "./List";

class App extends React.Component {


  render() {
    return (
      <div className="app">
        <Router>
            <Route exact path={['/', '/upload']}>
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/" component={List} />
            </Route>
        </Router>
      </div>
    );
  }
}


export default App;