import AccountDeleteForm from "../../components/AccountDeleteForm/AccountDeleteForm";
import styles from "./AccountDeletePage.module.css";





export default function AccountDeletePage() {



    return (

        <div className={styles.page}>

            <div className={styles.title}>
                <h1>アカウント削除</h1>
            </div>

            <AccountDeleteForm
                
            />

        </div>

    );

}
