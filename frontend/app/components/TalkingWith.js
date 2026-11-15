"use client";

// "Talking with": the grandparents this grandchild can send voice notes to. One tap switches the conversation.
import { initialOf, isElder, relationOf } from "../lib/family-client";

export function TalkingWith({ members, withId, onPick, disabled }) {
  const elders = (members || []).filter(isElder);
  if (!elders.length) return null;
  return (
    <div className="talking-with" role="radiogroup" aria-label="Talking with">
      <span className="talking-label">Talking with</span>
      <div className="talking-list">
        {elders.map(m => {
          const on = m.id === withId;
          return (
            <button key={m.id} type="button" role="radio" aria-checked={on} disabled={disabled}
              className={`talking-chip${on ? " is-on" : ""}`} onClick={() => onPick(m.id)}>
              <span className={`member-av ${m.role}`}>{initialOf(m)}</span>
              <span className="talking-text"><b>{m.name}</b><small>{relationOf(m)}</small></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
