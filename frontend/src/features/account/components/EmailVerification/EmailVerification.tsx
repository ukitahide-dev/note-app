

type Props = {
    onSuccess: () => void;
}




export default function EmailVerification({
    onSuccess,

}: Props) {

    return (

        <div>
            <h2>メール認証</h2>

            <p>
                登録したメールアドレスに確認コードを送信しました。
            </p>

            <input
                type="text"
                placeholder="確認コード"
            />

            <button>
                認証する
            </button>
        </div>
    );
}
