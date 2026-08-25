import { useState } from "react";
import styles from "./EmailChangeForm.module.css";
import { changeEmailApi } from "../../../auth/api/authApi";


type Props = {
    onSuccess: () => void;
}




export default function EmailChangeForm({
    onSuccess,

}: Props) {



    // 現在のパスワード
    const [currentPassword, setCurrentPassword] = useState("");

    // 新しいメールアドレス
    const [newEmail, setNewEmail] = useState("");

    // 新しいメールアドレス（確認用）
    const [newEmailConfirm, setNewEmailConfirm] = useState("");




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        try {

            await changeEmailApi(
                currentPassword,
                newEmail,
                newEmailConfirm,
            );

            console.log("確認メールを送信しました");

            onSuccess();

        } catch (error) {

            console.log(error);

        }


    };



    return (

        <div className={styles.formContainer}>


            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >

                {/* 現在のメールアドレス */}
                <div className={styles.formGroup}>

                    <label>
                        現在のメールアドレス
                    </label>

                    <p className={styles.currentEmail}>
                        example@example.com
                    </p>

                </div>


                {/* 現在のパスワード */}
                <div className={styles.formGroup}>

                    <label htmlFor="currentPassword">
                        現在のパスワード

                        <span className={styles.required}>
                            必須
                        </span>

                    </label>

                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                </div>



                {/* 新しいメールアドレス */}
                <div className={styles.formGroup}>

                    <label htmlFor="newEmail">
                        新しいメールアドレス

                        <span className={styles.required}>
                            必須
                        </span>

                    </label>

                    <input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />

                </div>


                {/* 新しいメールアドレス確認 */}
                <div className={styles.formGroup}>

                    <label htmlFor="newEmailConfirm">
                        新しいメールアドレス(確認用)

                        <span className={styles.required}>
                            必須
                        </span>

                    </label>

                    <input
                        id="newEmailConfirm"
                        type="email"
                        value={newEmailConfirm}
                        onChange={(e) => setNewEmailConfirm(e.target.value)}
                    />

                </div>


                <div className={styles.buttonArea}>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        // onClick={() => onSuccess()}
                    >
                        確認メールを送信
                    </button>

                </div>

            </form>

        </div>

    );
}
