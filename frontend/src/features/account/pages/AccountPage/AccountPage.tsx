

// import { useState } from "react";
import styles from "./AccountPage.module.css";
// import EmailChangeForm from "../../components/EmailChangeForm/EmailChangeForm";
// import { useNavigate } from "react-router-dom";


import { Link } from "react-router-dom";


export default function AccountPage() {

    // const navigate = useNavigate();

    // const [openForm, setOpenForm] = useState<
    //     "email" | "password" | "delete" | null
    // >(null);


    return (

        <>

        <div className={styles.page}>

            <div
                className={styles.title}
            >

                <h1>ログイン情報</h1>

            </div>

            <main className={styles.container}>

                <section className={styles.accountSection}>

                    <div className={styles.accountInfo}>
                        <h2>メールアドレス</h2>
                        <p>現在のメールアドレス: 実際に表示ああああああああああああああああああああああああああああああああああああああああああ</p>
                    </div>

                    <Link
                        to="/account/email"
                        className={styles.changeButton}
                    >
                        変更
                    </Link>

                    {/* <button
                        onClick={() => navigate("/account/email")}
                        // onClick={() => setOpenForm("email")}
                    >
                        変更
                    </button> */}

                </section>

                <section className={styles.accountSection}>

                    <div className={styles.accountInfo}>
                        <h2>パスワード</h2>
                    </div>

                    <Link
                        to="/account/password"
                        className={styles.changeButton}
                    >
                        変更
                    </Link>


                    {/* <button
                        onClick={() => navigate("/account/password")}
                    >
                        変更
                    </button> */}

                </section>

                <section className={styles.accountSection}>

                    <div className={styles.accountInfo}>
                        <h2>アカウント削除</h2>
                    </div>

                    <Link
                        to="/account/delete"
                        className={styles.changeButton}
                    >
                        アカウント削除
                    </Link>

                    {/* <button
                        onClick={() => navigate("/account/delete")}
                    >
                        アカウント削除
                    </button> */}

                </section>

            </main>

            {/* {openForm === "email" && (
                <EmailChangeForm

                />
            )} */}

        </div>

        {/* {openForm === "email" && (
            <EmailChangeForm

            />
        )} */}

        </>
    );
}
