import api from "../../../shared/api/axios";
import type { History } from "../../../types/note";



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
export const createNote = async (
    title: string,
    content: string,
    labelIds: number[],
    color: string,
) => {

    const token = localStorage.getItem("access");

    const res = await api.post(
        "/notes/",
        {
            title,
            content,
            label_ids: labelIds,
            color: color
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
export const updateNote = async (
    id: number,
    title: string,
    content: string
) => {

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




// ノートをゴミ箱に移動させる
export const moveToTrash = async(id: number) => {
    const token = localStorage.getItem("access");

    const res = await api.patch(  // patchは一部だけ更新という意味。
        `/notes/${id}/`,
        {
            is_deleted: true,  // is_deletedをtrue に変えてという意味。
        },
        {
            headers: { // headersはリクエストの追加情報。
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
        "/notes/trash/",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}




// ゴミ箱に入れたノートを復元する
export const restoreNote = async (id: number) => {
    const token = localStorage.getItem("access");

    const res = await api.patch(
        `/notes/${id}/`,
        {
            is_deleted: false
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;

}






// ノートを完全に削除する
export const deleteNoteForever = async (id: number) => {
    const token = localStorage.getItem("access");

    await api.delete(
        `/notes/${id}/`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}



// ゴミ箱内のノートを全て一括で削除する
export const emptyTrash = async () => {
    const token = localStorage.getItem("access");

    await api.delete(
        "/notes/trash/all/",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

}





// 各ノートのラベルを更新する
export const updateNoteLabels = async (
    noteId: number,
    labelIds: number[]
) => {

    const token = localStorage.getItem("access");

    const res = await api.patch(
        `/notes/${noteId}/`,
        {
            label_ids: labelIds,
        },
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    return res.data;
};





// ノートの背景色を変更する
export const updateNoteColor = async (
    id: number,
    color: string
) => {

    const token = localStorage.getItem("access");

    const res = await api.patch(
        `notes/${id}/`,
        {
            color
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return res.data;

}



// ノートのお気に入りを切り替える
export const updateNoteFavorite = async (
    id: number,
    is_favorite: boolean

) => {

    const token = localStorage.getItem("access");

    const res = await api.patch(
        `notes/${id}/`,
        {
            is_favorite
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;


}




export const updateNotePinned = async (
    id: number,
    is_pinned: boolean,
) => {


    const token = localStorage.getItem("access");

    const res = await api.patch(
        `notes/${id}/`,
        {
            is_pinned
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return res.data;


}




// ノート単体の変更履歴を取得する
export const getNoteHistory = async (
    id: number,

): Promise<History[]> => {

    const token = localStorage.getItem("access");

    const res = await api.get(
        `/notes/${id}/history/`,  // views.py、NoteViewSetの@historyメソッドが実行される
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
    );

    return res.data;


}






// ノートに画像を追加する
export const uploadNoteImage = async (
    noteId: number,
    image: File,
) => {

    const token = localStorage.getItem("access");

    const formData = new FormData();

    formData.append("image", image);  // 左のimageは、NoteImageSerializerのimageフィールドのこと。でも、そのSerializerはNoteImageモデルのimageカラムと対応しているので、実質的には「NoteImageモデルのimageカラム」と考えてOK。


    const res = await api.post(  // resにはサーバーから返ってきたレスポンス全体が渡ってくる。
        `notes/${noteId}/images/`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;




}





// ノートが所持している画像を削除する
export const deleteNoteImageApi = async(
    imageId: number,

) => {

     const token = localStorage.getItem("access");

    const res = await api.delete(
        `/note-images/${imageId}/`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
    );

    return res.data;

}
