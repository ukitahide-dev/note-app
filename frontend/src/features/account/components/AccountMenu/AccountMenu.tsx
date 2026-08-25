
import { useNavigate } from "react-router-dom";
import styles from "./AccountMenu.module.css";





export default function AccountMenu () {


    const navigate = useNavigate();


    return (

        <div className={styles.accountMenu}>

            <div className={styles.accountMenuContent}>

                <button
                    onClick={() => navigate("/account")}

                >
                    ログイン情報

                </button>
            </div>




        </div>

    );




}
