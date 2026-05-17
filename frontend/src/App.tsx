
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'



// import Layout from './Layout'
// import Home from './pages/Home'
// import NoteDetail from './pages/NoteDetail'

import LoginPage from './features/auth/pages/LoginPage'
import NotesPage from './features/notes/pages/NotesPage'


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />}/>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/notes" element={<NotesPage />} />
                {/* <Route path="/notes/:id" element={} /> */}
                    {/* <Route path="/register" element={<RegisterPage />} /> */}
                    {/* <Route path="/" element={<Layout />}> */}
                        {/* <Route index element={<Home />} /> */}
                        {/* <Route path="/notes/:id" element={<NoteDetail />} /> */}
                    {/* </Route> */}
            </Routes>

        </BrowserRouter>
    )
}

export default App
