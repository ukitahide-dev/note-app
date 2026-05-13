import api from "../../../shared/api/axios";


export const login = async (username: string, password: string) => {
    const res = await api.post("/login/", {  // axios が自動でbaseURL + "/login/"を合体する。つまり、http://127.0.0.1:8000/api/login/になる。
        username,
        password
    });

    return res.data;

}


