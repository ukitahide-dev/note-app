import { use, useState } from "react";
import styles from "./EmailChangeForm.module.css";
import { changeEmailApi } from "../../../auth/api/authApi";


import axios from "axios";

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


    const [errors, setErrors] = useState<{
        current_password?: string[];
        new_email?: string[];
        new_email_confirm?: string[];
    }>({});


    const [isSubmitting, setIsSubmitting] = useState(false);




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);


        try {

            await changeEmailApi(
                currentPassword,
                newEmail,
                newEmailConfirm,
            );

            console.log("確認メールを送信しました");

            onSuccess();

        } catch (error) {

            if (axios.isAxiosError(error)) {

                console.log(error.response?.data);   // {current_password: Array(1), new_email: Array(1), new_email_confirm: Array(1)}
                setErrors(error.response?.data || {});

            }

        } finally {
            setIsSubmitting(false);
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
                        required
                    />

                    {errors.current_password && (
                        <p>{errors.current_password[0]}</p>
                    )}

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
                        required
                    />

                    {errors.new_email && (
                        <p>{errors.new_email[0]}</p>
                    )}

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
                        required
                    />

                    {errors.new_email_confirm && (
                        <p>{errors.new_email_confirm[0]}</p>
                    )}


                </div>


                <div className={styles.buttonArea}>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                        // onClick={() => onSuccess()}
                    >
                        {isSubmitting
                            ? "送信中..."
                            : "確認メールを送信"
                        }
                    </button>

                </div>

            </form>

        </div>

    );
}
