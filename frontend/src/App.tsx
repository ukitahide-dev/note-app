
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
import RegisterPage from './features/auth/pages/RegisterPage/RegisterPage'
import ProtectedRoute from './shared/routes/ProtectedRoute'
import AccountPage from './features/account/pages/AccountPage/AccountPage'
import EmailChangePage from './features/account/pages/EmailChangePage/EmailChangePage'
import PasswordChangePage from './features/account/pages/PasswordChangePage/PasswordChangePage'
import EmailChangeVerifyPage from './features/account/pages/EmailChangeVerifyPage/EmailChangeVerifyPage'
import AccountDeletePage from './features/account/pages/AccountDeletePage/AccountDeletePage'



function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* 誰でもアクセスできるページ */}
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />


                {/* ログイン必須 */}
                {/* この中に入っているRouteへアクセスするときは、まず ProtectedRoute を通す。 */}
                <Route element={<ProtectedRoute />}>

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

                    <Route
                        path="/account"
                        element={<AccountPage />}
                    />

                    <Route
                        path="/account/email"
                        element={<EmailChangePage />}
                    />

                    <Route
                        path="/account/email/verify/:token"
                        element={<EmailChangeVerifyPage />}
                    />

                    {/* <Route
                        path="/account/email/verify/:token"
                        element={<EmailChangePage />}
                    /> */}

                    <Route
                        path="/account/password"
                        element={<PasswordChangePage />}
                    />

                    <Route
                        path="/account/delete"
                        element={<AccountDeletePage />}
                    />


                </Route>

            </Routes>

        </BrowserRouter>

    )

}

export default App
