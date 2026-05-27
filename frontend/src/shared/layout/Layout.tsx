import { useEffect, useState } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Layout.module.css";
import { useLabelStore } from "../../features/labels/store/labelStore";
// import { getLabels } from "../../features/notes/api/labelApi";



// Layout.tsxはHeader.tsxとSidebar.tsx、2つの親に当たる


// type Label = {
//     id: number;
//     name: string;
// };

// type Note = {
//     id: number;
//     title: string;
//     content: string;
//     labels:  Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
// };


type Props = {
    children: React.ReactNode;   // Propsオブジェクトの中にchildrenというプロパティがあるという意味。children: React.ReactNodeは、childrenの型定義。React.ReactNodechildrenはReactで表示できるものという意味。
};






export default function Layout({ children }: Props) {  // 分割代入でchildrenだけ取り出しているけど、:Propsはchildrenの型ではなくて、props全体の型を表している。

    // const [labels, setLabels] = useState<Label[]>([]);  // labelsはLabel型の配列。初期値は空の配列。
    const [isOpen, setIsOpen] = useState(true);

    const { fetchLabels } = useLabelStore();


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    useEffect(() => {
        fetchLabels();
    }, []);


    // Zustand使うと、これも不要になった。
    // useEffect(() => {
    //     const fetchLabels = async () => {
    //         try {

    //         const data = await getLabels();
    //         setLabels(data);

    //         } catch (error) {

    //             console.error(error);

    //         }
    //     };

    //     fetchLabels();

    // }, []);





    return (

        <div className={styles.layout}>

            <Header onMenuClick={toggleSidebar}/>

            <div className={styles.body}>

                <Sidebar
                    // labels={labels}
                    isOpen={isOpen}
                />

                {/* App.tsxで <Layout>〜</Layout> の中に書いたものが children に入る */}
                <main className={styles.main}>
                    {children}
                </main>

            </div>

        </div>
    );
}
