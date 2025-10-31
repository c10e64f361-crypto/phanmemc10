// src/pages/CourseLearn.js – THÊM IMPORT
import ExerciseList from '../components/ExerciseList';
import { exercises } from '../data/exercises';

// Trong component:
const [exercises, setExercises] = useState(exercises);

// Hàm nộp bài
const handleSubmitExercise = (id, filename) => {
  setExercises(prev => prev.map(ex => 
    ex.id === id 
      ? { ...ex, status: 'đã nộp', file: filename, score: null, feedback: null }
      : ex
  ));
};

// Trong phần render tab:
{activeTab === 'exercise' && (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Bài tập</h2>
    <ExerciseList exercises={exercises} onSubmit={handleSubmitExercise} />
  </div>
)}