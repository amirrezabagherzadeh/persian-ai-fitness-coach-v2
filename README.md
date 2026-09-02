<div align="center">
  <p><strong>English</strong> · <a href="./README.fa.md">فارسی</a></p>
  <img src="./public/icons/icon.svg" width="72" height="72" alt="Gym Coach logo" />
  <h1>Gym Coach — Personalised Workout Planning</h1>
  <p><strong>A Persian-first, RTL workout experience that guides a gym member from a few useful answers to confidently completing every set.</strong></p>

  <p>
    <a href="#product-at-a-glance">Product</a> ·
    <a href="#product-journey">Journey</a> ·
    <a href="#uiux-decisions">UI/UX</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#quick-start">Quick start</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js" alt="Next.js 16.3.1" />
    <img src="https://img.shields.io/badge/React-19-149eca?logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/UX-RTL%20Persian-ff7a22" alt="Persian RTL UX" />
  </p>
</div>

<br />

## Product at a glance

Gym Coach is a **workouts-focused MVP** for gym members. Rather than showing a static spreadsheet, it uses each member’s goal, ability, available time, training preference, and safety constraints to create an actionable four-week training cycle. During a session, members log sets, weight, reps, and intensity, while each exercise offers visual instruction, targeted muscles, and common mistakes.

> The goal is not a perfect plan on paper. It is a training experience that is easy to understand, practical in a real gym, and sustainable over time.

<table>
  <thead>
    <tr><th align="left">Current focus</th><th align="left">Clear MVP boundary</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Personalised programming, in-context exercise guidance, and workout logging in a Persian RTL experience.</td>
      <td>Accounts, program data, and workout data are stored in the browser. This version is not yet connected to production Auth, a database, or an AI service.</td>
    </tr>
  </tbody>
</table>

## Product journey

<pre>
 ┌───────────┐   ┌─────────────────┐   ┌───────────────────┐
 │  Landing  │ → │ Signup / Login  │ → │  6-step assessment │
 └───────────┘   └─────────────────┘   └─────────┬─────────┘
                                                   │
                                                   ▼
                                      ┌──────────────────────┐
                                      │ 4-week training plan │
                                      └──────────┬───────────┘
                                                 │
                    ┌────────────────────────────┴────────────────────────────┐
                    ▼                                                         ▼
         ┌──────────────────┐                                     ┌──────────────────┐
         │ Exercise guide   │                                     │ Live workout log │
         │ form + muscles   │                                     │ sets + RIR + rest│
         └────────┬─────────┘                                     └────────┬─────────┘
                  └───────────────────────► completed workout ◄───────────┘
</pre>

### 1. A clear promise from the first screen

The landing page communicates the value in seconds: a four-week plan, designed for the gym, with visual exercise guidance. The program preview makes the end result tangible before asking the member for personal information.

<img src="./public/screenshots/01-landing.png" alt="Gym Coach landing page with a program preview and a three-step member journey" width="100%" />

### 2. A short assessment where every answer has an effect

The six-step assessment asks only for details that change the program: goal, baseline data, experience, weekly capacity, training style, and safety constraints. Progress feedback and named steps lower cognitive load and show members exactly where they are in the flow.

<img src="./public/screenshots/02-onboarding.png" alt="First assessment step for choosing a goal and priority muscle areas" width="100%" />

### 3. A plan designed to be scanned

The generated plan presents a four-week cycle with a calendar, session count, estimated duration, exercises, sets, reps, rest, and RIR. Every training-day card has one primary action—open details or start the workout—while the more technical information stays close to the relevant exercise without crowding the interface.

<img src="./public/screenshots/03-program.png" alt="Four-week workout program with upper- and lower-body training sessions" width="100%" />

### 4. Exercise instruction without leaving the task

Members do not need to leave their program to understand an exercise. The instruction dialog brings together start and end positions, an animated demonstration, beginner cues, common mistakes, a muscle map, and the reason that exercise was selected. This reduces external searching and uncertainty before the first set.

<img src="./public/screenshots/04-exercise-instruction.png" alt="Barbell bench press visual guide with frames, common mistakes, and a muscle map" width="100%" />

### 5. Log the necessary data—nothing more

Each set uses three simple inputs: weight, repetitions, and RIR. Recording a set starts a rest timer using that exercise’s recommended rest time; the session summary tracks total volume and makes completion clear. RIR tells members how much effort should remain without forcing them to train to failure.

<img src="./public/screenshots/05-workout-logging.png" alt="Workout logging page with weight, repetitions, RIR, and rest timer" width="100%" />

## UI/UX decisions

<table>
  <thead>
    <tr><th align="left">Decision</th><th align="left">Why it matters</th><th align="left">How it appears</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Today before details</strong></td><td>A gym member needs to know what to do next, not get lost in program structure.</td><td>A direct Start Workout CTA, scannable sessions, and a short path to set logging.</td></tr>
    <tr><td><strong>Every question earns its place</strong></td><td>Questions with no visible consequence reduce trust and completion.</td><td>Goal, experience, days, duration, style, and constraints directly affect split, volume, exercise selection, and intensity.</td></tr>
    <tr><td><strong>Persian-native, not superficial translation</strong></td><td>Fast reading on a small screen depends on the correct language and direction.</td><td><code>RTL</code>, Vazirmatn, Persian numerals, and clear local labels; English exercise names are supportive metadata only.</td></tr>
    <tr><td><strong>Technique before load</strong></td><td>For a newer member, safe form matters more than rapidly increasing weight.</td><td>Visual education, common mistakes, muscle maps, safety guidance, and an RIR target stay beside the exercise.</td></tr>
    <tr><td><strong>Low-friction logging</strong></td><td>If logging is slow, real performance data is lost.</td><td>Weight/reps/RIR fields, a one-tap set action, and an automatic rest timer.</td></tr>
    <tr><td><strong>Colour signals action</strong></td><td>The interface must support quick decisions at a glance.</td><td>A low-distraction dark surface with warm orange for CTAs, active states, and progress moments.</td></tr>
  </tbody>
</table>

<details>
  <summary><strong>How does program personalisation work?</strong></summary>
  <br />
  The deterministic planning engine first filters exercises by gym equipment, experience level, and safety flags. It then changes exercise priority using the member’s goal, focus muscles, and preferred training style. Training days determine the split; session duration caps the exercise count; and experience plus goal set the volume, rep ranges, RIR, and rest. The result is a four-week program that remains explainable and testable.
</details>

## Architecture

<table>
  <thead>
    <tr><th align="left">Layer</th><th align="left">Responsibility</th><th align="left">Location</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>App Router</strong></td><td>Product routes, layout, and PWA manifest</td><td><code>src/app</code></td></tr>
    <tr><td><strong>Features</strong></td><td>Landing, demo auth, onboarding, program, profile, and active workout surfaces</td><td><code>src/features</code></td></tr>
    <tr><td><strong>Domain</strong></td><td>Program generation, safety filtering, RIR, progression, and product models</td><td><code>src/domain</code></td></tr>
    <tr><td><strong>Data</strong></td><td>Exercises, instructional media, and demo data</td><td><code>src/data</code> · <code>public/exercises</code></td></tr>
    <tr><td><strong>Store</strong></td><td>Demo account, profile, program, and workout log with browser persistence</td><td><code>src/store/app-store.tsx</code></td></tr>
  </tbody>
</table>

### AI boundary and training logic

Core training decisions—exercise selection, constraint filtering, volume, RIR, and progression—are deterministic TypeScript functions so they remain testable and explainable. This workouts-focused version does not depend on an AI API or model to make those primary decisions.

## Main routes

<table>
  <tbody>
    <tr><td><code>/</code></td><td>Landing page and product promise</td></tr>
    <tr><td><code>/auth/signup</code> · <code>/auth/login</code></td><td>Demo account creation and sign-in</td></tr>
    <tr><td><code>/onboarding</code></td><td>Six-step member assessment</td></tr>
    <tr><td><code>/program</code></td><td>Four-week plan and exercise guidance</td></tr>
    <tr><td><code>/program/day/[dayId]</code></td><td>Workout-day details</td></tr>
    <tr><td><code>/workout/[sessionId]</code></td><td>Workout, set logging, and rest timing</td></tr>
    <tr><td><code>/profile</code></td><td>Review or update program-driving member inputs</td></tr>
  </tbody>
</table>

## Quick start

```bash
npm install
npm run dev -- -p 3000
```

Then open <a href="http://localhost:3000">http://localhost:3000</a>.

### Quality checks

```bash
npm run typecheck
npm run test
npm run build
```

## MVP status and next steps

<table>
  <thead>
    <tr><th align="left">Available now</th><th align="left">Next for a fuller journey</th></tr>
  </thead>
  <tbody>
    <tr><td>Personalised programming, visual exercise guidance, set logging, RIR, rest timing, PWA support, and local persistence.</td><td>Cross-device synchronisation, durable per-set saves, short-session and exercise-swap flows, weekly check-ins, and durable post-workout feedback.</td></tr>
  </tbody>
</table>

<blockquote>
  <strong>Safety note:</strong> Gym Coach supports training; it does not replace medical assessment, diagnosis, or an in-person coach. A qualified professional should review training when there is severe pain, a new injury, or a medical restriction.
</blockquote>

## Media credits

Start/end exercise reference images come from the public <a href="https://github.com/yuhonas/free-exercise-db">Free Exercise DB</a> dataset and are kept in <code>public/exercises</code> so the experience works without an external media API. The README screenshots were captured from this project’s local build and live in <code>public/screenshots</code>.
