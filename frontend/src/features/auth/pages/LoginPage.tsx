import { useState } from "react";

import { useNavigate } from 'react-router-dom'

import { login } from "../api/authApi";


import styles from "./LoginPage.module.css";



export default function LoginPage() {
    // const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


    const navigate = useNavigate();


    const handleLogin = async (
        e: React.SyntheticEvent
    ) => {
        e.preventDefault();

        try {
            const data = await login(email, password);
            console.log(data);

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            alert("ログイン成功");
            navigate("/notes");  // NotesPage.tsxへ



        } catch (error) {
            console.error(error);
            alert("ログイン失敗");
        }


    }


    return (
        <div className={styles.container}>

            <div className={styles.card}>

                <h1 className={styles.title}>
                    ログイン
                </h1>

                <form
                    className={styles.form}
                    onSubmit={handleLogin}
                >

                    <div className={styles.inputGroup}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        className={styles.button}
                        type="submit"
                    >
                        ログイン
                    </button>

                </form>

            </div>

        </div>
    )

}
