import { useEffect, useState } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Layout.module.css";
import { useLabelStore } from "../../features/labels/store/labelStore";
// import { getLabels } from "../../features/notes/api/labelApi";









type Props = {
    children: React.ReactNode;   // Propsオブジェクトの中にchildrenというプロパティがあるという意味。children: React.ReactNodeは、childrenの型定義。React.ReactNodechildrenはReactで表示できるものという意味。
};



// Layout.tsxは、Header.tsxとSidebar.tsx、2つの親に当たる


export default function Layout({
    children,    // 分割代入でchildrenだけ取り出しているけど、:Propsはchildrenの型ではなくて、props全体の型を表している。

}: Props) {


    const [isOpen, setIsOpen] = useState(true);

    // Store
    const { fetchLabels } = useLabelStore();





    useEffect(() => {
        fetchLabels();
    }, []);



    // const toggleSidebar = () => {
    //     setIsOpen(!isOpen);
    // };



    return (

        <div className={styles.layout}>

            <Header
                onMenuClick={() => setIsOpen(prev => !prev)}
            />

            <div className={styles.body}>

                <Sidebar
                    isOpen={isOpen}
                />

                {/* App.tsxで <Layout>〜</Layout> の中に書いたものが children に入る。 <NotesPage />とかが入る*/}
                <main className={styles.main}>
                    {children}
                </main>

            </div>

        </div>
    );
}
