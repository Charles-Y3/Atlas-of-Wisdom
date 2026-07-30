import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/useT';
import { todayKey } from '../../engine/daily';
import { dailyQuizQuestions } from '../../engine/quiz';
import { CATEGORY_BY_ID } from '../../data/categories';
import { useProgress } from '../../state/store';
import type { UiKey } from '../../i18n/strings';

const KIND_LABEL: Record<string, UiKey> = {
  country: 'quizQuestionCountry',
  tradition: 'quizQuestionTradition',
  category: 'quizQuestionCategory',
};

export default function DailyQuiz() {
  const { t, L } = useT();
  const today = todayKey();
  const questions = useMemo(() => dailyQuizQuestions(today), [today]);
  const quiz = useProgress((s) => s.quiz);
  const answerQuiz = useProgress((s) => s.answerQuiz);
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const answered = quiz?.day === today ? quiz.answered : 0;
  const done = answered >= 3;
  const q = done ? null : questions[answered];

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function choose(i: number) {
    if (!q || picked !== null) return;
    setPicked(i);
    const correct = i === q.correctIndex;
    if (correct) {
      setTimeout(() => {
        answerQuiz(true);
        setPicked(null);
      }, 700);
      return;
    }
    // Mastery: never advance on wrong — clear after brief feedback.
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setPicked(null), 900);
  }

  return (
    <div className="card feature-card">
      <div className="feature-kicker">💡 {t('homeDailyQuiz')} {done ? '✓' : `${answered}/3`}</div>
      {done ? (
        <p className="feature-sub">{t('quizDone')}</p>
      ) : !open ? (
        <button className="btn secondary" onClick={() => setOpen(true)} style={{ marginTop: 6 }}>
          {t('quizIntro')}
        </button>
      ) : q ? (
        <div className="reveal">
          <h3 className="feature-title" style={{ fontSize: 16 }}>
            {CATEGORY_BY_ID[q.location.category].emoji} {L(q.location.name)}
          </h3>
          <p className="feature-sub" style={{ marginBottom: 10 }}>{t(KIND_LABEL[q.kind])}</p>
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (picked !== null && i === picked) cls += i === q.correctIndex ? ' correct' : ' wrong';
            return (
              <button
                key={i}
                className={cls}
                disabled={picked !== null}
                onClick={() => choose(i)}
              >
                {L(opt)}
              </button>
            );
          })}
          {picked !== null && picked !== q.correctIndex && (
            <>
              <p className="feature-sub" style={{ color: 'var(--bad)', marginTop: 4 }}>
                {t('quizWrong')}
              </p>
              <button
                className="btn subtle"
                onClick={() => {
                  if (resetTimer.current) clearTimeout(resetTimer.current);
                  setPicked(null);
                }}
              >
                {t('quizTryAgain')}
              </button>
            </>
          )}
          {picked !== null && picked === q.correctIndex && (
            <p className="feature-sub">✓ {t('quizCorrect')}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
