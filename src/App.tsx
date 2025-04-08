import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Game from './components/Game';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <Game />
    </Provider>
  );
}

export default App;
