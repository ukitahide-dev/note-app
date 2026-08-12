import { useState } from "react";

import { useNavigate } from 'react-router-dom'

import { loginApi, refreshAccessToken } from "../api/authApi";


import styles from "./LoginPage.module.css";


import axios from "axios";


export default function LoginPage() {
    // const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState("");


    const navigate = useNavigate();


    const handleLogin = async (
        e: React.SyntheticEvent
    ) => {
        e.preventDefault();

        try {

            setError("");

            const data = await loginApi(email, password);
            // console.log(`ログイン成功後のdata: ${data}`);

            console.log(`ログイン成功後のアクセストークン: ${data.access}`);
            // console.log(`ログイン成功後のリフレッシュトークン: ${data.refresh}`);
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            alert("ログイン成功");
            navigate("/notes");  // NotesPage.tsxへ


            // const newAccessToken = await refreshAccessToken();

            // localStorage.setItem(
                // "access",
                // newAccessToken
            // );

            // console.log(`新しいアクセストークン: ${newAccessToken}`);



        } catch (error: any) {
            console.error(error.response?.data);

            if (axios.isAxiosError(error)) {
                setError("メールアドレスまたはパスワードが間違っています");
            } else {

                setError("予期しないエラーが発生しました");

            }

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

                    {error && (
                        <p>
                            {error}
                        </p>
                    )}

                    <button
                        className={styles.button}
                        type="submit"
                    >
                        ログイン
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        新規登録はこちら
                    </button>

                </form>

            </div>

        </div>
    )

}




