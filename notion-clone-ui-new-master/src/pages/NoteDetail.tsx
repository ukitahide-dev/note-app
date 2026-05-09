import TitleInput from '../components/TitleInput';
import '../styles/pages/note-detail.css';

export default function NoteDetail() {
  return (
    <div className="note-detail-container">
      <div className="note-detail-content">
        <TitleInput />
      </div>
    </div>
  );
}
