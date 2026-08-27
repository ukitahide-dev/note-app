






export default function EmailChangePending() {

    return (

        <div>

            <h2>
                確認メールを送信しました。
            </h2>

            <h1>
                メールアドレス変更
            </h1>


            <div>

                <span>1</span>
                <span>入力</span>

                <span>2</span>
                <span>メール認証</span>

                <span>3</span>
                <span>完了</span>

            </div>


            <p>
                ※メールアドレスの変更はまだ完了していません。
            </p>

            <p>
                現在ご利用中のメールアドレスと
                新しいメールアドレスに確認メールを送信しました。
            </p>

            <p>
                ログアウトせずに、確認メールに記載の
                認証URLに1時間以内にアクセスし、
                変更を完了してください。
            </p>


            <div>

                <p>
                    現在ご利用中のメールアドレス
                </p>

                <strong>
                    yukihunji@gmail.com
                </strong>

            </div>


            <div>

                <p>
                    新しいメールアドレス
                </p>

                <strong>
                    o@g.com
                </strong>

            </div>

        </div>

    );
}
