


import styles from "./PasswordChangePage.module.css";
import PasswordChangeForm from "../../components/PasswordChangeForm/PasswordChangeForm";





export default function PasswordChangePage() {



    return (


        <div
            className={styles.page}
        >
            <div
                className={styles.title}
            >

                <h1>パスワード変更</h1>

            </div>


            <PasswordChangeForm

            />

        </div>

        // <form onSubmit={handleSubmit}>

        //     <h1>パスワード変更</h1>


        //     <div>

        //         <label>
        //             現在のパスワード
        //         </label>

        //         <input
        //             type="password"
        //             value={currentPassword}
        //             onChange={(e) =>
        //                 setCurrentPassword(e.target.value)
        //             }
        //         />

        //     </div>


        //     <div>

        //         <label>
        //             新しいパスワード
        //         </label>

        //         <input
        //             type="password"
        //             value={newPassword}
        //             onChange={(e) =>
        //                 setNewPassword(e.target.value)
        //             }
        //         />

        //     </div>


        //     <div>

        //         <label>
        //             新しいパスワード（確認）
        //         </label>

        //         <input
        //             type="password"
        //             value={newPasswordConfirm}
        //             onChange={(e) =>
        //                 setNewPasswordConfirm(e.target.value)
        //             }
        //         />

        //     </div>


        //     {error && (
        //         <p>{error}</p>
        //     )}


        //     <button
        //         type="submit"
        //         disabled={isLoading}
        //     >
        //         {isLoading
        //             ? "変更中..."
        //             : "パスワードを変更"
        //         }
        //     </button>

        // </form>

    );
}
