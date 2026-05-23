
import api from "../../../shared/api/axios";



// ラベルを取得する
export const getLabels = async () => {
    const token = localStorage.getItem("access");

    const res = await api.get(
        "/labels/",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}



// 新規ラベルを作成する
export const createLabel = async (name: string) => {
    const token = localStorage.getItem("access");

    const res = await api.post(
        "/labels/",
        { name },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}
