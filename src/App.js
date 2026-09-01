
import './App.css';

import React, { Component } from 'react'
import Navbar from './components/Navbar';
import News from './components/News';
import { Routes, Route } from "react-router-dom";


export default class App extends Component {
  render() {
    return (
      <>
      <Navbar/>
       <Routes>

          <Route
            path="/"
            element={<News />}
          />

          <Route
            path="/business"
            element={<News category="business" />}
          />

          <Route
            path="/entertainment"
            element={<News category="entertainment" />}
          />

          <Route
            path="/health"
            element={<News category="health" />}
          />

          <Route
            path="/science"
            element={<News category="science" />}
          />

          <Route
            path="/sports"
            element={<News category="sports" />}
          />

          <Route
            path="/technology"
            element={<News category="technology" />}
          />

        </Routes>

    </>
    )
  }
}

