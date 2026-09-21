"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Mic, Send, Sparkles, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const candidate = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition ?? null;
}

type SuggestedTask = {
  title: string;
  detail?: string;
};

function splitIntoTasks(text: string): SuggestedTask[] {
  return text
    .split(/[\n.;]|,\s*(?=and\s)|\band then\b|\balso\b/i)
    .map((part) => part.replace(/^(and|then|also)\s+/i, "").trim())
    .filter((part) => part.length > 2)
    .slice(0, 12)
    .map((part) => ({ title: part.charAt(0).toUpperCase() + part.slice(1) }));
}

export function VoiceTaskCapture({
  role,
  onAddTasks,
}: {
  role: "affected" | "caregiver" | null;
  onAddTasks: (tasks: SuggestedTask[]) => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [organizing, setOrganizing] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [notice, setNotice] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSpeechSupported(getSpeechRecognition() !== null);
    return () => recognitionRef.current?.stop();
  }, []);

  function startListening() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      let addition = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        addition += `${event.results[index][0].transcript} `;
      }
      setTranscript((current) => `${current} ${addition}`.replace(/\s+/g, " ").trim());
    };
    recognition.onerror = () => {
      setListening(false);
      setNotice("The microphone stopped. You can keep typing instead.");
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setNotice("");
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  async function organize() {
    const text = transcript.trim();
    if (!text) return;

    stopListening();
    setOrganizing(true);
    setNotice("");
    setSummary("");

    const endpoint = process.env.NEXT_PUBLIC_TASK_AGENT_URL;
    let tasks: SuggestedTask[] = [];
    let agentSummary = "";

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (response.ok) {
          const result = (await response.json()) as {
            summary?: string;
            tasks?: (string | { title?: string; detail?: string })[];
          };
          agentSummary = result.summary?.trim() ?? "";
          tasks = (result.tasks ?? [])
            .map((task) =>
              typeof task === "string"
                ? { title: task.trim() }
                : {
                    title: (task.title ?? "").trim(),
                    detail: task.detail?.trim() || undefined,
                  },
            )
            .filter((task) => task.title.length > 0);
        }
      } catch {
        tasks = [];
      }
    }

    if (tasks.length === 0) {
      tasks = splitIntoTasks(text);
      setNotice(
        "Organized on this device. The AI helper was unavailable, so edit anything that looks off.",
      );
    }

    setSummary(agentSummary);
    setSuggestions(tasks);
    setSelected(tasks.map((task) => task.title));
    setOrganizing(false);
  }

  function toggleSuggestion(title: string) {
    setSelected((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function addSelected() {
    const chosen = suggestions.filter((task) => selected.includes(task.title));
    if (chosen.length === 0) return;
    onAddTasks(chosen);
    setNotice(
      `Added ${chosen.length} ${chosen.length === 1 ? "task" : "tasks"} to your list.`,
    );
    setSuggestions([]);
    setSelected([]);
    setSummary("");
    setTranscript("");
  }

  return (
    <section className="voice-capture-panel">
      <div className="voice-capture-heading">
        <span className="voice-capture-icon" aria-hidden="true">
          <Sparkles size={19} />
        </span>
        <div>
          <strong>Say it, and let it become a list</strong>
          <p>
            {role === "affected"
              ? "Describe out loud what needs to happen, or type it in one go. Your words become separate tasks you can keep, reorder, or hand to someone you trust."
              : "Describe everything on your mind out loud, or type it in one go. Your words become separate tasks so nothing stays stuck in your head."}
          </p>
        </div>
      </div>

      <label className="sr-only" htmlFor="voice-transcript">
        What needs to happen
      </label>
      <textarea
        id="voice-transcript"
        value={transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder={
          role === "affected"
            ? "I need my prescription picked up after four, a ride to the appointment on Thursday, and someone to bring the laundry downstairs."
            : "Refill the pill organizer tonight, call the insurance office tomorrow, and find a ride for Thursday's appointment."
        }
        rows={3}
        maxLength={2000}
      />

      <div className="voice-capture-actions">
        {speechSupported ? (
          <button
            className={cn(
              "button",
              listening ? "button-danger" : "button-secondary",
            )}
            type="button"
            onClick={listening ? stopListening : startListening}
          >
            {listening ? (
              <>
                <Square size={17} aria-hidden="true" />
                Stop recording
              </>
            ) : (
              <>
                <Mic size={17} aria-hidden="true" />
                Speak instead
              </>
            )}
          </button>
        ) : null}
        <button
          className="button button-primary"
          type="button"
          onClick={organize}
          disabled={organizing || transcript.trim().length === 0}
        >
          {organizing ? (
            <>
              <Loader2 className="voice-capture-spinner" size={17} aria-hidden="true" />
              Organizing
            </>
          ) : (
            <>
              <Send size={17} aria-hidden="true" />
              Turn into tasks
            </>
          )}
        </button>
        {listening ? (
          <span className="voice-listening" role="status">
            <span className="voice-listening-dot" aria-hidden="true" />
            Listening
          </span>
        ) : null}
      </div>

      {suggestions.length > 0 ? (
        <div className="voice-suggestions">
          <p className="muted-label">
            {summary || "Choose what to keep"}
          </p>
          {suggestions.map((task, index) => {
            const isSelected = selected.includes(task.title);
            return (
              <button
                className={cn("voice-suggestion", isSelected && "is-selected")}
                type="button"
                key={task.title}
                aria-pressed={isSelected}
                onClick={() => toggleSuggestion(task.title)}
              >
                <span className="voice-suggestion-check" aria-hidden="true">
                  {isSelected ? <Check size={15} /> : null}
                </span>
                <span className="voice-suggestion-copy">
                  <strong>
                    {index + 1}. {task.title}
                  </strong>
                  {task.detail ? <small>{task.detail}</small> : null}
                </span>
              </button>
            );
          })}
          <button
            className="button button-primary button-full"
            type="button"
            onClick={addSelected}
            disabled={selected.length === 0}
          >
            Add {selected.length} to my list
          </button>
        </div>
      ) : null}

      {notice ? (
        <p className="voice-capture-notice" role="status">
          {notice}
        </p>
      ) : null}
    </section>
  );
}
