import { useEffect } from "react";
import { verifyEmailChangeApi } from "../../../auth/api/authApi";


type Props = {
    token: string | undefined;
    onSuccess: () => void;
}



// 画面を作るためのコンポーネントではなく、メールリンクから渡されたtokenを使って認証APIを実行するためのコンポーネント
export default function EmailVerification({
    token,
    onSuccess,

}: Props) {



    useEffect(() => {

        if (!token) {
            return;
        }


        const verify = async () => {

            try {

                await verifyEmailChangeApi(token);

                onSuccess();

                console.log("メール認証成功");

            } catch (error) {

                console.log("メール認証失敗");
                console.log(error);

            }

        };


        verify();

    }, [token]);


    return null;


}
