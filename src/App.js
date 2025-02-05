import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Test from "./Scenes/test"
import Tema_1 from "./Tema_1_figuras"
import Tema_2 from "./Tema_2_Posicion_rotacion_escala"
import Tema_3 from './Tema_3_Camaras';
import Tema_4 from './Tema_4_Iluminacion';
import Tema_5 from './Tema_5_Materiales_texturas';
import Tema_6 from './Tema_6_Collisiones_Fisicas';
import Tema_7 from './Tema_7_Transformaciones';
import Tema_8 from './Tema_8_Acciones_Eventos'
import Tema_9 from './Tema_9_Interacciones_interfaces';
import Tema_10 from './Tema_10_WebXR';
import Tema_11 from './Tema_11_GUI_Json'
import Tema_12 from "./Tema_12_Importing_files"
import Tema_13 from './Tema_13_Video_Audio_Espacial';
import Tema_14 from './Tema_14_Animaciones';
import Tema_15 from './Tema_15_Highlights';
import Tema_16 from './Tema_16_Assets_Scene_Management';
import Tema_17 from './Tema_17_Skyboxes';


function App() {
  return (
    <Router>
      <Routes>
          <Route exact path='/' element={<Test/>}></Route>
          <Route path='/tema_1' element={<Tema_1/>}></Route>
          <Route path='/tema_2' element={<Tema_2/>}></Route>
          <Route path='/tema_3' element={<Tema_3/>} ></Route>
          <Route path='/tema_4' element={<Tema_4/>} ></Route>
          <Route path='/tema_5' element={<Tema_5/>}></Route>
          <Route path='/tema_6' element={<Tema_6/>} ></Route>
          <Route path='/tema_7' element={<Tema_7/>} ></Route>
          <Route path='/tema_8' element={<Tema_8/>} ></Route>
          <Route path='/tema_9' element={<Tema_9/>} ></Route>
          <Route path='/tema_10' element={<Tema_10/>}></Route>
          <Route path='/tema_11' element={<Tema_11/>}></Route>
          <Route path='/tema_12' element={<Tema_12/>}></Route>
          <Route path='/tema_13' element={<Tema_13/>}></Route>
          <Route path='/tema_14' element={<Tema_14/>}></Route>
          <Route path='/tema_15' element={<Tema_15/>}></Route>
          <Route path='/tema_16' element={<Tema_16/>}></Route>
          <Route path='/tema_17' element={<Tema_17/>}></Route>
      </Routes>
    </Router>
)}

export default App;
