import { useState } from "react";
import EmailChangeForm from "../../components/EmailChangeForm/EmailChangeForm";



import styles from "./EmailChangePage.module.css";
import EmailVerification from "../../components/EmailVerification/EmailVerification";



export default function EmailChangePage() {


    const [step, setStep] = useState<
        "input" | "verify" | "complete"
    >("input");


    return (

        <div
            className={styles.page}
        >
            <div
                className={styles.title}
            >

                <h1>メールアドレス変更</h1>

            </div>


            {step === "input" && (

                <EmailChangeForm
                    onSuccess={() => setStep("verify")}

                />

            )}


            {step === "verify" && (


                <EmailVerification
                    onSuccess={() => setStep("complete")}
                />

            )}

            {step === "complete" && (

                <div>EmailChangeComplete.tsx</div>

                // <EmailChangeComplete />

            )}


        </div>




    );

}
