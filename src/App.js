
import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Punkos from './views/punks';

import MainLayout from './layouts/main';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/punks" element={<Punkos/>}/>
      </Routes>
    </MainLayout>
  );
}

export default App;