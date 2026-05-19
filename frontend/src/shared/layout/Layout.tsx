import { useState } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Layout.module.css";



// Layout.tsxはHeader.tsxとSidebar.tsx、2つの親に当たる



type Props = {
    children: React.ReactNode;   // Propsオブジェクトの中にchildrenというプロパティがあるという意味。children: React.ReactNodeは、childrenの型定義。React.ReactNodechildrenはReactで表示できるものという意味。
};



export default function Layout({ children }: Props) {  // 分割代入でchildrenだけ取り出しているけど、:Propsはchildrenの型ではなくて、props全体の型を表している。

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };



    return (

        <div className={styles.layout}>

            <Header onMenuClick={toggleSidebar}/>

            <div className={styles.body}>

                <Sidebar isOpen={isOpen}/>

                {/* App.tsxで <Layout>〜</Layout> の中に書いたものが children に入る */}
                <main className={styles.main}>
                    {children}
                </main>

            </div>

        </div>
    );
}
