# YAPPERS — FINAL IMPLEMENTATION PRD

**Version:** 1.0  
**Project type:** Hackathon MVP  
**Product:** Yappers  
**Frontend:** Next.js  
**Backend:** Node.js  
**Database/Auth:** Supabase  
**Primary AI/Voice:** Sarvam AI  
**Web Search:** Tavily  
**AI Fallback:** Gemini  
**Computer Vision:** TensorFlow + MediaPipe  
**Design Reference:** UI/UX Design Pro Skill  
**Repository:** `https://github.com/saifyxpro/ui-ux-design-pro-skill`

---

# 1. Product Definition

## One-line product

> **Yappers is an AI companion for students that helps them plan what to learn, stay focused while learning, and keep going when academic pressure gets real.**

## Core product loop

```text
PLAN → FOCUS → SUPPORT
```

### PLAN
Communication Agent helps the student decide what to learn, find resources, answer questions, and build small coding projects.

### FOCUS
Study Mode uses a consent-based camera session and TensorFlow/MediaPipe to estimate whether the student is focused or distracted.

### SUPPORT
Consultant provides supportive, natural conversation when the student feels academic pressure or needs help organizing the situation.

Yappers should feel like **one AI companion with three modes**, not three unrelated applications.

---

# 2. Current Repository

The repository currently contains:

```text
yappers/
├── .next/
├── backend/
├── Frontend/
├── node_modules/
├── .gitignore
└── README.md
```

## Current state

- `Frontend/` = empty Next.js application
- `backend/` = empty Node.js application
- Supabase MCP = available
- Graphify VS Code extension = installed
- Ponytail VS Code extension = installed
- UI/UX Design Pro skill/reference repository = available
- Sarvam API = available
- Tavily API = available
- Gemini API = available
- TensorFlow/MediaPipe = available/planned

The implementation agent must treat the current repository as a clean skeleton and build the application architecture from it.

---

# 3. Non-Negotiable Agent Rules

Before writing application code:

1. Inspect the complete repository.
2. Inspect `Frontend/package.json`.
3. Inspect `backend/package.json` if present.
4. Inspect all existing source files before replacing anything.
5. Inspect available MCP servers/tools.
6. Use the available Supabase MCP for Supabase-specific database/auth work.
7. Use Graphify to understand the project graph before large architectural changes.
8. Use the UI/UX Design Pro Skill for UI/UX decisions.
9. Use Ponytail/reuse-first principles to avoid unnecessary code.
10. Do not create duplicate frameworks, directories, or abstractions.
11. Do not hardcode API keys.
12. Do not expose private provider keys to the browser.
13. Do not use mock data when the real provider is configured.
14. If a provider is not configured, implement a clean configuration error/fallback rather than silently faking the result.
15. Build the MVP vertically: foundation first, then each feature.
16. After each major feature, run typecheck/lint/build/tests where available.
17. Do not modify unrelated project files.
18. Do not build features that are explicitly outside the MVP scope.

---

# 4. Target Repository Structure

Create the following structure while respecting the existing Next.js and Node.js conventions discovered during inspection.

```text
yappers/
│
├── Frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── communicate/
│   │   │   └── page.tsx
│   │   │
│   │   ├── study/
│   │   │   └── page.tsx
│   │   │
│   │   ├── consultant/
│   │   │   └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── avatar/
│   │   │   ├── AICharacter.tsx
│   │   │   ├── CharacterRenderer.tsx
│   │   │   ├── MouthFrameController.ts
│   │   │   └── CharacterStateIndicator.tsx
│   │   │
│   │   ├── communication/
│   │   │   ├── CommunicationShell.tsx
│   │   │   ├── ChatMessages.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── ResourceCard.tsx
│   │   │   └── CodeBuildStatus.tsx
│   │   │
│   │   ├── study-mode/
│   │   │   ├── StudySetupForm.tsx
│   │   │   ├── StudySession.tsx
│   │   │   ├── CameraPreview.tsx
│   │   │   ├── FocusIndicator.tsx
│   │   │   ├── StudyTimer.tsx
│   │   │   ├── DistractionAlert.tsx
│   │   │   └── StudySummary.tsx
│   │   │
│   │   ├── consultant/
│   │   │   ├── ConsultantShell.tsx
│   │   │   ├── ConsultantMessages.tsx
│   │   │   └── SuggestedNextStep.tsx
│   │   │
│   │   ├── auth/
│   │   │   └── AuthForm.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── ...
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useVoice.ts
│   │   ├── useStudySession.ts
│   │   ├── useCamera.ts
│   │   └── useAICharacter.ts
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── agent.ts
│   │   │   ├── search.ts
│   │   │   ├── voice.ts
│   │   │   ├── coding.ts
│   │   │   └── study.ts
│   │   │
│   │   ├── audio/
│   │   │   ├── audioAnalyzer.ts
│   │   │   └── ttsPlayer.ts
│   │   │
│   │   └── vision/
│   │       ├── visionModel.ts
│   │       └── focusClassifier.ts
│   │
│   ├── public/
│   │   └── character/
│   │       ├── frame-00.webp
│   │       ├── frame-01.webp
│   │       └── ...
│   │
│   ├── .env.local.example
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── health.routes.ts
│   │   │   ├── agent.routes.ts
│   │   │   ├── search.routes.ts
│   │   │   ├── voice.routes.ts
│   │   │   ├── coding.routes.ts
│   │   │   └── study.routes.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── agent.controller.ts
│   │   │   ├── search.controller.ts
│   │   │   ├── voice.controller.ts
│   │   │   ├── coding.controller.ts
│   │   │   └── study.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── agent/
│   │   │   │   ├── agent.service.ts
│   │   │   │   ├── intentRouter.ts
│   │   │   │   └── prompts/
│   │   │   │       ├── communication.prompt.ts
│   │   │   │       └── consultant.prompt.ts
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── tavily.service.ts
│   │   │   │
│   │   │   ├── voice/
│   │   │   │   ├── sarvam.service.ts
│   │   │   │   └── voice.service.ts
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── provider.interface.ts
│   │   │   │   ├── sarvam.provider.ts
│   │   │   │   └── gemini.provider.ts
│   │   │   │
│   │   │   ├── coding/
│   │   │   │   ├── coding.service.ts
│   │   │   │   └── projectBuilder.service.ts
│   │   │   │
│   │   │   └── study/
│   │   │       └── study.service.ts
│   │   │
│   │   ├── providers/
│   │   │   ├── sarvam/
│   │   │   ├── tavily/
│   │   │   └── gemini/
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   │
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── admin.ts
│   │   │   └── repositories/
│   │   │       ├── conversation.repository.ts
│   │   │       ├── study.repository.ts
│   │   │       └── learningPlan.repository.ts
│   │   │
│   │   ├── types/
│   │   │   ├── agent.types.ts
│   │   │   ├── study.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── config/
│   │   │   └── env.ts
│   │   │
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── errors.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── supabase/
│   ├── migrations/
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   └── api-contracts.md
│
├── .gitignore
├── README.md
└── PRD.md
```

## Folder-creation rule

The agent should create the required folders/files during implementation.

However:

> **Do not create placeholder files that contain no purpose.**

Create a file only when the corresponding feature/service is being implemented or the architecture requires it.

---

# 5. Architecture

```text
                         YAPPERS
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       COMMUNICATION     STUDY MODE    CONSULTANT
              │             │             │
              │             │             │
              ▼             ▼             ▼
          AI Agent       Vision Model   AI Agent
              │             │             │
       ┌──────┼──────┐      │       ┌─────┴─────┐
       │      │      │      │       │           │
    Sarvam  Tavily Gemini TensorFlow/Sarvam   Gemini
       │             │     MediaPipe
       └──────┬──────┘
              │
           Backend
              │
           Supabase
              │
        Auth + Database
```

---

# 6. Frontend / Backend Boundary

## Frontend responsibilities

Frontend handles:

- UI
- routing
- user interaction
- microphone/camera permissions
- local camera stream
- local TensorFlow/MediaPipe inference where practical
- avatar rendering
- audio playback
- mouth animation
- API calls
- optimistic UI
- session state

## Backend responsibilities

Backend handles:

- authentication verification
- AI provider calls
- Sarvam API
- Gemini fallback
- Tavily API
- conversation persistence
- learning-plan persistence
- study-session persistence
- server-side validation
- controlled coding/project operations
- API orchestration

## Never do this

```text
Frontend → Sarvam secret
Frontend → Tavily secret
Frontend → Gemini secret
```

Instead:

```text
Frontend
   ↓
Backend
   ↓
Provider
```

---

# 7. Supabase

Supabase is the primary authentication and persistence layer.

## MCP requirement

The coding agent MUST use the connected Supabase MCP for Supabase-specific work.

Before creating migrations:

```text
Inspect current Supabase project
        ↓
Inspect Auth configuration
        ↓
Inspect existing database schema
        ↓
Inspect existing policies
        ↓
Plan required changes
        ↓
Apply changes
        ↓
Verify schema/policies
```

Do not guess the current database schema.

## Authentication

Required:

- Email/password or the authentication method already configured
- Sign up
- Sign in
- Sign out
- Session persistence
- Protected routes
- User-specific database access

## Tables

Minimum MVP schema:

```text
profiles
---------
id
display_name
created_at
updated_at

conversations
-------------
id
user_id
mode
title
created_at
updated_at

messages
--------
id
conversation_id
user_id
role
content
metadata
created_at

learning_plans
--------------
id
user_id
title
goal
plan_data
created_at
updated_at

resources
---------
id
learning_plan_id
title
url
source
snippet
metadata
created_at

study_sessions
--------------
id
user_id
subject
goal
duration_minutes
started_at
ended_at
status
focus_score
created_at

study_events
------------
id
session_id
event_type
confidence
occurred_at
metadata
```

## Security

Enable RLS for user-owned data.

Rules:

```text
User A cannot read User B's conversations.
User A cannot modify User B's study sessions.
User A cannot read User B's learning plans.
```

Do not store raw camera frames by default.

---

# 8. Environment Variables

Create:

## `Frontend/.env.local.example`

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

Only values safe for browser exposure may use `NEXT_PUBLIC_`.

## `backend/.env.example`

```env
PORT=4000
NODE_ENV=development

SUPABASE_URL=https://rgldjuooupzaupkkqkco.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbGRqdW9vdXB6YXVwa2txa2NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODU4MTQ1NCwiZXhwIjoyMTA0MTU3NDU0fQ.oF1q6VhGnEs2cdsKTDSb7tR5jsjf1warkXJzH3z2oDI

SARVAM_API_KEY=your_sarvam_api_key
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key

FRONTEND_URL=http://localhost:3000
```

Never commit actual secrets.

---

# 9. Feature 1 — Communication Agent

## Goal

Create a natural conversational AI companion for:

- study planning
- career guidance
- learning roadmaps
- resource discovery
- coding assistance
- simple MVP generation
- general questions

## Example

User:

> "Bhai mujhe AI/ML field mein switch karna hai. Kahan se start karun?"

Yappers should:

1. Understand the goal.
2. Generate a structured roadmap.
3. Identify whether current web information is needed.
4. Use Tavily for current resources.
5. Return useful videos/resources.
6. Give a concrete next step.

---

# 10. Communication Intent Router

Use lightweight intent classification.

```text
LEARNING_PLAN
RESOURCE_SEARCH
GENERAL_QA
CODING_HELP
PROJECT_BUILD
STUDY_PLANNING
WEB_SEARCH
CASUAL_CONVERSATION
```

Do not create a complicated multi-agent system for the MVP.

A simple router/service is preferred.

---

# 11. Sarvam

Sarvam is the primary provider for the communication/voice experience.

Use it for the capabilities supported by the configured Sarvam APIs, such as:

- conversational generation
- speech-to-text
- text-to-speech

Provider abstraction:

```ts
interface AIProvider {
  chat(input: ChatInput): Promise<ChatResponse>;
  streamChat?(input: ChatInput): AsyncIterable<ChatChunk>;
}
```

The rest of the application must not depend directly on Sarvam-specific implementation details.

API key:

```env
SARVAM_API_KEY=your_sarvam_api_key
```

Official documentation:

`https://docs.sarvam.ai/`

---

# 12. Gemini Fallback

Gemini is the fallback provider.

Use:

```text
Sarvam
  ↓
request fails / timeout / unavailable
  ↓
Gemini
```

Do not duplicate agent logic.

```text
AgentService
      ↓
AIProvider interface
      ├── SarvamProvider
      └── GeminiProvider
```

API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Official documentation:

`https://ai.google.dev/gemini-api/docs`

---

# 13. Tavily Search

Use Tavily when the user needs fresh internet information.

Examples:

```text
"Find the best TensorFlow beginner videos."
"Find current MediaPipe tutorials."
"Find recent ML roadmaps."
"Find documentation for X."
```

Backend owns the Tavily key.

```env
TAVILY_API_KEY=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
```

Search response should normalize to:

```ts
interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
}
```

Never fabricate resource URLs.

Official documentation:

`https://docs.tavily.com/`

---

# 14. YouTube / Resource Cards

Do not build a separate complex YouTube integration for the MVP unless required.

Tavily can discover relevant public resources.

Frontend resource card:

```text
┌────────────────────────────────┐
│ Machine Learning Fundamentals  │
│ YouTube                        │
│ Short description              │
│                                │
│ [Preview]       [Watch]        │
└────────────────────────────────┘
```

Use the actual returned URL.

If a preview thumbnail is available and legally usable, show it; otherwise use a clean source card.

---

# 15. Coding / MVP Builder

Example:

> "Bhai ek Tic-Tac-Toe bana de."

Flow:

```text
User request
      ↓
Intent = PROJECT_BUILD
      ↓
Inspect project
      ↓
Generate minimal plan
      ↓
Modify project
      ↓
Run validation
      ↓
Return result
```

The coding capability must be controlled.

Do not allow arbitrary shell execution directly from untrusted natural-language input.

For the hackathon MVP:

- simple project generation
- simple file modifications
- validation
- clear explanation

are sufficient.

Do not attempt a full autonomous software engineering platform.

---

# 16. Feature 2 — Study Mode

## Purpose

Study Mode helps students maintain focus.

The user explicitly chooses:

```text
Subject
Goal
Study duration
```

Then the app requests camera permission.

## Flow

```text
Study Mode
    ↓
Study Setup Form
    ↓
User chooses duration
    ↓
Explain camera requirement
    ↓
User grants camera permission
    ↓
Start session
    ↓
Camera stream
    ↓
TensorFlow / MediaPipe
    ↓
Focus state
    ↓
Reminder when sustained distraction is detected
```

---

# 17. Study Vision Model

Use TensorFlow/MediaPipe where appropriate.

MVP states:

```text
FOCUSED
DISTRACTED
PHONE_LIKELY
ABSENT
```

The goal is not perfect human behavior recognition.

The goal is a convincing hackathon prototype.

## Processing

Prefer local/client-side inference.

```text
Camera
  ↓
Frame sampling
  ↓
MediaPipe / TensorFlow
  ↓
Features
  ↓
Focus classifier
  ↓
Study state
```

Do not send raw video to the backend unless there is an explicit future requirement and consent.

---

# 18. Distraction Logic

Do not trigger an alert based on one uncertain frame.

Use sustained evidence.

Example:

```text
PHONE_LIKELY
confidence > threshold
for N consecutive observations
        ↓
trigger reminder
```

Reminder example:

> "Bhai padh le 😭 kal paper hai."

The reminder should be supportive rather than abusive or shaming.

---

# 19. Study Privacy UX

Before camera access:

```text
Why camera access?
Yappers uses your camera only during Study Mode
to estimate whether you're focused.

Your camera feed is processed locally where possible.
Raw video is not saved by default.

[Allow Camera]
[Not Now]
```

During the session:

- show camera-on indicator
- show Stop Session button
- make camera status clear
- do not hide camera usage

If permission is denied:

```text
Camera access is required for focus detection.
You can return later and start Study Mode when
camera access is available.
```

---

# 20. Feature 3 — Consultant

## Purpose

Provide conversational emotional support for students dealing with:

- academic pressure
- overwhelm
- motivation problems
- study anxiety
- workload confusion
- frustration

Position this as:

> **AI student-support companion**

Do NOT market it as a licensed therapist.

---

# 21. Consultant Conversation Style

The agent should:

1. Listen.
2. Acknowledge the concern.
3. Ask a small number of relevant questions.
4. Help break the problem into manageable actions.
5. Encourage appropriate human support when necessary.

Example:

```text
Student:
"Yaar exam ka bahut pressure ho raha hai."

Yappers:
"Samajh raha hoon. Abhi poora syllabus ek saath
dekh ke overwhelming lag raha hai.

Chalo pehle sirf aaj ke 2 important topics
decide karte hain. Kal ka baad mein dekh lenge."
```

Avoid robotic responses like:

```text
"I understand that you are experiencing emotional distress."
```

unless required for a safety-oriented response.

---

# 22. Safety Boundary

Yappers must not:

- diagnose mental-health conditions
- claim to be a medical professional
- claim to replace therapy
- encourage self-harm
- provide unsafe medical advice

If a user indicates immediate danger or severe crisis, encourage contacting a trusted person, local emergency services, or an appropriate crisis/professional resource.

This is a student-support product, not a clinical treatment system.

---

# 23. AI Character

The character is the visual interface for the AI.

It is not a separate AI brain.

## Assets

Approximately 20 pre-rendered 4K character frames will be supplied.

Each frame:

- same body
- same camera
- same background/composition
- different mouth shape

Example:

```text
frame-00 = closed
frame-01 = slight
frame-02 = small
...
frame-19 = open
```

Store static assets in:

```text
Frontend/public/character/
```

---

# 24. Frame-Based Talking Animation

Do not use a GIF.

Do not randomly cycle frames.

Preload the frames.

```text
TTS Audio
    ↓
Audio Playback
    ↓
Audio Analyzer / Viseme Mapping
    ↓
Mouth Frame Controller
    ↓
4K frame selection
```

The renderer should display one frame at a time.

Use `requestAnimationFrame` or an efficient equivalent.

Avoid unnecessary React re-renders.

---

# 25. Character States

```text
IDLE
LISTENING
THINKING
SPEAKING
INTERRUPTED
```

State behavior:

### IDLE
Closed-mouth frame.

### LISTENING
Closed/neutral frame + subtle listening indicator.

### THINKING
Neutral character + subtle thinking animation.

### SPEAKING
Mouth frames driven by actual TTS playback.

### INTERRUPTED
Immediately stop speech animation and reset to listening.

---

# 26. Barge-In / User Interruption

This is a priority interaction.

While Yappers is speaking:

```text
AI speaking
    ↓
Microphone remains monitored
    ↓
User starts speaking
    ↓
VAD detects speech
    ↓
STOP TTS
    ↓
STOP mouth animation
    ↓
Reset closed-mouth frame
    ↓
LISTENING
    ↓
Process new user input
```

The user must not have to wait for Yappers to finish speaking.

Target very low perceived interruption latency.

---

# 27. Voice Architecture

```text
Microphone
    ↓
VAD
    ↓
STT
    ↓
Agent
    ↓
TTS
    ↓
Audio playback
    ↓
Audio analysis
    ↓
Character frame controller
```

Voice provider abstraction should allow Sarvam to be replaced or supplemented later.

---

# 28. Main Frontend Routes

Create:

```text
/
```

Landing/dashboard entry.

```text
/login
/signup
```

Authentication.

```text
/dashboard
```

Main Yappers home.

```text
/communicate
```

Communication Agent.

```text
/study
```

Study Mode.

```text
/consultant
```

Consultant.

---

# 29. Main UI

Yappers should look like an AI companion, not a generic SaaS dashboard.

Navigation:

```text
Yappers
├── Communicate
├── Study
└── Consultant
```

Character should be visually prominent.

Keep controls minimal.

---

# 30. Communication UI

Required:

- character
- messages
- text input
- microphone control
- loading/thinking state
- resource cards
- coding/build state
- stop speaking control where appropriate

Example:

```text
        [ AI CHARACTER ]

        Listening...

 ┌─────────────────────────────┐
 │ User message                │
 └─────────────────────────────┘

 ┌─────────────────────────────┐
 │ Yappers response            │
 │                             │
 │ [Resource cards]            │
 └─────────────────────────────┘

 [ 🎤 ]  Ask Yappers...
```

---

# 31. Study UI

Required:

```text
Subject
Goal
Timer
Camera preview
Focus state
Reminder
Stop session
```

Example:

```text
┌─────────────────────────────────┐
│ ML Fundamentals        42:15    │
│                                 │
│       [ CAMERA PREVIEW ]        │
│                                 │
│       ● Focused                 │
│                                 │
│       Keep going.               │
│                                 │
│          [ Stop ]               │
└─────────────────────────────────┘
```

---

# 32. Consultant UI

Keep it conversational.

```text
        [ AI CHARACTER ]

 "Yaar bahut pressure ho raha hai."

 Yappers:
 "Haan bhai. Chalo isko ek-ek part
 karke dekhte hain..."

 [Tell me more...]
```

---

# 33. UI/UX Design Pro Skill

Use:

`https://github.com/saifyxpro/ui-ux-design-pro-skill`

This is a **design/reference skill**, not the runtime application architecture.

Use it for:

- spacing
- layout
- typography
- responsive design
- accessibility
- visual hierarchy
- component design
- UI audits

## Agent instruction

Before significant UI implementation:

```text
1. Inspect existing frontend.
2. Read the relevant UI/UX Design Pro instructions/reference.
3. Define the visual system.
4. Implement reusable components.
5. Keep interaction states consistent.
6. Run a UI audit after implementation.
```

Do not blindly copy unrelated UI patterns from the repository.

---

# 34. Graphify

Graphify is installed as a VS Code extension.

Use it to understand the repository architecture.

Recommended workflow:

```text
Graphify: Build Knowledge Graph
```

then:

```text
Graphify: Open Interactive Visualizer
```

Use this before major refactors or when tracing dependencies.

If the installed Graphify tooling exposes a CLI/agent command, use the command supported by the local installation rather than inventing a command.

Do not assume a specific Graphify CLI command if the extension does not expose one.

---

# 35. Ponytail

Ponytail is installed as a VS Code extension.

Use it as a minimal/reuse-first coding discipline.

Where supported:

```text
@ponytail
```

Prefer:

```text
@ponytail full
```

for the main implementation.

Principles:

- reuse existing code
- avoid unnecessary abstractions
- avoid duplicate components
- avoid over-engineering
- remove dead code
- keep MVP focused

Do not let minimalism remove:

- security
- authentication
- validation
- accessibility
- error handling
- privacy controls

---

# 36. MCP Policy

At implementation start:

```text
Inspect available MCP servers/tools.
```

For Supabase:

> Use the available Supabase MCP directly for Supabase project inspection, schema work, database operations, and verification where supported.

Do not manually guess:

- table names
- columns
- policies
- existing database configuration

The PRD only assumes Supabase MCP is available because it has been explicitly provided for this project.

If other MCP servers are available at runtime, use them only when directly relevant to the task.

Do not invent unavailable MCP tools.

---

# 37. API Contracts

## Chat

```http
POST /api/agent/chat
```

Request:

```json
{
  "mode": "communication",
  "message": "I want to switch to ML",
  "conversationId": "optional"
}
```

Response:

```json
{
  "message": "response",
  "conversationId": "id",
  "provider": "sarvam",
  "citations": []
}
```

---

## Search

```http
POST /api/search
```

Request:

```json
{
  "query": "best TensorFlow beginner videos"
}
```

Response:

```json
{
  "results": [
    {
      "title": "Example",
      "url": "https://...",
      "snippet": "..."
    }
  ]
}
```

---

## TTS

```http
POST /api/voice/tts
```

Request:

```json
{
  "text": "Hey, let's start learning."
}
```

Response:

- audio stream/payload appropriate for low-latency playback

---

## Coding

```http
POST /api/coding/build
```

Request:

```json
{
  "request": "Build a simple Tic-Tac-Toe game"
}
```

Response:

```json
{
  "status": "success",
  "summary": "Created a simple Tic-Tac-Toe MVP",
  "filesChanged": []
}
```

---

## Study Session

```http
POST /api/study/session
```

Request:

```json
{
  "subject": "Machine Learning",
  "goal": "Finish neural network basics",
  "durationMinutes": 60
}
```

---

# 38. Provider Fallback Rules

## AI

```text
Sarvam
  ↓
failure / timeout
  ↓
Gemini
```

## Search

```text
Tavily
  ↓
failure
  ↓
Tell user live search is temporarily unavailable.
```

Never fabricate fresh search results.

## Voice

If TTS fails:

```text
Show text response
+
Keep avatar in non-speaking state
```

## Camera

If camera permission fails:

```text
Do not fake focus detection.
Explain that Study Mode needs camera access.
```

---

# 39. Backend Error Handling

Normalize errors.

Example:

```ts
{
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "The requested AI provider is temporarily unavailable."
  }
}
```

Do not leak:

- API keys
- provider secrets
- internal stack traces
- database credentials

to the client.

---

# 40. Authentication Flow

```text
User
 ↓
Signup/Login
 ↓
Supabase Auth
 ↓
Session
 ↓
Frontend
 ↓
Authenticated backend request
 ↓
Backend validates user
 ↓
Database operation
```

Protected routes:

```text
/dashboard
/communicate
/study
/consultant
```

---

# 41. Data Ownership

Every user-specific record must have `user_id` or an ownership relationship.

Conversation:

```text
user
 ↓
conversation
 ↓
messages
```

Learning:

```text
user
 ↓
learning_plan
 ↓
resources
```

Study:

```text
user
 ↓
study_session
 ↓
study_events
```

---

# 42. Privacy

Camera:

- explicit permission
- visible camera indicator
- local inference where practical
- no raw video persistence by default

Audio:

- process only what is needed
- do not persist raw microphone recordings by default

AI conversations:

- persist only when needed for product functionality
- make user ownership explicit

---

# 43. Design System Direction

The visual design should communicate:

```text
intelligent
friendly
immersive
student-focused
modern
calm
```

Avoid:

```text
generic enterprise dashboard
overloaded glassmorphism
too many cards
excessive gradients
tiny unreadable text
constant animations
```

The character should remain the visual anchor.

---

# 44. MVP Scope Boundaries

Do NOT build:

- perfect emotion recognition
- clinical therapist system
- full autonomous coding agent
- full social network
- complex multi-agent architecture
- cloud video recording
- perfect human behavior classification
- dozens of third-party integrations
- full production-scale observability platform
- complex billing system

The goal is a **convincing, functional hackathon vertical slice**.

---

# 45. Implementation Phases

## Phase 0 — Inspect

```text
Inspect repository
→ inspect package files
→ inspect Next.js
→ inspect Node.js
→ Graphify architecture
→ inspect MCP
→ inspect Supabase
```

Deliverable:

```text
Architecture understanding
```

---

## Phase 1 — Foundation

Build:

```text
Frontend
Backend
Supabase
Auth
Environment configuration
API client
Error handling
Base layout
Navigation
```

Deliverable:

```text
User can authenticate and reach dashboard.
```

---

## Phase 2 — Communication

Build:

```text
Chat UI
Sarvam provider
Gemini fallback
Tavily search
Resource cards
Conversation persistence
Basic voice
```

Deliverable:

```text
User can ask Yappers a question
→ receive answer
→ search current resources
→ see resources
→ continue conversation.
```

---

## Phase 3 — Coding MVP

Build:

```text
Project request
→ intent
→ implementation plan
→ controlled file modification
→ validation
→ result
```

Deliverable:

```text
Tic-Tac-Toe MVP can be created successfully.
```

---

## Phase 4 — Study Mode

Build:

```text
Setup form
Camera permission
Camera preview
TensorFlow/MediaPipe
Focus state
Timer
Distraction threshold
Reminder
Session persistence
Summary
```

Deliverable:

```text
Student can run a real focus session.
```

---

## Phase 5 — Consultant

Build:

```text
Consultant UI
Supportive prompt
Conversation persistence
Safety boundaries
```

Deliverable:

```text
Student can have a natural support conversation.
```

---

## Phase 6 — Character

Build:

```text
4K frame preloading
Character renderer
TTS playback
Audio analyzer
Mouth frame controller
Listening state
Thinking state
Speaking state
Barge-in
```

Deliverable:

```text
AI visually speaks using the pre-rendered frame stack.
```

---

## Phase 7 — Hackathon Hardening

Run:

```text
npm/bun/pnpm build
npm/bun/pnpm lint
npm/bun/pnpm typecheck
```

using the package manager/scripts actually present in the project.

Test:

```text
Auth
Chat
Tavily
Sarvam
Gemini fallback
TTS
Camera denial
Study mode
Distraction
Consultant
Character animation
Barge-in
Responsive UI
```

Run UI/UX audit.

---

# 46. Definition of Done

A hackathon-ready Yappers build must allow a user to:

```text
1. Sign up
2. Log in
3. Open Yappers dashboard
4. Talk to Communication Agent
5. Ask for a learning roadmap
6. Receive current resources
7. Open resource/video links
8. Ask for a simple coding MVP
9. Build a small project
10. Enter Study Mode
11. Select study duration
12. Grant camera permission
13. Start study session
14. Receive distraction reminder
15. Finish/stop study session
16. Open Consultant
17. Have supportive conversation
18. Use voice/avatar interaction
19. Interrupt the AI while it is speaking
20. See the character immediately switch back to listening
```

---

# 47. Hackathon Demo Story

The demo should follow one student's journey.

## Scene 1 — PLAN

User:

> "Bhai mujhe AI/ML mein switch karna hai. Kahan se start karun?"

Yappers:

- responds naturally
- creates roadmap
- searches current resources
- shows resource cards

## Scene 2 — BUILD

User:

> "Ab ek simple Tic-Tac-Toe bana de."

Yappers:

- plans
- builds
- validates
- shows result

## Scene 3 — FOCUS

User:

- enters Study Mode
- selects subject
- chooses duration
- grants camera permission

User looks at phone.

Yappers:

> "Bhai padh le 😭 kal paper hai."

## Scene 4 — SUPPORT

User:

> "Yaar bahut pressure ho raha hai."

Yappers:

- listens
- responds naturally
- helps reduce the problem into a next action

## Closing

> **"Yappers doesn't just tell students what to study. It helps them plan it, actually do it, and keep going."**

---

# 48. API Integration Placeholders

The following integrations are intentionally abstracted.

```text
FRONTEND
────────────────────────────
api.ts
  ↓
agent.ts
search.ts
voice.ts
coding.ts
study.ts


BACKEND
────────────────────────────
agent.service.ts
  ↓
provider.interface.ts
  ├── sarvam.provider.ts
  └── gemini.provider.ts

search
  └── tavily.service.ts

voice
  └── sarvam.service.ts

database
  └── supabase repositories
```

This makes provider replacement possible without rewriting the frontend.

---

# 49. Recommended Development Commands

The agent must first inspect the actual package scripts.

Typical frontend commands may be:

```bash
cd Frontend
npm install
npm run dev
npm run build
npm run lint
```

Typical backend commands may be:

```bash
cd backend
npm install
npm run dev
npm run build
npm test
```

Do not assume these exact scripts exist. Read `package.json` first.

---

# 50. Final Agent Prompt

Use this PRD as the source of truth.

Before coding:

```text
Read PRD.md completely.

Then:

1. Inspect the repository.
2. Inspect Frontend/package.json.
3. Inspect backend/package.json.
4. Inspect all existing source files.
5. Use Graphify to understand the project.
6. Inspect available MCP servers/tools.
7. Use Supabase MCP to inspect the existing Supabase project.
8. Read the UI/UX Design Pro Skill/reference.
9. Apply Ponytail's reuse-first/minimal implementation principles.
10. Create a short implementation plan.
11. Confirm the target folder structure against the existing repository.
12. Implement Phase 1 first.
13. Verify Phase 1 before continuing.
14. Implement subsequent phases in order.
15. Run validation after each phase.
```

### Critical instruction

**Do not simply create the folder tree and stop.**

The folder tree is the target architecture. Every created file must have a real implementation responsibility.

**Do not generate fake/mock integrations for Sarvam, Tavily, Gemini, or Supabase when credentials and integrations are configured.**

**Do not expose private API keys to the frontend.**

**Do not store raw camera footage by default.**

**Do not turn the Consultant into a claimed medical/clinical therapist.**

**Do not over-engineer the MVP.**

---

# 51. Product North Star

Yappers should always answer three questions for a student:

```text
"What should I do?"
        ↓
Communication Agent

"Am I actually doing it?"
        ↓
Study Mode

"I'm struggling with it."
        ↓
Consultant
```

Therefore:

# PLAN → FOCUS → SUPPORT

is the central product architecture.

---

# 52. External References

UI/UX Design Pro Skill  
`https://github.com/saifyxpro/ui-ux-design-pro-skill`

Sarvam Docs  
`https://docs.sarvam.ai/`

Tavily Docs  
`https://docs.tavily.com/`

Gemini API Docs  
`https://ai.google.dev/gemini-api/docs`

Supabase Docs  
`https://supabase.com/docs/`

Supabase MCP  
`https://supabase.com/docs/guides/ai-tools/mcp`

---

# END OF PRD
