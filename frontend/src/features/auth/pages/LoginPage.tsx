import { useState } from "react";
import { login } from "../api/authApi";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (
        e: React.SyntheticEvent
    ) => {
        e.preventDefault();

        try {
            const data = await login(username, password);

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            alert("ログイン成功");

        } catch (error) {
            console.error(error);
            alert("ログイン失敗");
        }


    }


    return (
        <div>
            <h1>ログイン</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        placeholder="ユーザー名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                    />
                </div>

                <button type="submit">
                    ログイン
                </button>


            </form>

        </div>
    )

}
