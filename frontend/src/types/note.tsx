export type Label = {
    id: number;
    name: string;
};




export type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
    is_favorite: boolean;
    is_pinned: boolean;
    labels: Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
};



export type History = {
    id: number;
    action: string;
    created_at: string;
    note: number,
}
