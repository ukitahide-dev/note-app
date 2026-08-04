// Django APIから返ってくるJSONの型を書く。


export type Label = {
    id: number;
    name: string;
};


export type NoteImage = {
    id: number;
    note: number;
    image: string;
}



export type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
    is_favorite: boolean;
    is_pinned: boolean;
    labels: Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
    images: NoteImage[];
    view_count: number;
    total_view_seconds: number;
    created_at: string;
};



export type History = {
    id: number;
    action: string;
    created_at: string;
    note: number,
}
