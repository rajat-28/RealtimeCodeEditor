import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <> 
      <div>
        <Toaster position='top-right' toastOptions={{
          success:{
            theme:{
              primary: '#4aed88'
            }
          }
        }}>

        </Toaster>
      </div>  
      {/* <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<Home />} ></Route>
          <Route path="/editor/:roomId" element={<EditorPage />} ></Route>

        </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
