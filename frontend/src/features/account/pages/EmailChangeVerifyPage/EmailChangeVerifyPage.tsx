import { useParams } from "react-router-dom";

import EmailVerification from "../../components/EmailVerification/EmailVerification";
import { useState } from "react";
import EmailChangeComplete from "../../components/EmailChangeComplete/EmailChangeComplete";



export default function EmailChangeVerifyPage() {

    const [isComplete, setIsComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { token } = useParams();



    if (isComplete) {

        return (
            <EmailChangeComplete

            />
        );

    }



    if (errorMessage) {

        return (
            <div>
                <h2>メールアドレスの認証に失敗しました</h2>

                <p>{errorMessage}</p>
            </div>
        );

    }


    

    return (

        <div>
            EmailChangeVerifyPage開いた

            <EmailVerification
                token={token}
                onSuccess={() => setIsComplete(true)}
                onError={(message) => setErrorMessage(message)}
            />
        </div>


        // <EmailVerification
        //     token={token}
        //     onSuccess={() => setIsComplete(true)}
        // />


    );


}
