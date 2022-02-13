
import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Punks from './views/punks';
import Punk from './views/punk';
import MainLayout from './layouts/main';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" exact element={<Home />}/>
        <Route path="/punks" exact element={<Punks/>}/>
        <Route path="/punks/:tokenId" element={<Punk/>}/>
      </Routes>
    </MainLayout>
  );
}

export default App;
/**
 * Usando IPFS e Infura para subir contenido no censurable
 curl "https://ipfs.infura.io:5001/api/v0/add?pin=true&cid-version=1" -X POST -H "Content-Type: multipart/form-data" -F file="Hello MyPunks"
 resultado final
 https://ipfs.io/ipfs/bafkreihakuqnauchvhnbpki5b5l5rzciy5s3whn4fuv3kguouyxeenp7ny#x-ipfs-companion-no-redirect
 */