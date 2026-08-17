# Product Logic

## Training

The training engine is deterministic. It selects a split from availability and experience:

- 2 days: Full Body A/B
- 3 days: Full Body or Upper / Lower / Full for advanced users
- 4 days: Upper / Lower
- 5-6 days: Push / Pull / Legs-style rotation

Exercises are filtered by active status, user equipment, experience, and contraindications. The LLM is not used to invent prescriptions. Each prescription stores exercise, sets, target reps, RIR, rest time, order, warm-up context, and notes.

## Coach Methodologies

Administrators can add a coach's own programming method in `/admin`. The raw method can be saved directly or sent through an AI-review step. In the MVP that review is a local/mock normalizer; in production it should become a server-side AI provider call with audit logs.

The normalized methodology controls:

- preferred split, such as full body, upper/lower, or push/pull/legs
- volume bias
- intensity style through RIR targets
- progression style
- exercise-selection bias, such as machines, free weights, or bodyweight

The method does not bypass personalization. The engine still filters by the user's equipment, experience, schedule, injuries, and safety flags. Activating a methodology regenerates the user's program with that coach style.

## Progressive Overload

The rule is intentionally conservative:

- If every prescribed set is completed at the top of the rep range while staying near target RIR, recommend a small load increase.
- If sets are missed, repeat the same prescription.
- If reps fall below the target range or RIR reaches failure, reduce intensity or repeat with a lighter load.

## Nutrition

The nutrition engine uses Mifflin-St Jeor for BMR, multiplies by activity level for TDEE, then applies a capped goal adjustment. Protein is calculated from body weight with a conservative 1.6-2.2 g/kg guardrail. Fat has a minimum guardrail and remaining calories become carbohydrates.

## Adaptation

Weekly check-in data creates a simple readiness score from sleep, energy, performance, difficulty, and adherence. It is not clinically validated. Low readiness reduces volume recommendations and pauses load increases; high readiness allows normal progression.

## Safety

The app does not diagnose disease. Health flags and injuries trigger conservative messaging and should restrict aggressive exercise and nutrition recommendations in the production backend.
