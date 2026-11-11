// Pyramid Clock – Übersicht widget
// Reads the system time and lights one cell per row.

export const command = "date +%H:%M";
export const refreshFrequency = 5000; // ms

export const className = `
  top: 40px;
  right: 40px;
  width: 300px;
`;

const W = 360, H = 312, RH = 52;
const HOUR = "#ef7a4d", MIN = "#4fc3d9";

export const render = ({ output }) => {
  const [h, m] = (output || "0:0").trim().split(":").map(Number);
  const h12 = h % 12;
  const rows = [
    { l: [""],               on: h >= 12 ? 0 : -1,          c: HOUR },
    { l: ["0", "6"],         on: h12 >= 6 ? 1 : 0,          c: HOUR },
    { l: [0, 20, 40],        on: Math.floor(m / 20),        c: MIN },
    { l: [0, 5, 10, 15],     on: Math.floor((m % 20) / 5),  c: MIN },
    { l: [0, 1, 2, 3, 4],    on: m % 5,                     c: MIN },
    { l: [0, 1, 2, 3, 4, 5], on: h12 % 6,                   c: HOUR },
  ];

  const cells = [];
  rows.forEach((r, i) => {
    const n = r.l.length, y0 = i * RH, y1 = (i + 1) * RH;
    const hw0 = (W / 2) * y0 / H, hw1 = (W / 2) * y1 / H;
    const L0 = W / 2 - hw0, L1 = W / 2 - hw1;
    const w0 = (2 * hw0) / n, w1 = (2 * hw1) / n;
    r.l.forEach((label, j) => {
      const on = j === r.on;
      const xa = L0 + j * w0, xb = L0 + (j + 1) * w0;
      const xc = L1 + (j + 1) * w1, xd = L1 + j * w1;
      cells.push(
        <g key={i + "-" + j}>
          <polygon
            points={`${xa},${y0} ${xb},${y0} ${xc},${y1} ${xd},${y1}`}
            fill={on ? r.c : "rgba(0,0,0,0.35)"}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {label !== "" && (
            <text
              x={(xa + xb + xc + xd) / 4}
              y={y0 + RH * 0.55}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="22"
              fontFamily="Georgia, serif"
              fontWeight={on ? "bold" : "normal"}
              fill={on ? "#161513" : "#ffffff"}
            >
              {label}
            </text>
          )}
        </g>
      );
    });
  });

  return (
    <svg viewBox="-4 -4 368 320" width="300">
      {cells}
    </svg>
  );
};
