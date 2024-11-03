import React, { useState } from 'react';
import quizData from './data/combined_questions.json';

function QuizApp() {
  const [selectedRange, setSelectedRange] = useState('all');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = () => {
    let rangeQuestions;

    if (selectedRange === 'all') {
      rangeQuestions = quizData.chapters.flatMap(chap =>
        chap.questions.map(question => ({ ...question, chap: chap.chap }))
      );
    } else {
      const selectedChapter = quizData.chapters.find(chap => chap.chap === selectedRange);
      rangeQuestions = selectedChapter.questions.map(question => ({
        ...question,
        chap: selectedChapter.chap
      }));
    }

    const selectedQuestions = rangeQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    setQuestions(selectedQuestions);
    setUserAnswers({});
    setScore(0);
    setShowResult(false);
  };

  const handleAnswerChange = (questionNum, answer) => {
    setUserAnswers(prevAnswers => ({ ...prevAnswers, [questionNum]: answer }));
  };

  const submitAnswers = () => {
    let totalScore = 0;

    questions.forEach(question => {
      const userAnswer = userAnswers[question.Q_Num];
      if (userAnswer === question.Detail?.Ans) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
    setShowResult(true);
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
          userAnswer={userAnswers[question.Q_Num]}
          onAnswerChange={(answer) => handleAnswerChange(question.Q_Num, answer)}
          showResult={showResult}
        />
      ))}

      <button onClick={submitAnswers} disabled={questions.length === 0}>提交答案</button>

      {showResult && <Result score={score} questionCount={questionCount} />}
    </div>
  );
}

function Question({ question, userAnswer, onAnswerChange, showResult }) {
  const handleOptionChange = (option) => {
    onAnswerChange(option);
  };

  const isCorrect = userAnswer === question.Detail?.Ans;

  return (
    <div>
      <h2>{question.Que}</h2>
      {['A', 'B', 'C', 'D'].map(option => (
        <div key={option}>
          <input
            type="radio"
            name={`question${question.Q_Num}`}
            value={question.Detail?.[`Options_${option}`]}
            onChange={() => handleOptionChange(question.Detail?.[`Options_${option}`])}
            checked={userAnswer === question.Detail?.[`Options_${option}`]} // 確保選中正確的選項
            disabled={showResult || !question.Detail?.[`Options_${option}`]} // 禁用缺少的選項
          />
          {question.Detail?.[`Options_${option}`] || 'N/A'} {/* 顯示 N/A 或其他替代內容 */}
        </div>
      ))}

      {showResult && (
        <div>
          <p className='TF'>{isCorrect ? '正確!' : '錯誤'}</p>
          {!isCorrect && <p className='Ans'>正確答案：{question.Detail?.Ans}</p>}
          <p className='Detail'>詳解：{question.Detail?.Detailed_Answer || '無解答說明'}</p>
          <p className='Chap'>章節：{question.chap}</p> {/* 顯示章節名稱 */}
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
