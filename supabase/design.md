# Yappers — UI/UX Design PRD
## Premium Frontend Visual Overhaul — Backend Frozen

**Scope:** Frontend UI/UX, visual system, motion, responsive behavior, character presentation, and client-side interaction design.

> **CRITICAL:** This is a FRONTEND-ONLY design specification. The backend, database, authentication logic, API routes, API contracts, Supabase schema/RLS, server integrations, and environment-variable semantics are frozen and MUST NOT be changed.

---

## 1. Core Objective

Transform the existing Yappers frontend into a premium, memorable AI learning-companion experience.

Yappers must NOT look like:

- a generic SaaS dashboard
- a ChatGPT clone
- a conventional chatbot
- an admin panel
- a template-generated AI website

Yappers should feel like:

> **A futuristic personal AI learning companion.**

The visual language should combine:

- premium dark interface
- editorial typography
- subtle futuristic atmosphere
- soft glass-like surfaces used sparingly
- cinematic motion
- intelligent micro-interactions
- generous whitespace
- strong AI-character presence
- focused student experience

Avoid excessive neon, gradients, rounded cards, dashboard clutter, or animation for its own sake.

---

# 2. Non-Negotiable Backend Freeze

The implementation agent MUST NOT:

- modify backend source code
- modify backend routes
- modify API contracts
- modify Supabase schema
- modify Supabase RLS
- modify authentication logic
- modify server-side AI integrations
- replace existing APIs
- create a new backend
- move server responsibilities into the frontend
- change existing environment-variable semantics
- remove working functionality because of the redesign

If an existing backend capability is available, the frontend should simply present it better.

---

# 3. Brand Personality

Yappers is:

**Human + Intelligent + Playful + Focused + Futuristic**

The UI should communicate:

- “This AI is with me.”
- “I know what I should do next.”
- “Learning feels less overwhelming.”
- “This isn't another chatbot.”

The strongest product principle is:

> **Less dashboard. More companion.**

---

# 4. Color System

## Primary background

```text
#050505
```

## Surfaces

```text
#0A0A0A
#101010
#151515
```

## Borders

```text
rgba(255,255,255,0.08)
rgba(255,255,255,0.14)
```

## Text

```text
Primary:   #F5F5F5
Secondary: #A1A1AA
Muted:     #71717A
```

## Accent

Use restrained electric violet / blue-violet only for AI activity and important interactions.

```text
Accent:       #8B5CF6
Accent bright:#A78BFA
Accent soft:  rgba(139,92,246,0.14)
```

Semantic colors only when needed:

```text
Success: #34D399
Warning: #FBBF24
Danger:  #F87171
```

### Color rule

Most of the UI should remain black, white, and neutral. Accent colors communicate state, focus, AI activity, selection, and progress.

---

# 5. Typography

Primary font:

> **Open Sauce One**

Use it consistently across the product.

Suggested hierarchy:

```text
Display:       64–88px
Page heading:  40–56px
Section:       24–32px
Card heading:  18–22px
Body:          15–17px
Metadata:      12–14px
```

Preferred weights:

```text
400 Regular
500 Medium
600 Semibold
700 Bold
```

Typography should feel spacious and editorial rather than compressed.

---

# 6. Application Shell

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│                     TOP STATUS BAR                       │
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│   SIDEBAR     │              MAIN CONTENT                │
│               │                                         │
└───────────────┴─────────────────────────────────────────┘
```

Navigation:

- Home
- Communicate
- Study
- Consultant
- Profile

Sidebar:

```text
240–280px desktop
72–80px collapsed
```

Mobile should use compact/bottom navigation.

The sidebar must feel like a navigation rail, not an admin menu.

---

# 7. Background Animation

Create a reusable `AnimatedBackground`.

Layer:

1. black base
2. subtle radial glow
3. slow blurred light field
4. fine grain/noise
5. optional grid/dot texture
6. page-specific ambient accent

Background animation must be subtle and cinematic.

Prefer:

- CSS transforms
- opacity
- GPU-friendly animation
- Framer Motion where appropriate
- GSAP only for complex timelines

Respect `prefers-reduced-motion`.

Do not cause expensive React re-renders on every animation frame.

---

# 8. Motion System

Use **Framer Motion** for:

- page transitions
- entrance/exit
- hover states
- modal transitions
- list animations
- layout transitions

Use **GSAP** selectively for:

- cinematic hero sequences
- complex timelines
- character choreography
- ambient background movement
- scroll-driven effects

Do not use GSAP everywhere.

### Motion philosophy

> Motion should explain state, hierarchy, and personality.

Motion timings:

```text
Fast:        120–180ms
Normal:      200–350ms
Expressive:  400–700ms
Ambient:     4–12s
```

Avoid excessive bouncing, elastic effects, or constant movement.

---

# 9. Hover System

Buttons:

- subtle brightness
- 1–2px movement
- soft glow
- icon movement

Cards:

- subtle border illumination
- slight translateY
- tiny scale if appropriate

Navigation:

- active indicator smoothly moves
- icon/text transitions

Desktop-only cursor effects may include:

- magnetic buttons
- subtle pointer spotlight
- card glow following pointer

Do not use cursor trails or effects on touch devices.

---

# 10. Dashboard Redesign

The dashboard must feel like a **personal learning home**, not an analytics/admin page.

## Hero

Example:

> **Good evening.**  
> **What are we learning today?**

Then a contextual AI suggestion:

> “You were working on Machine Learning yesterday. Want to continue?”

The character should have strong visual presence.

Suggested composition:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Good evening.                         AI CHARACTER     │
│   What are we learning today?           / AVATAR        │
│                                                         │
│   [ Continue learning ]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Dashboard sections

### Continue Learning

Show:

- current goal
- progress
- next lesson
- estimated time

### Today's Focus

Example:

```text
TODAY'S FOCUS

Machine Learning
Neural Networks

45 min
[ Start Study ]
```

### Recent Activity

Use a timeline instead of generic metric cards.

### AI Suggestion

Show one strong recommendation, not ten.

Example:

> “You have finished Python basics. Your next best step is NumPy + data manipulation.”

---

# 11. Communication Page — Major Redesign

**This is a critical requirement.**

The Communication page MUST NOT look like ChatGPT.

Do not use a permanent left/right message-bubble layout as the primary interface.

The experience should feel like:

> **Talking to an AI companion.**

Not:

> **Sending messages to a chatbot.**

## Primary composition

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    AI CHARACTER                         │
│                                                         │
│              “What are we working on?”                  │
│                                                         │
│                  waveform / status                      │
│                                                         │
│          Suggested conversation actions                 │
│                                                         │
│              ┌─────────────────────────┐                │
│              │ Speak or type...     🎙 │                │
│              └─────────────────────────┘                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

The character is the primary visual.

---

# 12. Communication State Machine

States:

```text
IDLE
LISTENING
THINKING
SPEAKING
INTERRUPTED
```

The whole composition should respond to the current state.

## IDLE

Character centered.

Text:

> “What do you want to figure out?”

Prompt chips:

```text
Help me learn ML
Plan my study
Build a project
Search something for me
```

These should feel like elegant interactive suggestions, not chatbot buttons.

## LISTENING

When microphone input starts:

- ambient glow increases slightly
- character becomes active
- waveform appears
- microphone indicator changes
- subtle pulse around character

Text:

> “I'm listening...”

Waveform should react to real audio when available.

## THINKING

Do NOT use a generic three-dot loader.

Use:

- subtle orbiting particles
- ambient glow
- small progress animation
- state-aware microcopy

Examples:

> “Thinking...”

> “Finding the best way to explain this...”

> “Looking for useful resources...”

## SPEAKING

Character becomes the primary visual focus.

Use:

- existing 4K frame animation
- TTS audio
- mouth movement
- subtle audio-reactive UI
- waveform
- ambient lighting

The transcript is secondary to the character.

## INTERRUPTED

When the user speaks while Yappers is speaking:

```text
AI SPEAKING
    ↓
USER SPEAKS
    ↓
STOP TTS IMMEDIATELY
    ↓
STOP CHARACTER SPEAKING ANIMATION
    ↓
LISTENING
```

The UI must react immediately.

---

# 13. Communication History

Conversation history should NOT dominate the page.

Use a small expandable drawer/panel.

Example:

```text
Yesterday
ML roadmap

Monday
Tic-Tac-Toe project

Sunday
Python study plan
```

The default experience remains the current conversation stage.

---

# 14. Character System

Create a reusable `CharacterStage`.

Suggested structure:

```text
CharacterStage
├── CharacterRenderer
├── CharacterGlow
├── CharacterParticles
├── CharacterStatus
├── AudioWaveform
└── CharacterCaption
```

Responsibilities:

- render character
- manage visual state
- preload frames
- coordinate audio state
- show ambient glow
- respond to interaction

Do not duplicate character animation logic across pages.

---

# 15. Frame Animation

Treat the existing 4K frame stack as a visual animation system.

Preload frames appropriately.

Do NOT convert them into a GIF.

Do NOT create unnecessary video assets.

Animation should be state-driven:

```text
IDLE
→ idle loop

LISTENING
→ listening state

THINKING
→ thinking state

SPEAKING
→ mouth/viseme frame sequence

INTERRUPTED
→ immediate reset
```

The animation should be driven by real UI/audio state, not random frame switching.

---

# 16. Audio-Reactive Visuals

When audio is playing:

- waveform reacts
- character ambient glow responds
- subtle particles may respond
- speaking indicator activates

Keep the effect cinematic and restrained.

---

# 17. Study Page

Study Mode should feel like a **focus room**, not a form.

Before starting:

```text
┌─────────────────────────────────────────┐
│              STUDY ROOM                 │
│                                         │
│       What are we focusing on?          │
│                                         │
│       [ Machine Learning ]              │
│                                         │
│       Duration                          │
│       25 min   45 min   60 min          │
│                                         │
│       Camera permission                 │
│       [ Enable Study Mode ]             │
└─────────────────────────────────────────┘
```

During active study:

- timer
- subject
- camera preview
- focus state
- subtle character presence
- pause/end controls

The interface should communicate:

> **Now we study.**

---

# 18. Study Focus States

States:

```text
FOCUSED
DISTRACTED
UNCERTAIN
PAUSED
```

Never shame the user.

Prefer:

> “Hey, back to the notes.”

instead of:

> “YOU ARE DISTRACTED!!!”

---

# 19. Study Completion

Create a satisfying completion state:

```text
SESSION COMPLETE

45 minutes
38 minutes focused

Nice work.

Tomorrow:
Continue with neural networks.

[ Back to dashboard ]
```

Use restrained completion animation.

---

# 20. Consultant Page

Consultant should NOT look like another chatbot.

Use:

- calmer black environment
- softer ambient light
- slower motion
- larger typography
- minimal controls
- more breathing space

Hero:

> **“You don't have to figure everything out at once.”**

Then:

> **“What's on your mind?”**

The visual tempo should be slower than Communication.

Do not imply diagnosis, treatment, or professional therapist status.

---

# 21. Consultant Conversation

Avoid standard chatbot bubbles.

Use:

- large user statements
- AI response cards
- subtle transitions
- generous whitespace
- calm ambient animation

Example:

```text
You

“I feel overwhelmed with everything I need to study.”

Yappers

“Let's slow it down. What's the one thing
that feels heaviest right now?”
```

---

# 22. Profile Page

Profile should feel like a **personal learning identity**, not a settings form.

Hero:

```text
[ Avatar ]

Aman

AI/ML Learner

Learning since 2026
```

Sections:

### Learning Identity

- current goal
- interests
- preferred learning style
- current streak

### Progress

Use visual storytelling instead of a wall of statistics.

### Activity

Use timeline presentation.

### Preferences

Keep settings minimal and expandable.

Profile entrance sequence:

1. avatar fades in
2. name rises
3. learning identity appears
4. progress expands
5. activity reveals sequentially

Use Framer Motion.

---

# 23. Cards

Do not make every component the same card.

Use visual hierarchy:

- primary immersive card
- secondary card
- utility card
- AI card

AI cards may use subtle ambient treatment.

Avoid excessive 24px rounded containers everywhere.

---

# 24. Buttons

Primary:

- strong typography
- restrained accent or black/white treatment
- subtle hover glow
- icon movement

Examples:

```text
[ Start Study → ]
[ Continue ]
[ View all ]
```

There should be one visually dominant action per section.

---

# 25. Inputs

Communication input:

```text
┌────────────────────────────────────────────┐
│ Speak or type...                     🎙 ↑  │
└────────────────────────────────────────────┘
```

Use:

- dark surface
- subtle border
- focus glow
- smooth expansion
- keyboard accessibility

---

# 26. Loading / Error / Empty States

Never expose raw technical errors.

Example:

Instead of:

```text
500 Internal Server Error
```

show:

> “Yappers couldn't reach the AI right now. Try again in a moment.”

This is a frontend presentation change only. Do not change backend behavior.

Empty states should invite action:

> “Tell me what you want to learn and we'll build your first path.”

Loading states should communicate intent:

> “Preparing your learning space...”

> “Thinking...”

---

# 27. Responsive Design

Desktop is the primary showcase experience.

Mobile must remain fully usable.

### Desktop

- persistent sidebar
- large character stage
- multi-column dashboard

### Tablet

- collapsed navigation
- adjusted spacing
- smaller character stage

### Mobile

- bottom navigation
- stacked sections
- compact character
- full-width communication input
- simplified animations

---

# 28. Accessibility

Support:

- keyboard navigation
- visible focus states
- semantic HTML
- sufficient contrast
- accessible labels
- reduced motion
- screen-reader-friendly controls

Animation must never be the only way to communicate state.

---

# 29. Performance

Prioritize:

- CSS transforms
- opacity
- GPU-friendly animations
- image optimization
- lazy loading
- appropriate frame preloading
- cleanup of animation loops
- cleanup of audio listeners
- cleanup of camera/microphone streams

Avoid:

- React state updates on every animation frame
- DOM-heavy particle systems
- unnecessary JavaScript animation loops
- duplicate animation libraries

---

# 30. Frontend Component Direction

Adapt the existing project structure rather than blindly recreating it.

Suggested organization:

```text
Frontend/
├── components/
│   ├── layout/
│   │   ├── AppShell
│   │   ├── Sidebar
│   │   ├── MobileNavigation
│   │   └── PageTransition
│   │
│   ├── motion/
│   │   ├── AnimatedBackground
│   │   ├── Reveal
│   │   ├── MagneticButton
│   │   └── HoverCard
│   │
│   ├── character/
│   │   ├── CharacterStage
│   │   ├── CharacterRenderer
│   │   ├── CharacterGlow
│   │   ├── CharacterParticles
│   │   └── AudioWaveform
│   │
│   ├── communication/
│   │   ├── ConversationStage
│   │   ├── PromptChips
│   │   ├── VoiceInput
│   │   ├── ThinkingState
│   │   └── ConversationHistory
│   │
│   ├── dashboard/
│   ├── study/
│   ├── consultant/
│   └── profile/
│
├── hooks/
│   ├── useReducedMotion
│   ├── useAudioLevel
│   └── useCharacterState
│
└── styles/
```

Create only components that have real implementation value.

---

# 31. Design Tokens

Centralize:

- colors
- spacing
- radii
- typography
- shadows
- animation durations
- z-index layers
- layout widths

Do not scatter magic values across components.

---

# 32. Page Hierarchy Rule

Every major page must have:

```text
ONE primary action
ONE primary visual
ONE primary message
```

Everything else supports those three.

---

# 33. Communication Acceptance Criteria

The Communication page is complete only when:

- it does not visually resemble ChatGPT
- character is the primary visual
- idle/listening/thinking/speaking states are distinct
- prompt chips feel interactive
- audio state is visible
- transcript is secondary
- conversation history is secondary
- speaking animation is integrated into the stage
- interruption feels instantaneous
- mobile layout works
- reduced-motion mode works

---

# 34. Dashboard Acceptance Criteria

Dashboard is complete only when:

- it feels like a personal learning home
- it does not resemble an admin dashboard
- the next learning action is obvious
- character has visual presence
- activity feels contextual
- visual hierarchy is strong
- ambient motion is subtle
- nothing feels overcrowded

---

# 35. Final Product Acceptance

A first-time viewer should think:

> “This is an AI companion.”

Not:

> “This is a chatbot.”

And:

> “This feels like a real product.”

Not:

> “This looks like a hackathon template.”

The final frontend must be:

- premium
- cohesive
- responsive
- accessible
- performant
- emotionally engaging
- visually memorable
- animation-rich but restrained

---

# 36. Implementation Workflow

Before changing the frontend:

1. Inspect the current frontend structure.
2. Identify existing routes.
3. Identify existing components.
4. Identify existing API calls.
5. Identify existing auth state.
6. Identify existing character assets.
7. Identify current styling/Tailwind configuration.
8. Identify existing animation dependencies.
9. Preserve working frontend integrations.
10. Do not touch backend files.

Then implement the visual overhaul incrementally.

---

# 37. Final QA Checklist

## Visual

- [ ] Black-first palette
- [ ] Open Sauce One applied
- [ ] Consistent spacing
- [ ] Strong typography hierarchy
- [ ] Premium dark surfaces
- [ ] No unnecessary clutter

## Motion

- [ ] Framer Motion used appropriately
- [ ] GSAP used selectively
- [ ] Page transitions work
- [ ] Hover states work
- [ ] Background animation works
- [ ] Reduced-motion mode works

## Dashboard

- [ ] Personal hero
- [ ] Continue Learning
- [ ] Today's Focus
- [ ] Recent Activity
- [ ] AI Suggestion
- [ ] Character presence

## Communication

- [ ] Not a ChatGPT clone
- [ ] Character-centered stage
- [ ] Prompt chips
- [ ] Listening state
- [ ] Thinking state
- [ ] Speaking state
- [ ] Interrupt state
- [ ] Audio visualization
- [ ] Secondary transcript
- [ ] Secondary history

## Study

- [ ] Focus-room experience
- [ ] Timer
- [ ] Camera state
- [ ] Focus state
- [ ] Completion state

## Consultant

- [ ] Calm visual language
- [ ] Non-chatbot presentation
- [ ] Supportive interaction

## Profile

- [ ] Personal identity hero
- [ ] Learning progress
- [ ] Activity timeline
- [ ] Preferences

## Technical

- [ ] Backend untouched
- [ ] API contracts untouched
- [ ] Supabase untouched
- [ ] No secrets exposed
- [ ] No unnecessary dependencies
- [ ] No console errors
- [ ] No broken routes
- [ ] Responsive
- [ ] Accessible
- [ ] Performant

---

# FINAL IMPLEMENTATION COMMAND

**Read this entire `design.md` before modifying the frontend.**

Then inspect the existing frontend and implement this design system while preserving all existing functionality.

Do not redesign the backend.

Do not change API contracts.

Do not change database behavior.

Do not move backend logic into the frontend.

Your task is to make the existing Yappers product look and feel **exceptional** while keeping the existing backend completely untouched.
