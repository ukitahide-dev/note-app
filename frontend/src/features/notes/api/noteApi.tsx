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




// ノート詳細を取得する
export const getNote = async(id: number) => {
    const token = localStorage.getItem("access");

    const res = await api.get(
        `/notes/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return res.data;


}



// ノートを投稿する
export const createNote = async (title: string, content: string) => {
    const token = localStorage.getItem("access");

    const res = await api.post(
        "/notes/",
        {
            title,
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return res.data;
}



// ノートのタイトル内容を変更する
export const updateNote = async(id: number, title: string, content: string) => {
    const token = localStorage.getItem("access");
    const res = await api.patch(
        `/notes/${id}/`,
        {
            title,
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;

}




export const moveToTrash = async(id: Number) => {
    const token = localStorage.getItem("access");

    const res = await api.patch(
        `/notes/${id}`,
        {
            is_deleted: true,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}



// ゴミ箱に入れたノートを取得する
export const getTrashNotes = async () => {
    const token = localStorage.getItem("access");

    const res = await api.get(
        "/notes/trash",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}
