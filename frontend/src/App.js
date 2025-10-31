import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import Setting from './components/setting';
import About from './components/about';
import Book from './components/book';
import Ticket from './components/ticket';
import Detail from './components/detail';
import FindForm from './components/find_form';
import PickForm from './components/pick_form';
import AvailableRoom from './components/available_room';
import RoomDetails from './components/roomdetails';
import Favorites from "./components/favorites";
import RequireLoginAlert from './components/RequireLoginAlert';
import { CssBaseline } from "@mui/material";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/setting" element={<RequireLoginAlert><Setting /></RequireLoginAlert>} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<RequireLoginAlert><Book /></RequireLoginAlert>} />
        <Route path="/ticket" element={<RequireLoginAlert><Ticket /></RequireLoginAlert>} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/find" element={<FindForm />} />
        <Route path="/pick" element={<PickForm />} />
        <Route path="/available-room" element={<AvailableRoom />} />
        <Route path="/room/:roomId" element={<RequireLoginAlert><RoomDetails /></RequireLoginAlert>} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
