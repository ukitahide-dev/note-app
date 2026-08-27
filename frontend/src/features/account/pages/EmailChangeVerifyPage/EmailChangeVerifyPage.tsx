import { useParams } from "react-router-dom";

import EmailVerification from "../../components/EmailVerification/EmailVerification";
import { useState } from "react";
import EmailChangeComplete from "../../components/EmailChangeComplete/EmailChangeComplete";



export default function EmailChangeVerifyPage() {

    const [isComplete, setIsComplete] = useState(false);

    const { token } = useParams();



    if (isComplete) {

        return (
            <EmailChangeComplete />
        );

    }


    return (

        <div>
            EmailChangeVerifyPage開いた

            <EmailVerification
                token={token}
                onSuccess={() => setIsComplete(true)}
            />
        </div>


        // <EmailVerification
        //     token={token}
        //     onSuccess={() => setIsComplete(true)}
        // />


    );


}
