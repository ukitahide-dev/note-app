import api, { refreshApi } from "../../../shared/api/axios";


// ログイン
export const loginApi = async (
    email: string,
    password: string
) => {

    const res = await api.post(
        "/login/", {   // axios が自動でbaseURL + "/login/"を合体する。つまり、http://127.0.0.1:8000/api/login/になる。
        email,
        password,
    });

    return res.data;

}



// 新規登録
export const registerApi = async (
    username: string,
    email: string,
    password: string,
) => {

    const res = await api.post("/register/", {
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

    const res = await refreshApi.post(
        "/token/refresh/",   // users/urls.pyに書いた、token/refreshのこと。Django標準のTokenRefreshView.as_view()が実行される。
        {
            refresh: refreshToken,
        }
    );


    return res.data.access;


}
