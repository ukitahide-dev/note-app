import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AccountDeleteForm.module.css";
import { deleteAccountApi } from "../../../auth/api/authApi";
import ConfirmModal from "../../../../shared/ui/ConfirmModal/ConfirmModal";





export default function AccountDeleteForm() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


    const navigate = useNavigate();

    const handleDelete = async () => {

        setError("");
        setIsConfirmModalOpen(false);
        setIsSubmitting(true);

        try {

            await deleteAccountApi(currentPassword);

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            navigate("/login");

        } catch (error) {

            if (axios.isAxiosError(error)) {

                setError(
                    error.response?.data?.current_password?.[0]
                    ?? error.response?.data?.detail
                    ?? "アカウントの削除に失敗しました。"
                );

            } else {

                setError("アカウントの削除に失敗しました。");

            }

        } finally {

            setIsSubmitting(false);

        }
    };



    const handleOpenConfirmModal = () => {

        if (!currentPassword.trim()) {   // ユーザーが、パスワード入力欄に何も書いていない場合は、フロントで処理を中断させる。わざわざ、django側で検証する必要もない。(react経由していれば)
            setError("現在のパスワードを入力してください。");
            return;
        }

        setError("");
        setIsConfirmModalOpen(true);

    }






    return (

        <>

        <div className={styles.formContainer}>

            <form
                className={styles.form}
                // onSubmit={handleSubmit}
            >

                <p className={styles.warning}>
                    アカウントを削除すると、登録されている
                    ノートなどのデータも削除されます。
                    この操作は取り消せません。
                </p>

                <div className={styles.formGroup}>

                    <label htmlFor="currentPassword">
                        現在のパスワード
                    </label>

                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) =>
                            setCurrentPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}

                </div>

                <div className={styles.buttonArea}>

                    <button
                        onClick={handleOpenConfirmModal}
                        type="button"
                        className={styles.deleteButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "削除中..."
                            : "アカウントを削除する"}
                    </button>

                </div>

            </form>

        </div>


        <ConfirmModal
            isOpen={isConfirmModalOpen}
            title="本当にアカウントを削除しますか？"
            message="アカウントを削除すると、ノート・ラベル・画像などのデータも削除されます。この操作は取り消せません。"
            onConfirm={handleDelete}
            onClose={() => setIsConfirmModalOpen(false)}
        />


        </>

    );
}
