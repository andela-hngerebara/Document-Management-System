import 'babel-polyfill';
import React from 'react';  
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes'; 
import { Provider } from 'react-redux'; 
import ConfigureStore from './store/ConfigureStore';
import '../styles/custom.scss';

const store = ConfigureStore();
CheckCurrentUser(store);

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.querySelector('.app'));
