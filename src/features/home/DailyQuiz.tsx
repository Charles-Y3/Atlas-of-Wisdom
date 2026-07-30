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
  /** Sync lock — React state alone races on double-taps before re-render. */
  const lockedRef = useRef(false);
  const questionRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const answered = quiz?.day === today ? quiz.answered : 0;
  const done = answered >= 3;
  const q = done ? null : questions[answered];
  questionRef.current = answered;

  function clearTimers() {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  // New question → unlock for the next attempt.
  useEffect(() => {
    clearTimers();
    lockedRef.current = false;
    setPicked(null);
  }, [answered]);

  function choose(i: number) {
    if (!q || lockedRef.current) return;
    lockedRef.current = true;
    setPicked(i);
    const atQuestion = answered;
    const correct = i === q.correctIndex;

    if (correct) {
      const id = setTimeout(() => {
        // Ignore stale timers if the question index already moved.
        if (questionRef.current !== atQuestion) return;
        answerQuiz(true);
        // unlock happens in the answered-effect after advance
      }, 700);
      timers.current.push(id);
      return;
    }

    // Mastery: never call answerQuiz on wrong — only unlock for retry.
    const id = setTimeout(() => {
      if (questionRef.current !== atQuestion) return;
      setPicked(null);
      lockedRef.current = false;
    }, 900);
    timers.current.push(id);
  }

  function tryAgain() {
    clearTimers();
    setPicked(null);
    lockedRef.current = false;
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
                key={`${answered}-${i}`}
                type="button"
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
              <button type="button" className="btn subtle" onClick={tryAgain}>
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
