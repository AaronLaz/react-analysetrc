import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Upload from "./components/Upload";
import List from "./components/List";
import DisplayView from "./components/DisplayView"
import Report from "./components/Report";
import NotFound from "./components/NotFound";
import ServerError from "./components/ServerError";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/" component={List} />
            <Route exact path="/detail/:file" component={DisplayView} />
            <Route exact path="/report/:file" component={Report} />
            <Route exact path="/error" component={ServerError} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}


export default App;