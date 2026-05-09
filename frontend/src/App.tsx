
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'


import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Layout from './Layout'
import Home from './pages/Home'
import NoteDetail from './pages/NoteDetail'

function App() {

    return (
        <BrowserRouter>
            <div className="app-container">
                <Routes>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/notes/:id" element={<NoteDetail />} />
                    </Route>
                </Routes>

            </div>

        </BrowserRouter>
    )
}

export default App
