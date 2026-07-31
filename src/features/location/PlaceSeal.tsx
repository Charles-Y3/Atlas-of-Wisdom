import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/useT';
import {
  placeCheckQuestionVariant,
  reshuffleQuestion,
  type QuizQuestion,
} from '../../engine/quiz';
import type { AtlasLocation } from '../../data/types';
import { useProgress } from '../../state/store';
import type { UiKey } from '../../i18n/strings';

const KIND_LABEL: Record<string, UiKey> = {
  country: 'quizQuestionCountry',
  tradition: 'quizQuestionTradition',
  category: 'quizQuestionCategory',
};

const STEPS = 2;
const MAX_WRONG_BEFORE_REROLL = 2;

/** Mastery-gated place check — seals the location as visited when passed. */
export default function PlaceSeal({ location }: { location: AtlasLocation }) {
  const { t, L } = useT();
  const visitLocation = useProgress((s) => s.visitLocation);
  const [step, setStep] = useState(0);
  const [variant, setVariant] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [current, setCurrent] = useState<QuizQuestion | null>(() =>
    placeCheckQuestionVariant(location.id, 0, 0),
  );
  const [status, setStatus] = useState<'idle' | 'reshuffled' | 'rerolled'>('idle');
  const [picked, setPicked] = useState<number | null>(null);
  const lockedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    clearTimers();
    lockedRef.current = false;
    setPicked(null);
    setStep(0);
    setVariant(0);
    setWrongCount(0);
    setStatus('idle');
    setCurrent(placeCheckQuestionVariant(location.id, 0, 0));
  }, [location.id]);

  if (!current) return null;

  function choose(i: number) {
    if (!current || lockedRef.current) return;
    lockedRef.current = true;
    setPicked(i);
    const correct = i === current.correctIndex;

    if (correct) {
      const id = setTimeout(() => {
        if (step + 1 >= STEPS) {
          visitLocation(location.id);
          return;
        }
        const nextStep = step + 1;
        setStep(nextStep);
        setVariant(0);
        setWrongCount(0);
        setStatus('idle');
        setCurrent(placeCheckQuestionVariant(location.id, nextStep, 0));
        setPicked(null);
        lockedRef.current = false;
      }, 700);
      timers.current.push(id);
      return;
    }

    const id = setTimeout(() => {
      const nextWrong = wrongCount + 1;
      if (nextWrong >= MAX_WRONG_BEFORE_REROLL) {
        const nextVariant = variant + 1;
        setCurrent(placeCheckQuestionVariant(location.id, step, nextVariant));
        setVariant(nextVariant);
        setWrongCount(0);
        setStatus('rerolled');
      } else {
        setCurrent(
          reshuffleQuestion(
            current,
            `place-reshuffle:${location.id}:${step}:${nextWrong}:${Date.now()}`,
          ),
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
    <div className="section">
      <h2>📍 {t('locSealTitle')}</h2>
      <div className="place-seal card">
        <p className="feature-sub">{t('locSealIntro')}</p>
        <p className="place-seal-progress">
          {step + 1}/{STEPS}
        </p>
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
              key={`${step}-${variant}-${opt.en}-${i}`}
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
          <p className="feature-sub" style={{ color: 'var(--bad)', marginTop: 6 }}>
            {t('quizWrong')}
          </p>
        )}
      </div>
    </div>
  );
}
