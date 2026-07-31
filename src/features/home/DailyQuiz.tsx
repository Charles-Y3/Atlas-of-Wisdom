import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/useT';
import { todayKey } from '../../engine/daily';
import {
  dailyQuizQuestionVariant,
  dailyQuizQuestions,
  reshuffleQuestion,
  type QuizQuestion,
} from '../../engine/quiz';
import { CATEGORY_BY_ID } from '../../data/categories';
import { useProgress } from '../../state/store';
import type { UiKey } from '../../i18n/strings';

const KIND_LABEL: Record<string, UiKey> = {
  country: 'quizQuestionCountry',
  tradition: 'quizQuestionTradition',
  category: 'quizQuestionCategory',
};

const MAX_WRONG_BEFORE_REROLL = 2;

export default function DailyQuiz() {
  const { t, L } = useT();
  const today = todayKey();
  const baseQuestions = useMemo(() => dailyQuizQuestions(today), [today]);
  const quiz = useProgress((s) => s.quiz);
  const answerQuiz = useProgress((s) => s.answerQuiz);
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [variant, setVariant] = useState(0);
  const [current, setCurrent] = useState<QuizQuestion | null>(null);
  const [status, setStatus] = useState<'idle' | 'reshuffled' | 'rerolled'>('idle');
  /** Sync lock — React state alone races on double-taps before re-render. */
  const lockedRef = useRef(false);
  const questionRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const usedRef = useRef<Set<string>>(new Set());

  const answered = quiz?.day === today ? quiz.answered : 0;
  const done = answered >= 3;
  questionRef.current = answered;

  // Seed / advance the visible question when the slot changes.
  useEffect(() => {
    if (done) {
      setCurrent(null);
      return;
    }
    usedRef.current = new Set(baseQuestions.slice(0, answered).map((q) => q.location.id));
    const q = baseQuestions[answered];
    if (q) usedRef.current.add(q.location.id);
    setCurrent(q ?? null);
    setVariant(0);
    setWrongCount(0);
    setStatus('idle');
    setPicked(null);
    lockedRef.current = false;
  }, [answered, done, baseQuestions]);

  function clearTimers() {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  function choose(i: number) {
    if (!current || lockedRef.current) return;
    lockedRef.current = true;
    setPicked(i);
    const atQuestion = answered;
    const correct = i === current.correctIndex;

    if (correct) {
      const id = setTimeout(() => {
        if (questionRef.current !== atQuestion) return;
        answerQuiz(true, current.location.id);
      }, 700);
      timers.current.push(id);
      return;
    }

    const id = setTimeout(() => {
      if (questionRef.current !== atQuestion) return;
      const nextWrong = wrongCount + 1;
      if (nextWrong >= MAX_WRONG_BEFORE_REROLL) {
        const nextVariant = variant + 1;
        const next = dailyQuizQuestionVariant(today, answered, nextVariant, usedRef.current);
        setCurrent(next);
        setVariant(nextVariant);
        setWrongCount(0);
        setStatus('rerolled');
      } else {
        setCurrent(
          reshuffleQuestion(current, `daily-reshuffle:${today}:${answered}:${nextWrong}:${Date.now()}`),
        );
        setWrongCount(nextWrong);
        setStatus('reshuffled');
      }
      setPicked(null);
      lockedRef.current = false;
    }, 900);
    timers.current.push(id);
  }

  return (
    <div className="card feature-card">
      <div className="feature-kicker">
        💡 {t('homeDailyQuiz')} {done ? '✓' : `${answered}/3`}
      </div>
      {done ? (
        <p className="feature-sub">{t('quizDone')}</p>
      ) : !open ? (
        <button className="btn secondary" onClick={() => setOpen(true)} style={{ marginTop: 6 }}>
          {t('quizIntro')}
        </button>
      ) : current ? (
        <div className="reveal">
          <h3 className="feature-title" style={{ fontSize: 16 }}>
            {CATEGORY_BY_ID[current.location.category].emoji} {L(current.location.name)}
          </h3>
          <p className="feature-sub" style={{ marginBottom: 10 }}>
            {t(KIND_LABEL[current.kind])}
          </p>
          {status === 'reshuffled' && (
            <p className="feature-sub quiz-retry-note">{t('quizChoicesShuffled')}</p>
          )}
          {status === 'rerolled' && (
            <p className="feature-sub quiz-retry-note">{t('quizQuestionChanged')}</p>
          )}
          {current.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (picked !== null && i === picked) cls += i === current.correctIndex ? ' correct' : ' wrong';
            return (
              <button
                key={`${answered}-${variant}-${opt.en}-${i}`}
                type="button"
                className={cls}
                disabled={picked !== null}
                onClick={() => choose(i)}
              >
                {L(opt)}
              </button>
            );
          })}
          {picked !== null && picked !== current.correctIndex && (
            <p className="feature-sub" style={{ color: 'var(--bad)', marginTop: 4 }}>
              {t('quizWrong')}
            </p>
          )}
          {picked !== null && picked === current.correctIndex && (
            <p className="feature-sub">✓ {t('quizCorrect')}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
