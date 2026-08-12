
// Axios（アクシオス） は、JavaScript / TypeScriptからHTTPリクエストを送るためのライブラリ。
import axios from "axios";
import { refreshAccessToken } from "../../features/auth/api/authApi";


// このアプリ専用のAxiosを1個作る
const api = axios.create({  // create は自分用にカスタマイズしたaxiosを作るという意味。
    baseURL: "http://127.0.0.1:8000/api",
});



// JWTを付けてアクセスする必要があるAPI。通常の認証済みAPI用。Djangoへリクエストを送信する前に実行される。
api.interceptors.request.use((config) => {

    console.log("api.interceptors.request.use実行");

    const token = localStorage.getItem("access");
    // console.log(token);

    if (token) {
        console.log("tokenある場合です");

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});



// Djangoからレスポンスが返ってきた後 に実行される。
api.interceptors.response.use(



    (response) => {
        console.log("api.interceptors.response.use実行");

        return response;
    },


    async (error) => {

        if (error.response?.status === 401) {
            console.log("401エラーを検知しました");
            console.log("失敗したリクエスト:", error.config);   // error.config: Axiosのエラーには、元々どんなリクエストを送ったのかが入っている。



            const newAccessToken = await refreshAccessToken();

            console.log(
                "Refresh後の新しいAccess Token:",
                newAccessToken
            );


            localStorage.setItem(
                "access",
                newAccessToken
            );

            error.config.headers.Authorization = `Bearer ${newAccessToken}`;   // 失敗したリクエストのAuthorizationを新しいTokenに交換。


            console.log(
                "再送するAuthorization:",
                error.config.headers.Authorization
            );


            console.log("localStorageの中にあるrefresh後の新しいaccessToken");

            console.log(

                localStorage.getItem("access")
            );

            console.log(error.response?.data);


            return api(error.config);   // さっき失敗したリクエストを、もう一回 api で送る。error.config に入っている設定どおりに、もう一度リクエストを送る。


        }


        return Promise.reject(error);

    }

)




//  Refresh Token専用のAPI。
export const refreshApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});



export default api;
