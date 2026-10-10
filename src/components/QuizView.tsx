import { useEffect, useMemo, useRef, useState } from "react";
import { avatarUrl, type Catalog } from "../data";
import { useI18n } from "../i18n";
import { DIFFICULTIES, LENGTHS, QuizMaker, questionImages, readBest, saveBest, type Difficulty, type Question } from "../quiz";
import type { Selected } from "../useUrlState";
import { Avatar } from "./Avatar";

interface Props {
  catalog: Catalog;
  onOpen: (selected: Selected) => void;
}

type Phase = "setup" | "play" | "over";

export function QuizView({ catalog, onOpen }: Props) {
  const { t, l } = useI18n();
  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("facil");
  const [length, setLength] = useState<number>(LENGTHS[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  /** Opção escolhida em cada pergunta já respondida (-1 = pulou). */
  const [picks, setPicks] = useState<number[]>([]);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);
  const nextButton = useRef<HTMLButtonElement>(null);
  const top = useRef<HTMLDivElement>(null);

  const key = `${difficulty}-${length}`;
  const q = questions[index];
  const picked = picks[index] ?? null;
  const score = picks.filter((p, i) => p === questions[i]?.answer).length;
  let streak = 0;
  for (let i = picks.length - 1; i >= 0 && picks[i] === questions[i].answer; i--) streak++;

  function start() {
    setQuestions(new QuizMaker(catalog, difficulty).game(length));
    setIndex(0);
    setPicks([]);
    setIsNewBest(false);
    setPhase("play");
    top.current?.scrollIntoView({ block: "nearest" });
  }

  function choose(option: number) {
    if (picked !== null || !q) return;
    setPicks((p) => [...p, option]);
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    const record = score > 0 && saveBest(key, score);
    setIsNewBest(record);
    setBest(readBest());
    setPhase("over");
  }

  // Depois de responder, o foco vai para "Próxima" (Enter avança).
  useEffect(() => {
    if (picked !== null) nextButton.current?.focus();
  }, [picked]);

  // Carrega antes as fotos da próxima pergunta.
  useEffect(() => {
    const upcoming = questions[index + 1];
    if (!upcoming) return;
    for (const id of questionImages(upcoming)) new Image().src = avatarUrl(id);
  }, [questions, index]);

  // Teclas 1 a 4 escolhem a opção.
  useEffect(() => {
    if (phase !== "play" || picked !== null || !q) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(n - 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  // ---------- Textos de cada pergunta ----------

  const character = (id: number) => catalog.byId.get(id)!;
  const episode = (id: number) => catalog.episodes.get(id)!;

  const prompt = (question: Question): string => {
    switch (question.kind) {
      case "who":
        return t.quiz.prompts.who;
      case "status":
      case "species":
      case "origin":
      case "debut":
        return t.quiz.prompts[question.kind](character(question.character).name);
      case "season":
      case "cast":
        return t.quiz.prompts[question.kind](episode(question.episode).name);
    }
  };

  const optionLabel = (question: Question, i: number): string => {
    switch (question.kind) {
      case "who":
      case "cast":
        return character(question.options[i]).name;
      case "status":
        return l.label("status", question.options[i]);
      case "species":
        return l.label("species", question.options[i]);
      case "origin":
        return l.place(catalog.locations.get(question.options[i])?.name ?? "unknown");
      case "season":
        return t.season(question.options[i]);
      case "debut": {
        const e = episode(question.options[i]);
        return `${e.code} · ${e.name}`;
      }
    }
  };

  /** Para onde o "ver no guia" leva depois da resposta. */
  const subject = (question: Question): Selected =>
    "character" in question ? { kind: "personagem", id: question.character } : { kind: "episodio", id: question.episode };

  const stateOf = (i: number) => {
    if (picked === null || !q) return "idle";
    if (i === q.answer) return "right";
    return i === picked ? "wrong" : "dim";
  };

  const verdict = useMemo(() => {
    if (!questions.length) return "";
    const ratio = score / questions.length;
    return ratio >= 0.9 ? t.quiz.verdicts.top : ratio >= 0.6 ? t.quiz.verdicts.good : t.quiz.verdicts.low;
  }, [score, questions.length, t]);

  // ---------- Telas ----------

  if (phase === "setup") {
    return (
      <div className="quiz" ref={top}>
        <div className="quiz-panel">
          <h2 className="quiz-title">{t.quiz.title}</h2>
          <p className="muted">{t.quiz.lead}</p>

          <fieldset className="quiz-field">
            <legend>{t.quiz.level}</legend>
            <div className="quiz-levels">
              {DIFFICULTIES.map((d) => (
                <button key={d} type="button" className="quiz-level" aria-pressed={difficulty === d} onClick={() => setDifficulty(d)}>
                  <strong>{t.quiz.levels[d]}</strong>
                  <span>{t.quiz.levelHints[d]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="quiz-field">
            <legend>{t.quiz.length}</legend>
            <div className="chips">
              {LENGTHS.map((n) => (
                <button key={n} type="button" aria-pressed={length === n} onClick={() => setLength(n)}>
                  {t.quiz.questions(n)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="quiz-start">
            <button type="button" className="button button-lg" onClick={start}>
              {t.quiz.start}
            </button>
            {best[key] !== undefined && <span className="muted">{t.quiz.best(best[key], length)}</span>}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="quiz" ref={top}>
        <div className="quiz-panel quiz-over">
          <p className="eyebrow">{t.quiz.levels[difficulty]}</p>
          <h2 className="quiz-score">{t.quiz.result(score, questions.length)}</h2>
          <p className="quiz-verdict">{verdict}</p>
          {isNewBest ? <p className="quiz-badge">{t.quiz.newBest}</p> : best[key] !== undefined && <p className="muted">{t.quiz.best(best[key], length)}</p>}
          <div className="quiz-actions">
            <button type="button" className="button" onClick={start}>
              {t.quiz.playAgain}
            </button>
            <button type="button" className="button button-ghost" onClick={() => setPhase("setup")}>
              {t.quiz.changeLevel}
            </button>
          </div>

          <h3 className="quiz-review-title">{t.quiz.review}</h3>
          <ol className="quiz-review">
            {questions.map((question, i) => {
              const ok = picks[i] === question.answer;
              const images = "character" in question ? [question.character] : [];
              return (
                <li key={i} data-correct={ok}>
                  <span className="quiz-mark" aria-label={ok ? t.quiz.right : t.quiz.wrong}>
                    {ok ? "✓" : "✗"}
                  </span>
                  {images.map((id) => (
                    <span key={id} className="face">
                      <Avatar id={id} name={character(id).name} size={28} />
                    </span>
                  ))}
                  <span className="quiz-review-text">
                    {prompt(question)}
                    <strong>{optionLabel(question, question.answer)}</strong>
                  </span>
                  <button type="button" className="link" onClick={() => onOpen(subject(question))}>
                    {t.quiz.seeInGuide}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const isCast = q.kind === "cast";
  const shown = "character" in q ? character(q.character) : null;
  const ep = "episode" in q ? episode(q.episode) : null;

  return (
    <div className="quiz" ref={top}>
      <div className="quiz-panel">
        <div className="quiz-hud">
          <span>{t.quiz.progress(index + 1, questions.length)}</span>
          <span>
            <strong>{score}</strong> {t.quiz.points(score)}
            {streak > 1 && <em className="quiz-streak">{t.quiz.streak(streak)}</em>}
          </span>
        </div>
        <div className="quiz-bar" aria-hidden="true">
          <span style={{ width: `${((index + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>

        <div className="quiz-question">
          {shown && (
            <div className="quiz-photo">
              <Avatar key={shown.id} id={shown.id} name={shown.name} size={300} alt={q.kind === "who" && picked === null ? t.quiz.mystery : shown.name} lazy={false} />
            </div>
          )}
          {ep && (
            <div className="quiz-episode">
              <span>{t.quiz.episode}</span>
              <strong>“{ep.name}”</strong>
              {q.kind === "cast" && <em>{ep.code}</em>}
            </div>
          )}
          <h2 className="quiz-prompt" aria-live="polite">
            {q.kind === "season" || q.kind === "cast" ? t.quiz.here[q.kind] : prompt(q)}
          </h2>
        </div>

        <ol className={isCast ? "quiz-cast" : "quiz-options"}>
          {q.options.map((_, i) => (
            <li key={`${index}-${i}`}>
              <button type="button" className="quiz-option" data-state={stateOf(i)} disabled={picked !== null} onClick={() => choose(i)}>
                {isCast ? (
                  <>
                    <span className="quiz-cast-image">
                      <Avatar id={q.options[i]} name={optionLabel(q, i)} size={160} lazy={false} />
                    </span>
                    <span className="quiz-cast-name">{optionLabel(q, i)}</span>
                  </>
                ) : (
                  <>
                    <kbd aria-hidden="true">{i + 1}</kbd>
                    <span>{optionLabel(q, i)}</span>
                  </>
                )}
              </button>
            </li>
          ))}
        </ol>

        {picked !== null && (
          <div className="quiz-feedback" data-good={picked === q.answer}>
            <p>
              <strong>{picked === q.answer ? t.quiz.right : t.quiz.wrong}</strong>{" "}
              {picked !== q.answer && t.quiz.answerWas(optionLabel(q, q.answer))}
            </p>
            <div className="quiz-actions">
              <button type="button" className="link" onClick={() => onOpen(subject(q))}>
                {t.quiz.seeInGuide}
              </button>
              <button ref={nextButton} type="button" className="button" onClick={next}>
                {index + 1 < questions.length ? t.quiz.next : t.quiz.finish}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
