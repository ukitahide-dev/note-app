
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";


// 選択中のノートを取得する。
// 呼び出し元: useSelectedNoteLabels、SelectedNotesHeader

export function useSelectedNotes() {

    // Store
    const {
        notes,
        pinnedNotes,
        searchResultNotes,
        calendarDayNotes,

    } = useNoteStore();

    // Store
    const { selectedNoteIds } = useNoteSelectionStore();

    
    // 各一覧のノートをまとめる
    const allNotes = [
        ...notes,
        ...pinnedNotes,
        ...searchResultNotes,
        ...calendarDayNotes,
    ];

    // 選択中のノートを取得し、ID の重複を除外する。selectedNotesはhookで管理する。仮に、useNoteSelectionStoreで管理すると、NoteStoreのnotesと二重管理になり、データの整合性が崩れる可能性が出てくる。
    const selectedNotes = Array.from(
        new Map(
            allNotes
                .filter((note) => selectedNoteIds.includes(note.id))
                .map((note) => [note.id, note]),
        ).values(),
    );

    return {
        selectedNotes,
    };
}
