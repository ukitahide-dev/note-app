import { useState } from "react";
import { useNavigate } from "react-router-dom";


import axios from "axios";


import styles from "./RegisterPage.module.css";
import { registerApi } from "../../api/authApi";




export default function RegisterPage() {



    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [errors, setErrors] = useState<{
        username?: string[],
        email?: string[],
        password?: string[],
    }>({});



    const navigate = useNavigate();


    const handleRegister = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        try {

            await registerApi(
                username,
                email,
                password,
            );


            alert("登録成功");

            setErrors({});

            navigate("/login");


        } catch (error: any) {
            console.error(error.response?.data);

            alert(JSON.stringify(error.response?.data));
            alert("登録失敗");

            if (axios.isAxiosError(error)) {

                setErrors(error.response?.data ?? {});

            }
        }

    };


    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <h1 className={styles.title}>
                    新規登録
                </h1>


                <form
                    className={styles.form}
                    onSubmit={handleRegister}
                >

                    <div className={styles.inputGroup}>

                        <input
                            className={styles.input}
                            type="text"
                            placeholder="ユーザー名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        {errors.username?.map((error) => (

                            <p
                                key={error}
                            >
                                {error}
                            </p>

                        ))}

                    </div>


                    <div className={styles.inputGroup}>

                        <input
                            className={styles.input}
                            type="email"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        {errors.email?.map((error) => (

                            <p
                                key={error}
                            >

                                {error}

                            </p>

                        ))}

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

                        {errors.password?.map((error) => (

                            <p
                                key={error}
                            >

                                {error}

                            </p>

                        ))}

                    </div>


                    <button
                        className={styles.button}
                        type="submit"
                    >
                        登録
                    </button>


                </form>


            </div>

        </div>

    );
}
