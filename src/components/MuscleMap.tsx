import Image from "next/image";

const muscleNames: Record<string, string> = {
  back: "پشت", biceps: "جلو بازو", chest: "سینه", core: "میان‌تنه", front_delts: "سرشانه جلویی", glutes: "سرینی",
  hamstrings: "پشت ران", lats: "زیربغل", mid_back: "پشت میانی", quads: "جلوی ران", rear_delts: "سرشانه پشتی",
  shoulders: "سرشانه", side_delts: "سرشانه میانی", triceps: "پشت بازو",
};

export function muscleLabel(muscle: string) {
  return muscleNames[muscle] ?? muscle;
}

export function MuscleMap({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  const primaryLabels = primary.map(muscleLabel);
  const secondaryLabels = secondary.map(muscleLabel);
  const described = [...primaryLabels, ...secondaryLabels].join("، ");

  return (
    <div className="muscle-map">
      <div className="anatomy-art" role="img" aria-label={`نمای جلو و پشت عضلات انسان؛ عضلات درگیر این حرکت: ${described}`}>
        <Image src="/anatomy-muscles-front-back.svg" alt="" width={1442} height={1256} sizes="(max-width: 768px) 86vw, 340px" />
      </div>
      <div className="muscle-legend">
        <span><i className="primary" /> اصلی: {primaryLabels.join("، ")}</span>
        {secondaryLabels.length ? <span><i className="secondary" /> کمکی: {secondaryLabels.join("، ")}</span> : null}
      </div>
      <a className="anatomy-credit" href="https://commons.wikimedia.org/wiki/File:Muscles_front_and_back.svg" target="_blank" rel="noreferrer">تصویر مرجع آناتومی: OpenStax / umimeto.org (CC BY-SA 4.0)</a>
    </div>
  );
}
