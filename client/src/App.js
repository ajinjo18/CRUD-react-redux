import './App.css';

import MainRoutes from './Routes/MainRoutes';
import { Provider } from 'react-redux';
import {store,persistor} from './Redux/store';

function App() {
  return (
    <Provider store={store}>
      <MainRoutes />
    </Provider>
  );
}

export default App;
