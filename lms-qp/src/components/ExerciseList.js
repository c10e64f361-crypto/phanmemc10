// src/components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/courses/${courseId}/questions/answers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = res.data.data;
      setQuestions(data);
      const initial = {};
      let total = 0;
      data.forEach(q => {
        if (q.selected_answer) {
          initial[q.id] = q.selected_answer;
          if (q.is_correct) total++;
        }
      });
      setAnswers(initial);
      setSubmitted(data.some(q => q.selected_answer));
      setScore(total);
    });
  }, [courseId]);

  const handleAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    for (const [qid, ans] of Object.entries(answers)) {
      await axios.post(`${API_URL}/api/courses/${courseId}/questions/${qid}/submit`, {
        selected_answer: ans
      }, { headers: { Authorization: `Bearer ${token}` } });
    }
    alert('Nộp bài thành công!');
    setSubmitted(true);
    window.location.reload();
  };

  if (questions.length === 0) return <p className="text-center text-gray-500">Chưa có câu hỏi</p>;

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="bg-white p-5 rounded-lg shadow">
          <p className="font-medium mb-3">Câu {idx + 1}: {q.title}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const selected = answers[q.id] === letter;
              const correct = q.correct_answer === letter;
              const wrong = submitted && selected && !correct;

              return (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded border cursor-pointer
                    ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${correct && submitted ? 'border-green-500 bg-green-50' : ''}
                    ${wrong ? 'border-red-500 bg-red-50' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={letter}
                    checked={selected}
                    onChange={() => handleAnswer(q.id, letter)}
                    disabled={submitted}
                    className="w-4 h-4"
                  />
                  <span>{opt}</span>
                  {submitted && correct && <span className="text-green-600">✓</span>}
                  {wrong && <span className="text-red-600">✗</span>}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && Object.keys(answers).length === questions.length && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          Nộp bài
        </button>
      )}

      {submitted && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-xl font-bold text-green-700">
            Điểm: {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;