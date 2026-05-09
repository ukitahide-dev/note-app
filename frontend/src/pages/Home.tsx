import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { FiPlus } from 'react-icons/fi';
import '../styles/pages/home.css';

export default function Home() {
  return (
    <Card className='home-card'>
      <CardHeader className='home-card-header'>
        <CardTitle className='home-card-title'>
          新しいノートを作成してみましょう
        </CardTitle>
      </CardHeader>
      <CardContent className='home-card-content'>
        <div className='home-input-container'>
          <input
            className='home-input'
            placeholder='ノートのタイトルを入力'
            type='text'
            onChange={() => {}}
          />
          <button className='home-button' onClick={() => {}}>
            <FiPlus size={16} />
            <span>ノート作成</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
