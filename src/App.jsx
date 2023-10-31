import React from 'react';
import Header from './components/Header';
import Content from './components/Content';

import './App.css';

const WS_URL = 'ws://localhost:5656';

function App() {
  return (
    <div className='app'>
      <Header />
      <Content />
    </div>
  );
}

export default App;