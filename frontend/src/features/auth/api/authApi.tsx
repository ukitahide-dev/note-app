import  api, { authApi, } from "../../../shared/api/axios";


// ログイン
export const loginApi = async (
    email: string,
    password: string
) => {

    const res = await authApi.post(
        "/login/", {   // axios が自動でbaseURL + "/login/"を合体する。つまり、http://127.0.0.1:8000/api/login/になる。
        email,
        password,
    });

    return res.data;

}



// ログアウト
export const logoutApi = async (
    
) => {

    const refresh = localStorage.getItem("refresh");


    try {

        // Refresh Tokenをブラックリスト化
        await authApi.post(
            "/logout/",
            {
                refresh,
            }

        );

    } finally {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

    }

};



// 新規登録
export const registerApi = async (
    username: string,
    email: string,
    password: string,
) => {

    const res = await authApi.post("/register/", {
        username,
        email,
        password
    });

    return res.data;

}




// パスワード変更
export const changePasswordApi = async (
    currentPassword: string,
    newPassword: string,
    newPassWordConfirm: string,

) => {

    const res = await api.post(
        "/password/change/",
        {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: newPassWordConfirm,
        },
    );

    return res.data;



}





// メールアドレス変更申請。
export const changeEmailApi = async (
    currentPassword: string,
    newEmail: string,
    newEmailConfirm: string,
) => {

    const res = await api.post(
        "/email/change/",
        {
            current_password: currentPassword,
            new_email: newEmail,
            new_email_confirm: newEmailConfirm,
        }
    );

    return res.data;
};






// メールアドレス変更の確認
export const verifyEmailChangeApi = async (
    token: string,
) => {

    const res = await authApi.post(
        "/email/change/verify/",
        {
            token,
        }
    );

    return res.data;
};




// Access Tokenを更新する
export const refreshAccessToken = async (

) => {

    const refreshToken = localStorage.getItem("refresh");

    // tryの中は絶対に実行される。tryの途中でエラーが起こると、その時点で処理が終わり、chatchに飛ぶ。
    try {

        const res = await authApi.post(
            "/token/refresh/",
            {
                refresh: refreshToken,
            }
        );

        return res.data.access;

    } catch (error) {

        console.log("Refresh Tokenが無効です");
        console.log(error);

        throw error;  // 呼び出し元にエラー内容を伝える。自分のところでエラーを処理しきれないので、refreshAccessToken() を呼んだ側にエラーを投げ返す。
    }


    // if (!refreshAccessToken) {

    //     console.log("refresh Tokenがありません");
    //     throw new Error("Refresh Tokenがありません");

    // }


    // const res = await authApi.post(
    //     "/token/refresh/",   // users/urls.pyに書いた、token/refreshのこと。Django標準のTokenRefreshView.as_view()が実行される。
    //     {
    //         refresh: refreshToken,
    //     }
    // );


    // return res.data.access;


}






// アカウント削除
export const deleteAccountApi = async (
    currentPassword: string,

) => {

    const res = await api.delete(
        "/account/delete/",
        {
            data: {
                current_password: currentPassword,
            },
        },
    );

    return res.data;

};
