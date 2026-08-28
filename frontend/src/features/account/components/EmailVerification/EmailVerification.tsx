import { useEffect } from "react";
import { verifyEmailChangeApi } from "../../../auth/api/authApi";

import axios from "axios";


type Props = {
    token: string | undefined;
    onSuccess: () => void;
    onError: (message: string) => void;
}



// 画面を作るためのコンポーネントではなく、メールリンクから渡されたtokenを使って認証APIを実行するためのコンポーネント
export default function EmailVerification({
    token,
    onSuccess,
    onError,

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

                if (axios.isAxiosError(error)) {

                    console.log(error.response?.data);

                    const message = error.response?.data?.[0];

                    onError(message ?? "メール認証に失敗しました。");
                    return;
                }

                onError("メール認証に失敗しました。");



                console.log("メール認証失敗");
                console.log(error);

            }

        };


        verify();

    }, [token]);


    return null;


}
