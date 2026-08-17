import type { KnowledgeItem } from "@/domain/types";

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "demo-protein",
    topic: "protein_intake",
    claim: "برای کاربران سالم و فعال، پروتئین بالاتر از حداقل عمومی می‌تواند به حفظ یا رشد عضله کمک کند.",
    summary: "این رکورد نمایشی است و Citation قطعی ندارد. قبل از تبدیل به قانون تاییدشده باید توسط مدیر علمی بازبینی شود.",
    practicalImplication: "موتور تغذیه MVP بازه محافظه‌کارانه ۱.۶ تا ۲.۲ گرم به ازای هر کیلوگرم را اعمال می‌کند.",
    source: "Demo seed, not a verified scientific citation",
    evidenceLevel: "demo",
    dateReviewed: "2026-08-15",
    tags: ["nutrition", "protein"],
    active: true,
  },
  {
    id: "demo-volume",
    topic: "training_volume",
    claim: "حجم تمرین باید با سابقه، هدف و ریکاوری فرد تنظیم شود.",
    summary: "این داده نمونه است و فقط برای نمایش معماری knowledge base استفاده می‌شود.",
    practicalImplication: "مبتدی‌ها ست کمتر و فاصله بیشتر از ناتوانی دریافت می‌کنند.",
    source: "Demo seed, not a verified scientific citation",
    evidenceLevel: "demo",
    dateReviewed: "2026-08-15",
    tags: ["training", "volume"],
    active: true,
  }
];
