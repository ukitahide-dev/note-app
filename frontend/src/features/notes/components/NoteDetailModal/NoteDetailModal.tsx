import { useEffect, useRef, useState } from 'react'

// ---- component ----
import NoteMenu from '../SortableNoteCard/NoteMenu/NoteMenu'
import LabelPanel from '../SortableNoteCard/LabelPanel/LabelPanel'
import { HistoryPanel } from '../HistoryPanel/HistoryPanel'
import { ImageList } from '../ImageList/ImageList'
import LabelItem from '../LabelItem/LabelItem'


// ---- css ----
import styles from './NoteDetailModal.module.css'


import ColorPalette from '../../../../shared/ui/ColorPalette/ColorPalette'
import { useNoteLabels } from '../../hooks/useNoteLabels'

// ---- types ----
import type { Note } from '../../../../types/note'
import { useNoteStore } from '../../store/useNoteStore'
import { useNoteColor } from '../../hooks/useNoteColor'


// ---- utils ----
import { splitImages } from '../../utils/splitImages'






type Props = {
  note: Note;

  onClose: () => void;

//   setOpenNoteDetailId: React.Dispatch<React.SetStateAction<number | null>>;

// setOpenNoteDetailId: () => void;


}



// 親: NoteCard.tsx

export default function NoteDetailModal({
    note,
    onClose,

    setOpenNoteDetailId,

}: Props) {

    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content)

    const [panelType, setPanelType] = useState<
        'menu' | 'color' | 'label' | 'history' | null
    >(null)



    // useNoteColor hooks
    const { tempColor, handleSelectColor, saveColor } = useNoteColor(note)


    // useNoteLabels hooks
    const { labelStates, handleSelectLabel, handleRemoveLabel } = useNoteLabels({
        note,
    })


    // useNoteStore
    const {
        updateNote,
        updateNoteColor,
        createNote,
        moveToTrash,
        deleteNoteImage,
        incrementNoteView,
        updateNoteViewTime,
    } = useNoteStore()


    // utils
    const {
        largeImages,
        normalImages,
    } = splitImages(note.images);


    const closed = useRef(false);



    const handleClose = async () => {

        console.log("handleClose実行")

        if (closed.current) {
            return;
        }

        closed.current = true;


        const seconds = Math.floor((Date.now() - startTime.current) / 1000) ;
        console.log(seconds);

        await updateNoteViewTime(note.id, seconds);



        if (title !== note.title || content !== note.content) {
            await updateNote(note.id, title, content);
        }

        if (tempColor !== note.color) {
            await updateNoteColor(note.id, tempColor);
            // await saveColor();  // ここでuseNoteColor hookを経由する意味がない気がする
        }

        // setOpenNoteDetailId(null);  この書き方はコンポーネントの再利用性が下がる。親がopenNoteDetailIdという状態を持っていることが前提になっているから。
        onClose();
        // setOpenNoteDetailId();
    }



    const viewed = useRef(false);  // このモーダルはもう閲覧数加算処理を実行したか？を記録する箱。{ current: false }
    const startTime = useRef(0);  // ノート詳細を開いた瞬間の時刻を保存しておく箱。{ current: 0 }という箱ができる。


    useEffect(() => {

        if (viewed.current) {
            return;
        }

        startTime.current = Date.now();


        viewed.current = true;

        incrementNoteView(note.id);


    }, [note.id]);







    return (
            <div
                className={styles.overlay}
                onClick={handleClose}


            >
                <div
                    className={styles.modal}
                    style={{ backgroundColor: tempColor }}
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className={styles.largeImages}>
                        <ImageList
                            images={largeImages}
                            isLarge={true}
                            noteId={note.id}
                            onDeleteImage={async (imageId) => {
                                await deleteNoteImage(note.id, imageId)
                            }}
                        />

                    </div>

                    <div className={styles.images}>
                        <ImageList
                            images={normalImages}
                            isLarge={false}
                            noteId={note.id}
                            onDeleteImage={async (imageId: number) => {
                                await deleteNoteImage(note.id, imageId)
                            }}
                        />

                    </div>

                    <input
                        className={styles.titleInput}
                        style={{ backgroundColor: tempColor }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className={styles.contentInput}
                        style={{ backgroundColor: tempColor }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        />

                    {/* ノートが所持しているラベル名表示 NoteCardと被っている*/}
                    <div className={styles.labels}>

                        {note.labels.map(
                            (label) => (
                                <LabelItem
                                    label={label}
                                    onRemoveLabel={(labelId: number) => handleRemoveLabel(labelId)}
                                />
                            )
                        )}
                    </div>

                    {/* ボタン表示もNoteCardと被っている */}
                    <div className={styles.bottom}>
                        <button
                            onClick={(e) => {
                            e.stopPropagation()
                            setPanelType('color')
                            // setIsColorOpen((prev) => !prev);
                            // setIsMenuOpen(false)
                            // setOpenMenuId(null);
                            // setOpenColorId((prev) => prev === note.id ? null : note.id);
                            }}
                        >
                            🎨
                        </button>

                        <button
                            className={styles.menuButton}
                            onClick={(e) => {
                            e.stopPropagation()
                            setPanelType('menu')
                            // setIsMenuOpen((prev) => !prev);
                            // setIsColorOpen(false)
                            }}
                        >
                            ⋮
                        </button>

                        <button
                            className={styles.button}
                            onClick={handleClose}
                            // onClick={
                            //         async () => {
                            //                 await handleSave(note.id, title, content);
                            //                 await saveColor();
                            //                 // onSave(note.id, title, content);
                            //                 // onUpdateColor(note.id, tempColor);

                            //             }
                            //     }
                        >
                            閉じる
                        </button>
                    </div>

                    {panelType === 'color' && (
                        <ColorPalette
                            onSelectColor={handleSelectColor}
                            // onUpdateColor={onUpdateColor}
                            // note={note}
                            tempColor={tempColor}
                            onClose={saveColor}
                        />
                    )}

                    {panelType === 'menu' && (
                    <NoteMenu
                        onOpenLabel={() => setPanelType('label')}
                        onOpenHistory={() => setPanelType('history')}
                        onMoveToTrash={() => moveToTrash(note.id)}
                        onDuplicateNote={() =>
                            createNote(
                                note.title,
                                note.content,
                                note.labels.map((label) => label.id),
                                note.color,
                            )
                        }
                        // onDuplicateNote={() => onDuplicateNote(note)}
                    />
                    )}

                    {panelType === 'label' && (
                        <LabelPanel
                            // selectedLabels={selectedLabels}
                            labelStates={labelStates}
                            onSelectLabel={handleSelectLabel}
                        />
                    )}

                    {panelType === 'history' && (
                        <HistoryPanel note={note} onClose={() => setPanelType(null)} />
                    )}
                </div>
            </div>
        )
    }






// utilsに移して不要になった
    // const imageCount = note.images.length;

    // const remainder = imageCount % 3;

    // let largeCount = 0;

    // if (remainder === 1) {
    //     largeCount = 1;
    // }

    // if (remainder === 2) {
    //     largeCount = 2;
    // }

    // ノートが所持している画像を計算する
    // const normalImages = note.images.filter((_, index) => index >= largeCount);
    // const largeImages = note.images.filter((_, index) => index < largeCount);




// LabelItemコンポに切り出した
                            // <div
                            //     key={label.id}
                            //     className={styles.label}
                            // >
                            //     <span

                            //     >
                            //         {label.name}
                            //     </span>

                            //     <button
                            //         className={styles.removeLabel}
                            //         onClick={(e) => {
                            //             e.stopPropagation();
                            //             handleRemoveLabel(
                            //                 label.id
                            //             );
                            //         }}
                            //     >
                            //         ×
                            //     </button>

                            // </div>

// ) : (

//                         <NoteMenu
//                             onOpenLabel={handleOpenLabel}
//                             onMoveToTrash={() => moveToTrash(note.id)}
//                             onDuplicateNote={
//                                 () =>
//                                     createNote(
//                                         note.title,
//                                         note.content,
//                                         note.labels.map((label) => label.id),
//                                         note.color
//                                     )
//                             }
//                             // onDuplicateNote={() => onDuplicateNote(note)}

//                         />

//                     )

// const saveColor = async () => {

//     try {

//         const updatedNote = await updateNoteColor(Number(note.id), tempColor);
//         updateNote(updatedNote);  // useNoteStore

//     } catch (error) {

//         console.error(error);

//     }

// }

// const handleSave = async (
//     id: number,
//     title: string,
//     content: string,

// ) => {

//     try {
//         const updatedNote = await updateNoteApi(Number(id), title, content);
//         updateNote(updatedNote);  // useNoteStore

//     } catch (error) {
//         console.error(error);
//         alert("保存失敗");
//     }

//     setOpenNoteDetailId(null);  // これはここに書けない。どうするか。今のままだと、閉じたときに、モーダルが開いたままになる。

// }

// 色の選択をUIに表示する
// const handleSelectColor = (
//     color: string
// ) => {
//     setTempColor(color);
// }

// const saveColor = async (

// ) => {
//     await updateNoteColor(note.id, tempColor);
//     setPanelType(null);

// }
