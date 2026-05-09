import '../styles/pages/auth.css';

export default function Signin() {
  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <h2 className='auth-title'>Notionクローン</h2>
        <div className='auth-form-container'>
          <div className='auth-card'>
            <div className='auth-form'>
              <div>
                <label className='auth-label' htmlFor='email'>
                  メールアドレス
                </label>
                <div className='auth-input-container'>
                  <input
                    onChange={() => {}}
                    id='email'
                    name='email'
                    placeholder='メールアドレス'
                    required
                    type='email'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <label className='auth-label' htmlFor='password'>
                  パスワード
                </label>
                <div className='auth-input-container'>
                  <input
                    onChange={() => {}}
                    id='password'
                    name='password'
                    placeholder='パスワード'
                    required
                    type='password'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => {}}
                  className='home-button'
                  style={{ width: '100%' }}
                >
                  ログイン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
