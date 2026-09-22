// Zustandは「共有stateをまとめたオブジェクト」を作るライブラリ。
import { create } from "zustand";

import type { Label } from "../../../types/api/note";

// ---- api ----
import {
    getLabelsApi,
    createLabelApi,
    updateLabelApi,
    deleteLabelApi,
    getUsedLabelsApi,

} from "../../notes/api/labelApi";



type LabelStore = {

    labels: Label[];  // labelsはLabel型の配列

    usedLabels: Label[];

    fetchLabels: () => Promise<void>;

    handleCreateLabel: (name: string) => Promise<void>;

    handleUpdateLabel: (id: number, name: string) => Promise<void>;

    handleDeleteLabel: (id: number) => Promise<void>;


    fetchUsedLabels: () => Promise<void>;

};




export const useLabelStore = create<LabelStore>((set) => ({
    // create()はZustandの関数。共有stateを作るという意味。このstoreは LabelStore 型。set はZustandのstate更新関数。

    labels: [], // labelsの初期値は空配列。

    usedLabels: [],

    // ラベル一覧取得
    fetchLabels: async () => {

        try {
            const data = await getLabelsApi();

            set({
                labels: data, // グローバルstate更新。useLabelStore()使ってる全コンポーネントを再レンダリングする。
            });

        } catch (error) {
            console.error(error);
        }
    },

    // ラベル作成
    handleCreateLabel: async (
        name: string,

    ) => {

        try {

            const newLabel = await createLabelApi(name);

            set((state) => ({
                // state は「現在のstoreの状態」。store = 状態をまとめた箱のこと。今回の場合は、{labels: [], fetchLabels: fn, handleCreateLabel: fn}全体のこと。今の labels に newLabel を追加して更新する処理。
                labels: [
                    ...state.labels, // state.labelsでstoreの中のlabelsだけを取り出している。
                    newLabel,
                ],
            }));

        } catch (error) {

            console.error(error);

        }
    },

    // ラベル名編集
    handleUpdateLabel: async (
        labelId: number,
        name: string,

    ) => {

        try {

            const newLabel = await updateLabelApi(labelId, name);

            set((state) => {
                // set() に渡してるのは関数。(state) => { }という関数。

                return {

                    labels: state.labels.map((label) =>
                        label.id === labelId ? newLabel : label,
                    ),

                };
            });

            // set((state) => ({  省略形
            //     labels: state.labels.map(
            //         (label) => label.id === id ? newLabel: label
            //     )
            // }));
        } catch (error) {
            console.error(error);
        }
    },


    // ラベル削除
    handleDeleteLabel: async (id: number) => {

        try {

            await deleteLabelApi(id);

            set((state) => ({
                labels: state.labels.filter((label) => label.id !== id),
            }));

        } catch (error) {

            console.error(error);
            
        }
    },



    // ノートに使われているラベルだけを取得する
    fetchUsedLabels: async (

    ) => {

        try {

            const data = await getUsedLabelsApi();

            set({
                usedLabels: data
            })

        }  catch (error) {

            console.error(error);

        }


    }



}));
