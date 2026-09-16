import api from "../../../shared/api/axios";
import type { History } from "../../../types/api/note";

// ノート一覧を取得する
export const getNotesApi = async (
    page: number = 1,
    pageSize: number = 20,
    ordering: string = "order",
) => {
    const res = await api.get("/notes/", {
        params: {
            //  axiosが自動的に/notes/?page=1&page_size=20&ordering=-created_atに変換する。
            page,
            page_size: pageSize,
            ordering,
        },
    });

    return res.data;
};

// ピン留めノートを取得する
export const getPinnedNotesApi = async (ordering: string = "pinned_order") => {
    const res = await api.get("/notes/pinned/", {
        params: {
            ordering,
        },
    });

    return res.data;
};

export const getAllNotesApi = async () => {
    const res = await api.get("/notes/", {
        params: {
            page_size: 9999,
        },
    });

    return res.data;
};

// ノート詳細を取得する
export const getNoteApi = async (id: number) => {
    const res = await api.get(`/notes/${id}`);

    return res.data;
};

export const getFavoriteNotesApi = async (
    page: number = 1,
    pageSize: number = 20,
    ordering: string = "-created_at",
) => {
    const res = await api.get("/notes/", {
        params: {
            //  ex) /notes/?page=1&pageSize=20&ordering=-created_at&is_favorite=true  ?以降はクエリーパラメーター:  URLの「? より後ろ」に付けて、サーバーに条件を伝えるための情報。
            page,
            page_size: pageSize,
            ordering,
            is_favorite: true,
        },
    });

    return res.data;
};

// ノートを投稿する。async が付いている関数は、必ずPromiseを返す。
export const createNoteApi = async (
    title: string,
    content: string,
    labelIds: number[],
    color: string,
) => {
    const res = await api.post("/notes/", {
        title,
        content,
        label_ids: labelIds,
        color: color,
    });

    // ↑のapi呼び出し部分でエラーが起こると、これ以降のコードは実行されない。

    // console.log("aaaaaaa");
    // console.log(`createNoteApiのres: ${res}`);

    return res.data;
};

// ノートの並び順を変更する。
export const reorderNotesApi = async (
    notes: {
        id: Number;
        order: Number;
    }[],
) => {
    const res = await api.patch("/notes/reorder/", notes);

    return res.data;
};

// ピン止めノートを並び替える
export const reorderPinnedNotesApi = async (
    notes: {
        id: number;
        pinned_order: number;
    }[],
) => {
    const res = await api.patch("/notes/pinned/reorder/", notes);

    return res.data;
};

// ノートのタイトル、内容を変更する
export const updateNoteApi = async (
    id: number,
    title: string,
    content: string,
) => {
    const res = await api.patch(`/notes/${id}/`, {
        title,
        content,
    });

    return res.data;
};

// ノートの背景色を変更する
export const updateNoteColorApi = async (id: number, color: string) => {
    const res = await api.patch(`notes/${id}/`, {
        color,
    });

    return res.data;
};

// 各ノートのラベルを更新する
export const updateNoteLabelsApi = async (
    noteId: number,
    labelIds: number[],
) => {
    const res = await api.patch(`/notes/${noteId}/`, {
        label_ids: labelIds,
    });

    return res.data;
};

// ノートをゴミ箱に移動させる
export const moveToTrashApi = async (id: number) => {
    const res = await api.patch(
        // patchは一部だけ更新という意味。
        `/notes/${id}/`,
        {
            is_deleted: true, // is_deletedをtrue に変えてという意味。
        },
    );

    return res.data;
};

// ゴミ箱に入れたノートを取得する
export const getTrashNotesApi = async (
    page: number = 1,
    pageSize: number = 20,
    ordering: string = "-created_at",
) => {
    const res = await api.get("/notes/", {
        params: {
            //  axiosが自動的に/notes/?page=1&page_size=20&ordering=-created_atに変換する。
            page,
            page_size: pageSize,
            ordering,
            is_deleted: true,
        },
    });

    return res.data;
};

// ゴミ箱に入れたノートを復元する
export const restoreNoteApi = async (id: number) => {
    const res = await api.patch(`/notes/${id}/`, {
        is_deleted: false,
    });

    return res.data;
};

// ノートを完全に削除する
export const deleteNoteForeverApi = async (id: number) => {
    await api.delete(`/notes/${id}/`);
};

// ゴミ箱内のノートを全て一括で削除する
export const emptyTrashApi = async () => {
    // const token = localStorage.getItem("access");

    await api.delete("/notes/trash/all/");
};

// ノートのお気に入りを切り替える
export const updateNoteFavoriteApi = async (
    id: number,
    is_favorite: boolean,
) => {
    const res = await api.patch(`notes/${id}/`, {
        is_favorite,
    });

    console.log(res);
    // console.log(res.data);

    return res.data;
};

export const updateNotePinnedApi = async (
    noteId: number,
    is_pinned: boolean,
) => {
    const res = await api.patch(`notes/${noteId}/`, {
        is_pinned,
    });

    return res.data;
};

// ノート単体の変更履歴を取得する
export const getNoteHistoryApi = async (id: number): Promise<History[]> => {
    // const token = localStorage.getItem("access");

    const res = await api.get(
        `/notes/${id}/history/`, // views.py、NoteViewSetの@historyメソッドが実行される
        // {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // },
    );

    return res.data;
};

// ノートに画像を追加する
export const uploadNoteImageApi = async (noteId: number, image: File) => {
    const formData = new FormData();

    formData.append("image", image); // 左のimageは、NoteImageSerializerのimageフィールドのこと。でも、そのSerializerはNoteImageモデルのimageカラムと対応しているので、実質的には「NoteImageモデルのimageカラム」と考えてOK。

    const res = await api.post(
        // resにはサーバーから返ってきたレスポンス全体が渡ってくる。
        `notes/${noteId}/images/`,
        formData,
    );

    return res.data;
};

// ノートが所持している画像を削除する
export const deleteNoteImageApi = async (imageId: number) => {
    const res = await api.delete(`/note-images/${imageId}/`);

    return res.data;
};

export const reorderNoteImageApi = async (
    noteId: number,
    images: {
        id: number;
        order: number;
    }[],
) => {
    const res = await api.patch(`notes/${noteId}/images/reorder/`, images);

    return res.data;
};

export const incrementNoteViewApi = async (noteId: number) => {
    // const token = localStorage.getItem("access");

    const res = await api.post(
        `/notes/${noteId}/view/`,
        {},
        // {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // },
    );

    return res.data;
};

export const updateNoteViewTimeApi = async (
    noteId: number,
    seconds: number,
) => {
    const res = await api.patch(`/notes/${noteId}/view_time/`, {
        seconds,
    });

    return res.data;
};
