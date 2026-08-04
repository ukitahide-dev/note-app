
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'



// ---- features ----
import LoginPage from './features/auth/pages/LoginPage'
import NotesPage from './features/notes/pages/NotesPage'
// import NoteDetailPage from './features/notes/pages/NoteDetailPage'
import TrashNotesPage from './features/notes/pages/TrashNotesPage'



// ---- shared ----
import Layout from './shared/layout/Layout'
import LabelNotesPage from './features/notes/pages/LabelNotesPage/LabelNotesPage'
import FavoriteNotesPage from './features/notes/pages/FavoriteNotesPage/FavoriteNotesPage'
import SearchResultsPage from './features/search/pages/SearchResultsPage/SearchResultsPage'
import CalendarPage from './features/notes/pages/CalendarPage/CalendarPage'



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
                    path="/labels/:labelName"
                    element={
                        <Layout>
                            <LabelNotesPage />
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
                <Route
                    path="/notes/favorites"
                    element={
                        <Layout>
                            <FavoriteNotesPage />
                        </Layout>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <Layout>
                            <SearchResultsPage />
                        </Layout>
                    }
                />

                <Route
                    path="/calendar"
                    element={<CalendarPage />}
                />

                {/* <Route path="/notes" element={<NotesPage />} /> */}
                {/* <Route path="/notes/:id" element={<NoteDetailPage />} /> */}




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
