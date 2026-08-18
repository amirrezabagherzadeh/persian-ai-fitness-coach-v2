const muscleNames: Record<string, string> = {
  back: "پشت", biceps: "جلو بازو", chest: "سینه", core: "میان‌تنه", front_delts: "سرشانه جلویی", glutes: "سرینی",
  hamstrings: "پشت ران", lats: "زیربغل", mid_back: "پشت میانی", quads: "جلوی ران", rear_delts: "سرشانه پشتی",
  shoulders: "سرشانه", side_delts: "سرشانه میانی", triceps: "پشت بازو",
};

export function muscleLabel(muscle: string) {
  return muscleNames[muscle] ?? muscle;
}

type Region = { key: string; side: "front" | "back"; cx: number; cy: number; rx: number; ry: number };

const regions: Region[] = [
  { key: "chest", side: "front", cx: 62, cy: 75, rx: 18, ry: 10 },
  { key: "front_delts", side: "front", cx: 39, cy: 70, rx: 7, ry: 7 }, { key: "front_delts", side: "front", cx: 85, cy: 70, rx: 7, ry: 7 },
  { key: "shoulders", side: "front", cx: 39, cy: 70, rx: 7, ry: 7 }, { key: "shoulders", side: "front", cx: 85, cy: 70, rx: 7, ry: 7 },
  { key: "side_delts", side: "front", cx: 38, cy: 72, rx: 6, ry: 8 }, { key: "side_delts", side: "front", cx: 86, cy: 72, rx: 6, ry: 8 },
  { key: "biceps", side: "front", cx: 33, cy: 92, rx: 5, ry: 13 }, { key: "biceps", side: "front", cx: 91, cy: 92, rx: 5, ry: 13 },
  { key: "core", side: "front", cx: 62, cy: 105, rx: 12, ry: 22 },
  { key: "quads", side: "front", cx: 51, cy: 153, rx: 8, ry: 25 }, { key: "quads", side: "front", cx: 73, cy: 153, rx: 8, ry: 25 },
  { key: "back", side: "back", cx: 188, cy: 92, rx: 18, ry: 25 }, { key: "mid_back", side: "back", cx: 188, cy: 88, rx: 15, ry: 15 },
  { key: "lats", side: "back", cx: 188, cy: 97, rx: 20, ry: 20 },
  { key: "rear_delts", side: "back", cx: 165, cy: 72, rx: 7, ry: 7 }, { key: "rear_delts", side: "back", cx: 211, cy: 72, rx: 7, ry: 7 },
  { key: "shoulders", side: "back", cx: 165, cy: 72, rx: 7, ry: 7 }, { key: "shoulders", side: "back", cx: 211, cy: 72, rx: 7, ry: 7 },
  { key: "triceps", side: "back", cx: 159, cy: 92, rx: 5, ry: 13 }, { key: "triceps", side: "back", cx: 217, cy: 92, rx: 5, ry: 13 },
  { key: "glutes", side: "back", cx: 188, cy: 130, rx: 18, ry: 12 },
  { key: "hamstrings", side: "back", cx: 177, cy: 157, rx: 8, ry: 25 }, { key: "hamstrings", side: "back", cx: 199, cy: 157, rx: 8, ry: 25 },
];

function BodyOutline({ offset = 0 }: { offset?: number }) {
  return <g transform={`translate(${offset} 0)`} className="body-outline"><circle cx="62" cy="28" r="15" /><path d="M45 52 Q62 44 79 52 L91 79 82 113 76 130 78 178 70 214 62 214 57 178 62 137 55 137 60 178 54 214 46 214 40 178 47 130 42 113 33 79Z" /><path d="M43 57 25 83 18 122 25 124 36 91M81 57 99 83 106 122 99 124 88 91" /></g>;
}

export function MuscleMap({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  const primarySet = new Set(primary);
  const secondarySet = new Set(secondary);
  const described = [...primary.map(muscleLabel), ...secondary.map(muscleLabel)].join("، ");
  return (
    <div className="muscle-map">
      <svg viewBox="0 0 250 225" role="img" aria-label={`نقشه عضلات درگیر: ${described}`}>
        <BodyOutline /><BodyOutline offset={126} />
        {regions.map((region, index) => {
          const state = primarySet.has(region.key) ? "primary" : secondarySet.has(region.key) ? "secondary" : "inactive";
          return <ellipse className={`muscle-region ${state}`} cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} key={`${region.key}-${index}`} />;
        })}
        <text x="62" y="222" textAnchor="middle">جلو</text><text x="188" y="222" textAnchor="middle">پشت</text>
      </svg>
      <div className="muscle-legend"><span><i className="primary" /> عضله اصلی</span><span><i className="secondary" /> عضله کمکی</span></div>
    </div>
  );
}
