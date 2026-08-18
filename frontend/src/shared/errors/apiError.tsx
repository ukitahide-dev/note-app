import axios from "axios";



// API通信エラーの共通処理


export const getApiErrorMessage = (
    error: unknown,

): string => {

    if (!axios.isAxiosError(error)) {
        return "予期しないエラーが発生しました。";
    }


    const status = error.response?.status;   // HTTPステータスを取り出す

    const url = error.config?.url;


    console.log("API ERROR STATUS:", status);
    console.log("API ERROR URL:", error.config?.url);


    if (url === "/token/refresh/" && status === 400) {
        return "ログインが必要です。";
    }


    if (status === 400) {
        return "入力内容を確認してください。";
    }


    if (status === 401) {
        return "ログインが必要です。";
    }


    if (status === 403) {
        return "この操作を行う権限がありません。";
    }


    if (status === 404) {
        return "データが見つかりません。";
    }


    if (status === 500) {
        return "サーバーで問題が発生しました。";
    }


    if (!error.response) {
        return "ネットワークエラーが発生しました。";
    }


    return "エラーが発生しました。";

}
