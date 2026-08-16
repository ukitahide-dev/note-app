import  { authApi, } from "../../../shared/api/axios";


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
export const logoutApi = async () => {

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
