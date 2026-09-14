import {
  keyboardRows,
  keyFor,
  shiftFor,
  upperTR,
  fingerNames,
  type Finger,
} from "../domain/keyboard";
import { Icon } from "./shared";
const fingerOrder: Finger[] = [
  "lp",
  "lr",
  "lm",
  "li",
  "thumb",
  "thumb",
  "ri",
  "rm",
  "rr",
  "rp",
];
export function KeyboardGuide({
  target = "",
  visible = true,
  heat,
  compact = false,
}: {
  target?: string;
  visible?: boolean;
  heat?: Record<string, number>;
  compact?: boolean;
}) {
  const key = keyFor(target),
    shift = shiftFor(target);
  return (
    <div
      className={`keyboard-guide ${compact ? "compact" : ""} ${!visible ? "guide-dim" : ""}`}
    >
      <div
        className="keyboard"
        aria-label="Türkçe Q klavye, tuş ve parmak rehberi"
      >
        {keyboardRows.map((row, ri) => (
          <div className={`keyboard-row row-${ri}`} key={ri}>
            {ri === 1 && <div className="key utility tab-key">Tab</div>}
            {ri === 2 && <div className="key utility caps-key">Caps</div>}
            {ri === 3 && (
              <div
                className={`key utility shift-key ${visible && shift === "Sol Shift" ? "target-key" : ""}`}
              >
                ⇧
              </div>
            )}
            {row.map((k) => (
              <div
                key={k.base}
                className={`key finger-${k.finger} ${visible && key?.base === k.base ? "target-key" : ""} ${"fj".includes(k.base) ? "home-bump" : ""} ${heat && heat[k.base] !== undefined ? "heat-key" : ""}`}
                style={
                  heat && heat[k.base] !== undefined
                    ? ({
                        "--heat": `${Math.max(0.1, heat[k.base] / 100)}`,
                      } as React.CSSProperties)
                    : undefined
                }
                title={`${upperTR(k.base)} · ${fingerNames[k.finger]}${heat && heat[k.base] !== undefined ? ` · %${heat[k.base]}` : ""}`}
              >
                <span>{upperTR(k.base)}</span>
                {ri === 0 && <small>{k.shift}</small>}
              </div>
            ))}
            {ri === 0 && <div className="key utility back-key">⌫</div>}
            {ri === 1 && <div className="key utility enter-top">↵</div>}
            {ri === 2 && <div className="key utility enter-bottom">↵</div>}
            {ri === 3 && (
              <div
                className={`key utility shift-key ${visible && shift === "Sağ Shift" ? "target-key" : ""}`}
              >
                ⇧
              </div>
            )}
          </div>
        ))}
        <div className="keyboard-row bottom-row">
          <div className="key utility">Ctrl</div>
          <div className="key utility">Alt</div>
          <div
            className={`key space-key ${visible && target === " " ? "target-key" : ""}`}
          >
            boşluk
          </div>
          <div className="key utility">Alt Gr</div>
          <div className="key utility">Ctrl</div>
        </div>
      </div>
      {!compact && (
        <div className="finger-guide">
          <div className="finger-hands" aria-hidden="true">
            {fingerOrder.map((f, i) => (
              <span
                key={i}
                className={`finger-pill ${visible && key?.finger === f ? "active" : ""} ${f === "thumb" ? "thumb" : ""}`}
                style={{ height: [22, 32, 39, 34, 19, 19, 34, 39, 32, 22][i] }}
              />
            ))}
          </div>
          <span>
            {visible && key ? (
              <>
                <strong>{fingerNames[key.finger]}</strong>
                {shift
                  ? ` + ${shift}`
                  : target === " "
                    ? " · hafif bir dokunuş"
                    : " · sonra ana sıraya dön"}
              </>
            ) : (
              "Konumları hatırla. Ellerine güven."
            )}
          </span>
          <span className="layout-label">TR · Q</span>
        </div>
      )}
      {compact && (
        <div className="keyboard-caption">
          <Icon name="keyboard" size={15} /> Türkçe Q · F ve J senin başlangıç
          noktan
        </div>
      )}
    </div>
  );
}
