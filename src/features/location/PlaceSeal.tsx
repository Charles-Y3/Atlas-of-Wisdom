import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/useT';
import { placeCheckQuestions } from '../../engine/quiz';
import type { AtlasLocation } from '../../data/types';
import { useProgress } from '../../state/store';
import type { UiKey } from '../../i18n/strings';

const KIND_LABEL: Record<string, UiKey> = {
  country: 'quizQuestionCountry',
  tradition: 'quizQuestionTradition',
  category: 'quizQuestionCategory',
};

/** Mastery-gated place check — seals the location as visited when passed. */
export default function PlaceSeal({ location }: { location: AtlasLocation }) {
  const { t, L } = useT();
  const visitLocation = useProgress((s) => s.visitLocation);
  const questions = useMemo(() => placeCheckQuestions(location.id), [location.id]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const lockedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const q = questions[step];

  function clearTimers() {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    clearTimers();
    lockedRef.current = false;
    setPicked(null);
  }, [step, location.id]);

  if (!q) return null;

  function choose(i: number) {
    if (!q || lockedRef.current) return;
    lockedRef.current = true;
    setPicked(i);
    const correct = i === q.correctIndex;

    if (correct) {
      const id = setTimeout(() => {
        if (step + 1 >= questions.length) {
          visitLocation(location.id);
          return;
        }
        setStep((s) => s + 1);
      }, 700);
      timers.current.push(id);
      return;
    }

    const id = setTimeout(() => {
      setPicked(null);
      lockedRef.current = false;
    }, 900);
    timers.current.push(id);
  }

  return (
    <div className="section">
      <h2>📍 {t('locSealTitle')}</h2>
      <div className="place-seal card">
        <p className="feature-sub">{t('locSealIntro')}</p>
        <p className="place-seal-progress">
          {step + 1}/{questions.length}
        </p>
        <p className="feature-sub" style={{ marginBottom: 10 }}>
          {t(KIND_LABEL[q.kind])}
        </p>
        {q.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (picked !== null && i === picked) cls += i === q.correctIndex ? ' correct' : ' wrong';
          return (
            <button
              key={`${step}-${i}`}
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
          <p className="feature-sub" style={{ color: 'var(--bad)', marginTop: 6 }}>
            {t('quizWrong')}
          </p>
        )}
      </div>
    </div>
  );
}
