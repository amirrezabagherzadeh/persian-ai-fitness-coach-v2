import Image from "next/image";

const muscleNames: Record<string, string> = {
  back: "پشت", biceps: "جلو بازو", chest: "سینه", core: "میان‌تنه", front_delts: "سرشانه جلویی", glutes: "سرینی",
  hamstrings: "پشت ران", lats: "زیربغل", mid_back: "پشت میانی", quads: "جلوی ران", rear_delts: "سرشانه پشتی",
  shoulders: "سرشانه", side_delts: "سرشانه میانی", triceps: "پشت بازو",
};

export function muscleLabel(muscle: string) {
  return muscleNames[muscle] ?? muscle;
}

type Region = { key: string; cx: number; cy: number; rx: number; ry: number; rotate?: number };

const regions: Region[] = [
  { key: "chest", cx: 96, cy: 108, rx: 26, ry: 15 },
  { key: "front_delts", cx: 66, cy: 101, rx: 11, ry: 10 }, { key: "front_delts", cx: 126, cy: 101, rx: 11, ry: 10 },
  { key: "shoulders", cx: 66, cy: 101, rx: 12, ry: 11 }, { key: "shoulders", cx: 126, cy: 101, rx: 12, ry: 11 },
  { key: "side_delts", cx: 62, cy: 109, rx: 8, ry: 13, rotate: -18 }, { key: "side_delts", cx: 130, cy: 109, rx: 8, ry: 13, rotate: 18 },
  { key: "biceps", cx: 57, cy: 137, rx: 7, ry: 19, rotate: -8 }, { key: "biceps", cx: 135, cy: 137, rx: 7, ry: 19, rotate: 8 },
  { key: "core", cx: 96, cy: 151, rx: 17, ry: 32 },
  { key: "quads", cx: 82, cy: 234, rx: 13, ry: 42, rotate: -4 }, { key: "quads", cx: 110, cy: 234, rx: 13, ry: 42, rotate: 4 },
  { key: "back", cx: 310, cy: 142, rx: 34, ry: 48 }, { key: "mid_back", cx: 310, cy: 132, rx: 25, ry: 20 }, { key: "lats", cx: 310, cy: 151, rx: 32, ry: 31 },
  { key: "rear_delts", cx: 277, cy: 102, rx: 11, ry: 10 }, { key: "rear_delts", cx: 343, cy: 102, rx: 11, ry: 10 },
  { key: "shoulders", cx: 277, cy: 102, rx: 12, ry: 11 }, { key: "shoulders", cx: 343, cy: 102, rx: 12, ry: 11 },
  { key: "triceps", cx: 270, cy: 139, rx: 7, ry: 20, rotate: -8 }, { key: "triceps", cx: 350, cy: 139, rx: 7, ry: 20, rotate: 8 },
  { key: "glutes", cx: 310, cy: 207, rx: 25, ry: 16 },
  { key: "hamstrings", cx: 296, cy: 245, rx: 13, ry: 42, rotate: -4 }, { key: "hamstrings", cx: 324, cy: 245, rx: 13, ry: 42, rotate: 4 },
];

export function MuscleMap({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  const primaryLabels = primary.map(muscleLabel);
  const secondaryLabels = secondary.map(muscleLabel);
  const described = [...primaryLabels, ...secondaryLabels].join("، ");
  const primarySet = new Set(primary);
  const secondarySet = new Set(secondary);

  return (
    <div className="muscle-map">
      <div className="anatomy-art" role="img" aria-label={`نمای جلو و پشت عضلات انسان؛ عضلات درگیر این حرکت: ${described}`}>
        <Image src="/anatomy-muscles-front-back.svg" alt="" width={1442} height={1256} sizes="(max-width: 768px) 86vw, 340px" />
        <svg className="anatomy-overlay" viewBox="0 0 406.99026 354.43411" aria-hidden="true">
          {regions.map((region, index) => {
            const state = primarySet.has(region.key) ? "primary" : secondarySet.has(region.key) ? "secondary" : "inactive";
            return <ellipse className={`anatomy-region ${state}`} cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} transform={region.rotate ? `rotate(${region.rotate} ${region.cx} ${region.cy})` : undefined} key={`${region.key}-${index}`} />;
          })}
        </svg>
      </div>
      <div className="muscle-legend">
        <span><i className="primary" /> اصلی: {primaryLabels.join("، ")}</span>
        {secondaryLabels.length ? <span><i className="secondary" /> کمکی: {secondaryLabels.join("، ")}</span> : null}
      </div>
      <a className="anatomy-credit" href="https://commons.wikimedia.org/wiki/File:Muscles_front_and_back.svg" target="_blank" rel="noreferrer">تصویر مرجع آناتومی: OpenStax / umimeto.org (CC BY-SA 4.0)</a>
    </div>
  );
}
