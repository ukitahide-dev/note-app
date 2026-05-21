
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'



// ---- features ----
import LoginPage from './features/auth/pages/LoginPage'
import NotesPage from './features/notes/pages/NotesPage'
import NoteDetailPage from './features/notes/pages/NoteDetailPage'
import TrashNotesPage from './features/notes/pages/TrashNotesPage'



// ---- shared ----
import Layout from './shared/layout/Layout'



function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />}/>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/notes"
                    element={
                        <Layout>
                            <NotesPage />
                        </Layout>
                    }
                />
                <Route
                    path="/notes/trash"
                    element={
                        <Layout>
                            <TrashNotesPage />
                        </Layout>
                    }
                />

                {/* <Route path="/notes" element={<NotesPage />} /> */}
                <Route path="/notes/:id" element={<NoteDetailPage />} />




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
