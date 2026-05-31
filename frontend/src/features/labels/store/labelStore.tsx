// Zustandは「共有stateをまとめたオブジェクト」を作るライブラリ。
import { create } from "zustand";



// ---- api ----
import {
    getLabels,
    createLabel,
    updateLabel,
    deleteLabel,
} from "../../notes/api/labelApi";


type Label = {
    id: number;
    name: string;
};



type LabelStore = {
    labels: Label[];

    fetchLabels: () => Promise<void>;

    handleCreateLabel: (
        name: string
    ) => Promise<void>;
};




export const useLabelStore = create<LabelStore>((set) => ({  // create()はZustandの関数。共有stateを作るという意味。このstoreは LabelStore 型。set はZustandのstate更新関数。

    labels: [], // labelsの初期値は空配列。

    // ラベル一覧取得
    fetchLabels: async () => {

        try {

            const data = await getLabels();

            set({
                labels: data  // グローバルstate更新。useLabelStore()使ってる全コンポーネントを再レンダリングする。
            });

        } catch (error) {

            console.error(error);

        }
    },

    // ラベル作成
    handleCreateLabel: async (
        name: string
    ) => {

        try {

            const newLabel = await createLabel(name);

            set((state) => ({  // state は「現在のstoreの状態」。store = 状態をまとめた箱のこと。今回の場合は、{labels: [], fetchLabels: fn, handleCreateLabel: fn}全体のこと。今の labels に newLabel を追加して更新する処理。
                labels: [
                    ...state.labels,  // state.labelsでstoreの中のlabelsだけを取り出している。
                    newLabel,
                ]
            }));

        } catch (error) {

            console.error(error);

        }
    },



    // ラベル編集
    handleUpdateLabel: async (
        id: number,
        name: string
    ) => {

        try {

            const newLabel = await updateLabel(id, name);

            set((state) => {
                labels: state.labels.map(
                    (label) =>
                        label.id === id ? newLabel : label
                )
            });


        } catch (error) {

            console.error(error);

        }

    }

}));





    // ラベルを削除する
    handleDeleteLabel: async (
        id: number
    ) => {

        try {

            await deleteLabel(id);

            set((state) => ({
                labels: state.labels.filter(
                    (label) => label.id !== id
                )
            }));

        } catch (error) {

            console.error(error)
        }


    }
