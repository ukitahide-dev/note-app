import { useState } from "react";
import EmailChangeForm from "../../components/EmailChangeForm/EmailChangeForm";



import styles from "./EmailChangePage.module.css";
import EmailVerification from "../../components/EmailVerification/EmailVerification";


import { useParams } from "react-router-dom";
import EmailChangeComplete from "../../components/EmailChangeComplete/EmailChangeComplete";
import EmailChangePending from "../../components/EmailChangePending/EmailChangePending";

// 遷移元: AccountPage.tsx

export default function EmailChangePage() {



    const { token } = useParams();


    const [step, setStep] = useState<
        "input" | "pending"
    >("input");


    // const [step, setStep] = useState<
    //     "input" | "verify" | "complete"
    // >(
    //     token ? "verify" : "input"
    // );

    // const [step, setStep] = useState<
    //     "input" | "verify" | "complete"
    // >("input");


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
                    onSuccess={() => setStep("pending")}

                />

            )}

            {step === "pending" && (

                <EmailChangePending

                />

            )}


            {/* {step === "verify" && (


                <EmailVerification
                    token={token}
                    onSuccess={() => setStep("complete")}
                />

            )}

            {step === "complete" && (

                <EmailChangeComplete

                />

                // <EmailChangeComplete />

            )} */}


        </div>




    );

}
