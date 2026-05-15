import api from "../../../shared/api/axios";



// ノート一覧を取得する
export const getNotes = async () =>  {
    const token = localStorage.getItem("access");

    const res = await api.get(
        "/notes/",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return res.data;

}
