import React, { useState } from 'react';
import quizData from './data/combined_questions.json';

function QuizApp() {
  const [selectedRange, setSelectedRange] = useState('all');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = () => {
    let rangeQuestions;

    if (selectedRange === 'all') {
      // 組合所有章節的題目
      rangeQuestions = quizData.chapters.flatMap(chap => chap.questions);
    } else {
      // 僅選擇特定章節的題目
      rangeQuestions = quizData.chapters.find(chap => chap.chap === selectedRange).questions;
    }

    const selectedQuestions = rangeQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    setQuestions(selectedQuestions);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div>
      <h1>測驗系統</h1>
      <label>選擇章節：</label>
      <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
        <option value="all">所有章節 ({quizData.chapters.reduce((sum, chap) => sum + chap.questions.length, 0)} 題)</option>
        {quizData.chapters.map(chap => (
          <option key={chap.chap} value={chap.chap}>
            {chap.chap} ({chap.questions.length} 題)
          </option>
        ))}
      </select>

      <label>選擇題數：</label>
      <input
        type="number"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
      />

      <button onClick={startQuiz}>開始測驗</button>

      {questions.map((question, index) => (
        <Question
          key={index}
          question={question}
          updateScore={(isCorrect) => setScore(score + (isCorrect ? 1 : 0))}
        />
      ))}

      {showResult && <Result score={score} questionCount={questionCount} />}
    </div>
  );
}

function Question({ question, updateScore }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const checkAnswer = () => {
    const isCorrect = selectedOption === question.Detail?.Ans;
    updateScore(isCorrect);
    setIsAnswered(true);
  };

  return (
    <div>
      <h2>{question.Que}</h2>
      {['A', 'B', 'C', 'D'].map(option => (
        <div key={option}>
          <input
            type="radio"
            name={`question${question.Q_Num}`}
            value={question.Detail?.[`Options_${option}`]}
            onChange={() => setSelectedOption(question.Detail?.[`Options_${option}`])}
            disabled={!question.Detail?.[`Options_${option}`]} // 禁用缺少的選項
          />
          {question.Detail?.[`Options_${option}`] || 'N/A'} {/* 顯示 N/A 或其他替代內容 */}
        </div>
      ))}
      <button onClick={checkAnswer} disabled={isAnswered}>確認答案</button>

      {isAnswered && (
        <div>
          {selectedOption === question.Detail?.Ans ? '正確!' : '錯誤'}
          <p>{question.Detail?.Detailed_Answer || '無解答說明'}</p>
        </div>
      )}
    </div>
  );
}

function Result({ score, questionCount }) {
  return (
    <div>
      <h2>測驗結束！</h2>
      <p>您的分數是：{score} / {questionCount}</p>
    </div>
  );
}

export default QuizApp;
