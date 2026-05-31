
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




// ラベルを編集する
export const updateLabel = async (
    id: number,
    name: string
) => {
    const token = localStorage.getItem("access");

    const res = await api.patch(
        `/labels/${id}/`,
        {
            name,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};



// ラベルを削除する
export const deleteLabel = async (
    id: number
) => {

    const token = localStorage.getItem("access");

    await api.delete(
        `/labels/${id}`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

}


