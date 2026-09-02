



import { useState } from "react";
import styles from "./PasswordChangeForm.module.css";
import { changePasswordApi } from "../../../auth/api/authApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";




export default function PasswordChangeForm() {


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);


    const [errors, setErrors] = useState<{
        current_password?: string[];
        new_password?: string[];
        new_password_confirm?: string[];
    }>({});

    const navigate = useNavigate();




    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setErrors({});
        setIsSubmitting(true);


        try {

            await changePasswordApi(
                currentPassword,
                newPassword,
                newPasswordConfirm,
            );


            // パスワード変更成功
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");


            // ログイン画面へ
            navigate("/login");


        } catch (error) {


            if (axios.isAxiosError(error)) {

                setErrors(
                    error.response?.data ?? {}
                );

                console.log(error.response?.data);

            }

        } finally {

            setIsSubmitting(false);

        }

    };




    return (

        <div className={styles.formContainer}>

            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.formGroup}>

                    <label htmlFor="currentPassword">
                        現在のパスワードを入力
                        <span className={styles.required}>必須</span>
                    </label>

                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />

                    {errors.current_password && (
                        <p className={styles.error}>
                            {errors.current_password[0]}
                        </p>
                    )}



                </div>


                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">
                        新しいパスワードを入力
                        <span className={styles.required}>必須</span>
                    </label>

                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    {errors.new_password && (
                        <p className={styles.error}>
                            {errors.new_password[0]}
                        </p>
                    )}

                </div>


                <div className={styles.formGroup}>
                    <label htmlFor="newPasswordConfirm">

                        新しいパスワードを入力(確認用)
                        <span className={styles.required}>必須</span>

                    </label>

                    <input
                        id="newPasswordConfirm"
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        required
                    />

                    {errors.new_password_confirm && (
                        <p className={styles.error}>
                            {errors.new_password_confirm[0]}
                        </p>
                    )}


                </div>



                <div className={styles.buttonArea}>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}

                    >
                        {isSubmitting ? "送信中..." : "パスワードを変更"}
                    </button>

                </div>

            </form>

        </div>

    );

}
