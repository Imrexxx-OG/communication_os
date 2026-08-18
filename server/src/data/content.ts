// ============================================================================
// Static reference content — ported verbatim from the offline HTML app's
// MODULES / FRAMEWORKS / ROLE_MODELS / RECOVERY / FAQ / ROUTINE_PHASES /
// QUOTES constants. This never changes per-user, so it lives in code, not
// in the database. See schema.prisma's header comment for the reasoning.
// ============================================================================

export const CONFIG = {
  "STORAGE_KEY": "communication-os",
  "VERSION": "2.0.0",
  "TOTAL_WEEKS": 12,
  "TOTAL_MODULES": 12,
  "BACKUP_REMINDER_DAYS": 7,
  "RECOMMEND_SAMPLE": 5,
  "RECOMMEND_THRESHOLD": 2
} as const;

export const ROUTINE_PHASES = [
  {
    "id": "reset",
    "num": 1,
    "name": "Diaphragmatic Reset",
    "minutes": 4,
    "instructions": [
      "4-4-4-4 box breathing × 4 rounds (inhale 4, hold 4, exhale 4, hold 4).",
      "Then 10 diaphragmatic \"ahh\" tones, dropping in pitch each time."
    ],
    "mistake": "Breathing from the chest instead of the belly — your shoulders should not rise.",
    "cue": "Hand on stomach rises on the inhale; the \"ahh\" tones feel supported, not strained."
  },
  {
    "id": "resonance",
    "num": 2,
    "name": "Resonance & Articulation",
    "minutes": 5,
    "instructions": [
      "Lip trills, 90 seconds.",
      "Low → high → low siren hum, 90 seconds.",
      "Then 2 minutes reading a paragraph aloud, over-articulating every consonant."
    ],
    "mistake": "Forcing volume from the throat — it should feel like breath support, not strain.",
    "cue": "No vocal fatigue afterward; consonants feel crisp when you drop back to normal speech."
  },
  {
    "id": "logic",
    "num": 3,
    "name": "Logic-Thread Drill",
    "minutes": 6,
    "instructions": [
      "Pick one random topic. Give a 2-minute answer using PREP or the Pyramid Principle.",
      "Repeat with a second topic."
    ],
    "mistake": "Rehearsing the same topic until it is memorized instead of practicing live structuring.",
    "cue": "You can state your conclusion in the first sentence, unprompted, both times."
  },
  {
    "id": "body",
    "num": 4,
    "name": "Body-Language Rep",
    "minutes": 3,
    "instructions": [
      "In front of a mirror: one pre-speech signal (nod or eyebrow lift), hands visible.",
      "Hold eye contact with your reflection through a 2-second pause."
    ],
    "mistake": "Performing the cues so deliberately they look mechanical.",
    "cue": "The pause does not make you look away or fidget."
  },
  {
    "id": "playback",
    "num": 5,
    "name": "Playback & Self-Review",
    "minutes": 2,
    "instructions": [
      "Voice-memo one of today’s reps on your phone. Play it back once.",
      "Note one thing that worked and one thing to adjust tomorrow."
    ],
    "mistake": "Judging harshly on tone alone — listen for structure and pace, not just \"did I sound anxious.\"",
    "cue": "You can name one specific, fixable thing — not a vague \"I sounded bad.\""
  }
];

export const MODULES = [
  {
    "num": 1,
    "title": "Why This Works",
    "subtitle": "The mechanism behind everything else",
    "objective": "Understand why this program is built the way it is, so you trust the process on the days it feels pointless.",
    "why": "This isn’t a language problem — it’s a performance-under-pressure pattern. Your writing is already organized and fluent; that’s real evidence the gap is a stress response, not competence. Everything here trains the response, not the vocabulary.",
    "science": [
      {
        "tier": "t1",
        "text": "Graded exposure hierarchy (Wolpe) — ranked, repeated exposure extinguishes a fear response."
      },
      {
        "tier": "t1",
        "text": "Cognitive restructuring (Beck / CBT) — disputing an automatic thought weakens its grip."
      },
      {
        "tier": "t1",
        "text": "Habit reversal training (Azrin & Nunn) — awareness plus a competing response breaks a loop."
      }
    ],
    "content": [
      {
        "h": "Three mechanisms do the work"
      },
      "Exposure therapy is the engine. A feared situation, met repeatedly in ranked steps, stops producing the alarm. You don’t reason your way out of the freeze — you accumulate evidence that speaking under mild pressure is survivable, one rung at a time.",
      "CBT is the steering. The freeze usually starts before you speak, in the anticipatory thought (\"If I switch, they’ll think I’m uneducated\"). Catching and disputing that thought is often more effective than anything you do mid-sentence.",
      "Habit reversal is the cleanup. Filler words and language-switching are learned competing responses to discomfort. You don’t just delete them — you install a deliberate replacement (a silent pause, an English anchor phrase) in the same slot.",
      {
        "h": "Evidence tiers"
      },
      "Every technique in this OS is tagged 1–5 so you know how much to trust it. Tier 1–2 is the spine — breath, exposure, reframing, pacing. Tier 3 is strong heuristics (Pyramid Principle). Tier 4 is inspiration only (role models). Never mistake a Tier 4 flourish for a Tier 1 mechanism."
    ],
    "examples": [
      {
        "h": "Anticipatory reframes"
      },
      {
        "pair": [
          "\"If I switch to Pidgin, they’ll think I’m uneducated.\"",
          "My degree is a fact. Pidgin is a habit, not a deficit."
        ]
      },
      {
        "pair": [
          "\"I need to feel calm before I can speak well.\"",
          "The exposure creates the calm. Waiting to feel ready is the trap."
        ]
      },
      {
        "pair": [
          "\"Everyone saw me freeze.\"",
          "On playback, most \"obvious\" freezes are a 1-second pause nobody flagged."
        ]
      }
    ],
    "practice": [
      {
        "ol": [
          "Read the five evidence tiers in the Reference Library once. You should be able to say which tier breath work is (Tier 1) and which tier copying a speaker’s cadence is (Tier 4).",
          "Write your single most common freeze-thought, and draft an evidence-based counter for it — true, not just positive."
        ]
      },
      {
        "note": "You only need to internalize the \"why\" once. After that, this module is a place to return when motivation dips."
      }
    ],
    "reflection": [
      "Which of the three mechanisms — exposure, reframing, habit reversal — do you think you’ve been skipping until now?",
      "What is the actual thought that fires in the first 3 seconds before you freeze?"
    ]
  },
  {
    "num": 2,
    "title": "Bilingual Switching",
    "subtitle": "Breaking the anxiety → Pidgin link",
    "objective": "Make English your automatic restart-language under pressure, so switching stops being an available exit.",
    "why": "Language-switching is a learned escape from discomfort, not a lack of English. If your brain knows Pidgin is always available when things get hard, it will keep reaching for it. Remove the exit and the freeze has nowhere to go but through.",
    "science": [
      {
        "tier": "t1",
        "text": "Habit reversal training (Azrin & Nunn) — awareness phase, then competing response."
      },
      {
        "tier": "t1",
        "text": "Cognitive restructuring — disputing the \"switching = smarter/safer\" belief."
      }
    ],
    "content": [
      {
        "h": "The English Lock Rule"
      },
      "Once a sentence starts in English, it finishes in English — even mid-stumble. If you fully lose it: pause, breathe, restart the sentence in English, never Pidgin. No exceptions, so your brain stops treating Pidgin as an available exit.",
      {
        "h": "Build your trigger map"
      },
      "For one week, log every switch: who was present, the stakes, whether the moment was scripted. You’re looking for the pattern — a person type, a topic, or simple unscriptedness. The named trigger becomes your next exposure target.",
      {
        "h": "Anchor phrases buy thinking time"
      },
      "Anchor phrases are pre-loaded English openers that hold the floor while you assemble the real sentence. Drill three until they’re automatic — they should feel like reflexes, not scripts."
    ],
    "examples": [
      {
        "h": "Anchor phrases to drill (20× each)"
      },
      {
        "ul": [
          "\"Let me put it this way—\"",
          "\"Here’s the thing—\"",
          "\"The way I see it—\""
        ]
      },
      {
        "h": "Recovery in the moment"
      },
      "If a switch slips out, don’t restart the whole sentence — insert a silent pause where the Pidgin would have gone, and continue in English."
    ],
    "practice": [
      {
        "ol": [
          "Days 1–3: count switches in normal conversation. No correction — pure data.",
          "Days 4–7: replace the urge to switch with a deliberate 1-second silent pause. The pause is the competing response.",
          "Drill your three anchor phrases 20× each, out loud, daily.",
          "Use one anchor phrase in a real conversation this week."
        ]
      },
      {
        "note": "You can’t replace a habit you haven’t measured yet. Finish the awareness phase before you start correcting."
      }
    ],
    "reflection": [
      "Did your switch-count go up or down once you started measuring it? (Either is normal.)",
      "Which trigger showed up most — a person, a topic, or unscriptedness?"
    ]
  },
  {
    "num": 3,
    "title": "Daily Routine",
    "subtitle": "The 20-minute execution protocol",
    "objective": "Install a repeatable daily block that trains breath, voice, logic and body language in 20 minutes.",
    "why": "Skill is built by frequency, not intensity. A short protocol you actually run every day beats a long one you abandon by week two. This is the minimum effective dose, structured so no decision is required once you start.",
    "science": [
      {
        "tier": "t1",
        "text": "Distributed practice — short, spaced reps beat massed cramming for motor and cognitive skills."
      },
      {
        "tier": "t2",
        "text": "Video/audio self-modeling (Clark & Wells) — the playback step corrects your inflated self-image."
      }
    ],
    "content": [
      {
        "h": "The five phases"
      },
      {
        "ol": [
          "Diaphragmatic Reset — 4 min. Box breathing + descending \"ahh\" tones.",
          "Resonance & Articulation — 5 min. Lip trills, siren hum, over-articulated reading.",
          "Logic-Thread Drill — 6 min. Two 2-minute structured answers on random topics.",
          "Body-Language Rep — 3 min. Mirror work: pre-speech cue, visible hands, held pause.",
          "Playback & Self-Review — 2 min. Voice-memo one rep, note one win and one fix."
        ]
      },
      "Run it from the Today’s Session tab — each phase has its own timer, and completing the routine logs a session automatically. Progression is manual: nothing auto-advances, so you finish each phase on your own terms.",
      {
        "h": "Minimum Viable Day"
      },
      "On a bad day, don’t skip — shrink. A Minimum Viable Day is one breath reset, one small exposure, and one tracker line. It protects the streak and the identity without demanding the full 20 minutes. A Minimum Viable Day is a win."
    ],
    "examples": [
      {
        "h": "What \"done\" looks like per phase"
      },
      {
        "ul": [
          "Reset: hand on belly rises on the inhale; tones feel supported.",
          "Resonance: no vocal fatigue; consonants crisp at normal pace.",
          "Logic: conclusion stated in sentence one, unprompted, both topics.",
          "Body: the 2-second pause doesn’t make you look away or fidget.",
          "Playback: you can name one specific, fixable thing."
        ]
      }
    ],
    "practice": [
      {
        "ol": [
          "Run the full five-phase routine from Today’s Session.",
          "On low-capacity days, run a Minimum Viable Day instead of skipping.",
          "Fill one tracker line at the end of every day — it takes under a minute."
        ]
      }
    ],
    "reflection": [
      "Which phase do you most want to skip — and is that avoidance or genuine redundancy?",
      "Did the playback step surprise you versus how the rep felt in the moment?"
    ]
  },
  {
    "num": 4,
    "title": "Breath & Voice",
    "subtitle": "Lower arousal, build supported projection",
    "objective": "Turn breath and resonance into on-command tools you can reach for before and during any speaking moment.",
    "why": "Anxiety flattens pitch and shrinks breath support — both are trainable motor patterns, not fixed traits. Diaphragmatic breathing also directly lowers the fight-or-flight arousal that triggers the freeze, before you’ve said a word.",
    "science": [
      {
        "tier": "t1",
        "text": "Diaphragmatic breathing — lowers sympathetic arousal before a speech task."
      },
      {
        "tier": "t1",
        "text": "Vocal Function Exercises / resonant voice (Stemple) — controlled projection without strain."
      },
      {
        "tier": "t2",
        "text": "Prosody training — restores pitch variation that anxiety flattens."
      }
    ],
    "content": [
      {
        "h": "Box breathing (the reset)"
      },
      "4-4-4-4: inhale 4, hold 4, exhale 4, hold 4. Four rounds. Shoulders stay down — if they rise, you’re breathing from the chest. Small, quiet belly breaths outperform big dramatic ones.",
      {
        "h": "Resonance ladder"
      },
      {
        "ul": [
          "Lip trills — steady breath support without forcing volume. Hum them to a song’s melody (Vinh).",
          "Siren hum — low → high → low, gliding through your range.",
          "Yawn-Ahhh (Vinh) — start a yawn, hold the lifted soft palate, voice an \"ahh.\" Opens the space a tight throat closes off."
        ]
      },
      {
        "h": "Pre-speech ritual"
      },
      "One diaphragmatic breath, hands visible, one open pre-speech cue (nod or eyebrow lift), and know your first sentence. Four seconds, every time, before anything that matters."
    ],
    "examples": [
      {
        "h": "Before-speaking checklist"
      },
      {
        "ul": [
          "Hands visible",
          "One open pre-speech cue",
          "One diaphragmatic breath",
          "You know your first sentence"
        ]
      }
    ],
    "practice": [
      {
        "ol": [
          "Box breathing ×4 + 10 descending \"ahh\" tones before every practice block.",
          "90 sec lip trills, 90 sec siren hum, 2 min over-articulated reading.",
          "Run the full pre-speech ritual before one real interaction this week."
        ]
      },
      {
        "note": "Volume comes from breath support, not the throat. If you feel strain or fatigue, you’re forcing it."
      }
    ],
    "reflection": [
      "Where do you feel the breath — belly or chest? Be honest.",
      "Did the pre-speech ritual change the first three seconds of a real conversation?"
    ]
  },
  {
    "num": 5,
    "title": "Articulation & Pacing",
    "subtitle": "Rate control, clarity, and the rhetorical pause",
    "objective": "Make a slower, clearer, more deliberate delivery your default — especially under pressure.",
    "why": "Rushing under pressure increases disfluency and cognitive load at the same time. Slowing down is a lever you can pull on command, unlike \"just relax.\" Paired with eye contact, a slower rate reads as control, not hesitation.",
    "science": [
      {
        "tier": "t2",
        "text": "Rate control / pacing — fluency-shaping technique from stuttering therapy."
      },
      {
        "tier": "t3",
        "text": "Behavioral rehearsal — deliberate reps under mild pressure transfer to real speech."
      }
    ],
    "content": [
      {
        "h": "Rate control"
      },
      "Read a paragraph aloud at ~70% of your normal speed, recorded. Then repeat at normal pace holding the same articulation. The goal is a rate you can drop into deliberately when you feel yourself speeding up.",
      {
        "h": "Over-articulation"
      },
      "Exaggerate every consonant reading aloud, then repeat at normal pace holding the same jaw opening. This builds crispness that survives when nerves try to mumble it away.",
      {
        "h": "The rhetorical pause"
      },
      "A full stop after a strong statement (Vusi’s 2–3 seconds) reads as authority, not a blank. It’s also your cleanest recovery tool — a deliberate pause is far easier to recover from than a rushed correction."
    ],
    "examples": [
      {
        "h": "Earliest cue you’re rushing"
      },
      "Usually a physical tell — breath goes shallow, or the last word of each sentence clips. Name yours, and use it as the trigger to drop back to your controlled rate."
    ],
    "practice": [
      {
        "ol": [
          "Daily: one paragraph at 70% speed (recorded), then at normal pace with the same articulation.",
          "Deliver a 90-second PREP answer at the reduced rate.",
          "Use one deliberate rhetorical pause in a real conversation this week."
        ]
      },
      {
        "note": "Don’t slow down so far it reads as hesitant — anchor the slower rate with steady eye contact."
      }
    ],
    "reflection": [
      "Did the slower rate survive a real conversation, or speed back up?",
      "What’s the earliest physical cue that you’re about to rush?"
    ]
  },
  {
    "num": 6,
    "title": "Logic Frameworks",
    "subtitle": "Structure answers so the point comes first",
    "objective": "Have a structure ready for any spoken answer, so you never meander in search of your own point.",
    "why": "Leading with your conclusion reduces listener load and removes the meandering search-for-the-point that reads as hesitance under pressure. A structure is a skeleton you fill live — not a script you recite.",
    "science": [
      {
        "tier": "t3",
        "text": "Pyramid Principle (Minto) — practitioner consensus, a strong default not a law."
      },
      {
        "tier": "t3",
        "text": "Behavioral rehearsal — structured reps build a retrievable pattern under pressure."
      }
    ],
    "content": [
      {
        "h": "Four frameworks, four uses"
      },
      {
        "ul": [
          "PREP — Point, Reason, Example, Point. The default for opinions and answers.",
          "Pyramid Principle — Conclusion → Because → For example → Therefore. For structured explanations.",
          "Feynman — explain it to a 12-year-old; where you reach for jargon is the gap you don’t understand.",
          "Story (STAR) — Situation, Task, Action, Result. For anecdotes and experience questions."
        ]
      },
      "Full step-by-step versions of each live in the Reference Library. Here, the skill is choosing the right one fast and filling it live."
    ],
    "examples": [
      {
        "h": "PREP in action"
      },
      "\"We should ship Friday. (Point) The remaining bugs are cosmetic, not functional. (Reason) The checkout flow, the one that matters, passed every test yesterday. (Example) So Friday. (Point)\"",
      {
        "h": "Feynman catches the gap"
      },
      "Explaining JWT auth, if you say \"it’s signed\" and can’t say what signing prevents — that’s the gap. Feynman surfaces it before an audience does."
    ],
    "practice": [
      {
        "ol": [
          "Conclusion-first drill: three random topics daily, 2 minutes each, recorded. Conclusion → Because → Example → Therefore.",
          "Pick one technical concept and run it through Feynman until no jargon remains.",
          "Use the answer-first structure once, unrehearsed, in a real conversation."
        ]
      },
      {
        "note": "Over-structuring until it sounds scripted is the failure mode — the structure is a skeleton, not a script."
      }
    ],
    "reflection": [
      "Where did the structure break down — the \"because,\" the \"example,\" or the \"therefore\"?",
      "Did leading with the answer change how people responded to you?"
    ]
  },
  {
    "num": 7,
    "title": "Recovery Protocol",
    "subtitle": "PACE+ and decision trees for when it breaks",
    "objective": "Have an automatic, rehearsed response for every failure mode, so a freeze becomes a clean recovery instead of a spiral.",
    "why": "You will freeze sometimes — the goal was never zero freezes. The goal is that a freeze costs you two seconds and a clean restart, not the whole conversation. A rehearsed recovery is what separates a stumble from a spiral.",
    "science": [
      {
        "tier": "t1",
        "text": "Behavioral rehearsal of a competing response — pre-drilled recovery fires when it’s needed."
      },
      {
        "tier": "t1",
        "text": "Self-efficacy (Bandura) — each logged clean recovery is evidence you can handle the next one."
      }
    ],
    "content": [
      {
        "h": "PACE+ — the core loop"
      },
      {
        "ol": [
          "Pause — stop completely, 1–2 sec. Don’t push through a jumbled sentence.",
          "Accept — \"I’m thinking,\" not \"I’m failing.\" Reset posture, soften the jaw.",
          "Continue — restart from your last complete idea, slower, in English, with an anchor phrase.",
          "End clean — finish the sentence. No apology.",
          "+ Language Lock — restart is always in English, even mid-stumble."
        ]
      },
      {
        "h": "Decision trees by failure mode"
      },
      "Each specific failure has its own two-or-three-step tree — forgot the sentence, blanked completely, got interrupted, lost eye contact, switched to Pidgin. Drill them from the Reference Library so the right one fires without deliberation.",
      {
        "h": "Before / During / After"
      },
      {
        "ul": [
          "Before: pre-speech ritual + know your first sentence.",
          "During: PACE+ on any break. Don’t narrate the freeze.",
          "After: log freeze count, whether recovery succeeded, one thing that worked, one to adjust."
        ]
      }
    ],
    "examples": [
      {
        "h": "Blanked completely"
      },
      "One diaphragmatic breath (buys 2 seconds legitimately) → say your conclusion again (\"The point is…\"), which re-anchors you and the listener → rebuild from the conclusion outward."
    ],
    "practice": [
      {
        "ol": [
          "Memorize PACE+ until you can run it without looking.",
          "Rehearse each decision tree aloud once from the Reference Library.",
          "After any real freeze, log it in Current Exposure — a logged freeze with a clean recovery is a success."
        ]
      },
      {
        "note": "You don’t have to win the argument with your anxiety in the moment. If the reframe doesn’t land live, use it in the post-mortem."
      }
    ],
    "reflection": [
      "Which failure mode happens to you most — and is its decision tree automatic yet?",
      "When you last froze, did you recover clean or spiral? What was the difference?"
    ]
  },
  {
    "num": 8,
    "title": "Exposure Ladder",
    "subtitle": "14 ranked rungs, logged and tracked",
    "objective": "Climb a ranked ladder of real-world speaking exposures, logging anxiety and recovery at every rung.",
    "why": "Ranked, repeated exposure is the single most replicated intervention for a fear response. The ladder turns a vague \"get more confident\" into a concrete next action — and the log turns your progress into something you can actually see.",
    "science": [
      {
        "tier": "t1",
        "text": "Graded exposure hierarchy (Wolpe) — systematic desensitization, decades of replication."
      },
      {
        "tier": "t1",
        "text": "Self-efficacy (Bandura) — mastery experiences are the strongest source of confidence."
      }
    ],
    "content": [
      {
        "h": "How to climb"
      },
      "Attempt the lowest rung you haven’t cleared. Completion matters, not the outcome — a rung \"counts\" if you attempted it in English without escaping to Pidgin, regardless of how it went. Repeat a rung until the anxiety-before drops, then move up.",
      {
        "h": "Log every attempt"
      },
      "Each attempt records anxiety before (1–10), anxiety after (1–10), freeze count, whether you recovered clean, and notes. Log from the Current Exposure tab. Over time, anxiety-after dropping below anxiety-before is your clearest proof the mechanism is working.",
      {
        "note": "Don’t wait to feel calm before a rung. The exposure itself creates the calm — it is not a precondition."
      }
    ],
    "examples": [
      {
        "h": "The 14 rungs"
      },
      {
        "ladder": true
      }
    ],
    "practice": [
      {
        "ol": [
          "Identify the lowest rung you haven’t cleared.",
          "Attempt it this week and log the attempt in Current Exposure.",
          "Repeat any rung until anxiety-before drops meaningfully before moving up."
        ]
      }
    ],
    "reflection": [
      "Which rung is your current edge — and what specifically makes it hard (the person, the stakes, the unscriptedness)?",
      "Across your logged attempts, is anxiety-after trending below anxiety-before yet?"
    ]
  },
  {
    "num": 9,
    "title": "Technical Communication",
    "subtitle": "Explain any concept to any audience",
    "objective": "Explain technical concepts clearly to any audience, from a child to a CEO, on demand.",
    "why": "Explaining a concept you know cold removes the \"do I understand this?\" anxiety and isolates the delivery skill. Varying the audience forces you to adjust register live — the exact flexibility real conversations demand.",
    "science": [
      {
        "tier": "t3",
        "text": "Feynman technique — teaching to a novice surfaces gaps in your own understanding."
      },
      {
        "tier": "t3",
        "text": "Behavioral rehearsal — varied-audience reps build register-switching under pressure."
      }
    ],
    "content": [
      {
        "h": "Four audiences"
      },
      {
        "ul": [
          "Child — one everyday analogy, zero jargon.",
          "Mother (smart non-technical adult) — plain language, why it matters to her.",
          "Engineer — precise, the tradeoffs and edge cases.",
          "CEO — the bottom line first, cost/benefit, one sentence."
        ]
      },
      {
        "h": "Topic rotation"
      },
      "Cycle these concepts, each explained to a different audience: Binary Search, HTTP, JWT, React rendering, SQL JOIN, Git branching, API vs Library, Debugging Workflow. Rotate audience and topic daily so no pairing gets memorized."
    ],
    "examples": [
      {
        "h": "SQL JOIN, four ways"
      },
      {
        "ul": [
          "Child: \"Two sticker books, matched by the stickers they share.\"",
          "Mother: \"Combining two lists by a column they have in common, like matching orders to customers.\"",
          "Engineer: \"Inner vs outer join semantics, null handling on the outer side, index on the join key.\"",
          "CEO: \"It’s how we connect two datasets to answer one question — fast if indexed, slow if not.\""
        ]
      }
    ],
    "practice": [
      {
        "ol": [
          "Pick one topic daily; explain it to a non-technical friend in under 2 minutes, English only, no notes.",
          "Then re-explain the same topic to a different audience from the four above.",
          "Record one explanation and review it for jargon leaks (the Feynman gaps)."
        ]
      }
    ],
    "reflection": [
      "Which audience is hardest for you — and what does that reveal about your default register?",
      "Which topic exposed a real gap in your own understanding when you tried to simplify it?"
    ]
  },
  {
    "num": 10,
    "title": "Role Models",
    "subtitle": "Framings to apply the mechanics in your own voice",
    "objective": "Borrow specific, concrete framings from strong speakers — as inspiration, never as an accent or personality to copy.",
    "why": "The underlying mechanisms — breath, structure, pausing — are already trained at Tier 1–2. Role models are just useful language for applying them in your own voice. Treat them as inspiration, not evidence.",
    "science": [
      {
        "tier": "t4",
        "text": "Role-model techniques — observed patterns in individuals, not independently tested. Tier 4: inspiration only."
      }
    ],
    "content": [
      {
        "h": "Vusi Thembekwayo — gravitas through structure"
      },
      {
        "ul": [
          "Tripartite structure: Point → Counterpoint → Synthesis.",
          "Ground every abstract claim in one concrete example.",
          "A 2–3 second deliberate pause right after a strong statement."
        ]
      },
      {
        "h": "Mehdi Hasan — interruption control"
      },
      {
        "ul": [
          "Acknowledge-redirect: \"Right, and here’s the piece that matters—\"",
          "The boundary: \"Let me finish this thought, then I’ll take that—\"",
          "The deflection: \"That’s a separate question — let’s come back to it.\""
        ]
      },
      {
        "h": "Vinh Giang — vocal mechanics"
      },
      {
        "ul": [
          "Yawn-Ahhh to open resonance.",
          "Lip trills to a song’s melody for breath support.",
          "Over-articulation, then normal pace holding the same jaw opening."
        ]
      }
    ],
    "examples": [
      {
        "note": "The goal is never to copy their delivery, cadence, or accent. The goal is your own calm, authentic voice, using their framings as scaffolding."
      }
    ],
    "practice": [
      {
        "ol": [
          "Borrow one Vusi structure for a Logic-Thread drill this week.",
          "Rehearse one Mehdi boundary line until it’s automatic.",
          "Add one Vinh vocal drill to your Resonance phase."
        ]
      }
    ],
    "reflection": [
      "Which single framing actually fits your voice — and which felt like costume?",
      "Are you borrowing a mechanism (good) or imitating a personality (a trap)?"
    ]
  },
  {
    "num": 11,
    "title": "Handling Interruptions",
    "subtitle": "Hold the floor without switching or escalating",
    "objective": "Stay in English and keep your point when you’re interrupted, challenged, or tested.",
    "why": "Interruptions and challenges are peak-pressure moments — exactly where the freeze and the switch fire. Pre-scripted boundary lines let you hold the floor calmly, without conceding your point or escalating into conflict.",
    "science": [
      {
        "tier": "t2",
        "text": "Cognitive flexibility rehearsal — arguing both sides trains real-time adaptability."
      },
      {
        "tier": "t3",
        "text": "Behavioral rehearsal — pre-drilled boundary lines fire under pressure."
      }
    ],
    "content": [
      {
        "h": "Boundary statements (Mehdi scripts)"
      },
      {
        "ul": [
          "\"Let me finish this thought, then I’ll take that—\" — polite, firm, doesn’t concede the floor.",
          "\"Right, and here’s the piece that matters—\" — absorbs the interruption, pivots back.",
          "\"That’s a separate question — let’s come back to it.\" — for a derail, not a genuine engagement."
        ]
      },
      {
        "h": "The steelman drill"
      },
      "State the strongest version of the opposing view before you answer it. It reads as confidence, disarms the challenger, and pressure-tests your own position — it does not mean abandoning it.",
      {
        "h": "Intent matching"
      },
      "Read whether an interruption is genuine engagement or a derail, and respond in kind. Engage the real question; deflect the derail. Matching intent keeps you calm because you’re responding to what’s actually happening, not to the adrenaline."
    ],
    "examples": [
      {
        "h": "Steelman in one line"
      },
      "\"The strongest case against shipping Friday is that a cosmetic bug in the demo could cost us the client — and I’d still ship, because the client sees the checkout flow, not the demo.\""
    ],
    "practice": [
      {
        "ol": [
          "Memorize the three boundary lines until they’re automatic.",
          "Run one steelman drill: pick a view you hold, state the opposite’s strongest form, then answer it.",
          "Handle one real interruption this week without switching to Pidgin (ladder rung 9)."
        ]
      }
    ],
    "reflection": [
      "When interrupted, do you concede the floor, freeze, or hold — and which line would have helped?",
      "Can you state the strongest opposing view to something you believe, fairly?"
    ]
  },
  {
    "num": 12,
    "title": "Maintenance",
    "subtitle": "The long-term operating system",
    "objective": "Keep the gains indefinitely with a light maintenance rhythm and a written relapse-prevention plan.",
    "why": "A program that ends without a maintenance plan usually reverts. Self-efficacy is built from accumulated evidence, so maintenance is about manufacturing that evidence on a schedule — not grinding forever. Finishing the modules is the start of maintenance, not the finish line.",
    "science": [
      {
        "tier": "t1",
        "text": "Relapse prevention planning (Marlatt & Gordon) — CBT maintenance-phase protocol."
      },
      {
        "tier": "t1",
        "text": "Self-efficacy theory (Bandura) — maintained through periodic mastery experiences."
      }
    ],
    "content": [
      {
        "h": "Weekly maintenance dose"
      },
      {
        "ul": [
          "One real exposure at or near your current ceiling.",
          "One recorded baseline rep, compared against your earliest recording.",
          "A glance at Analytics — recovery rate and anxiety trend should hold or improve."
        ]
      },
      {
        "h": "Relapse-prevention plan (write it once, revisit quarterly)"
      },
      {
        "ol": [
          "Name your top 2 highest-risk situations going forward.",
          "For each, pre-commit to the exact protocol you’ll run (usually PACE+ + English Lock).",
          "Define your early-warning sign of drift (e.g. switch-count creeping back up).",
          "Decide the trigger that sends you back to a specific module for a refresher."
        ]
      },
      {
        "h": "This is an OS, not a course"
      },
      "Re-read this module every few weeks. Revisit any earlier module when its skill feels rusty. The tracker and analytics keep running for years — that long baseline is the whole point."
    ],
    "examples": [
      {
        "h": "Baseline comparison"
      },
      "Re-record the exact first exercise you ever did. Compare side by side — filler count, pace, freeze count. The difference you can hear immediately is the evidence that sustains the habit."
    ],
    "practice": [
      {
        "ol": [
          "Write your one-page relapse-prevention plan now.",
          "Schedule a weekly maintenance exposure and put it in the tracker.",
          "Re-record your Week-1 baseline and log the comparison."
        ]
      },
      {
        "note": "Treating \"done with the modules\" as the finish line is the classic relapse trigger. This phase is ongoing."
      }
    ],
    "reflection": [
      "What changed between your earliest and latest recording that you can hear immediately?",
      "What are your top 2 highest-risk situations, and what protocol runs in each?"
    ]
  }
];

export const FRAMEWORKS = [
  {
    "id": "pace",
    "name": "PACE+ Recovery Protocol",
    "tag": "t1",
    "steps": [
      [
        "P — Pause",
        "Stop completely, 1–2 sec. Don’t push through a jumbled sentence."
      ],
      [
        "A — Accept",
        "\"I’m thinking,\" not \"I’m failing.\" Reset posture — shoulders back, jaw soft."
      ],
      [
        "C — Continue",
        "Restart from your last complete idea, slower, in English, with an anchor phrase."
      ],
      [
        "E — End clean",
        "Finish the sentence. No apology."
      ],
      [
        "+ Language Lock",
        "Once you start a sentence in English, finish it in English — even mid-stumble. The restart-language is always English, no exceptions."
      ]
    ]
  },
  {
    "id": "prep",
    "name": "PREP Framework",
    "tag": "t3",
    "steps": [
      [
        "Point",
        "State your answer first."
      ],
      [
        "Reason",
        "Why that’s your answer."
      ],
      [
        "Example",
        "One concrete case."
      ],
      [
        "Point",
        "Restate it to close."
      ]
    ]
  },
  {
    "id": "pyramid",
    "name": "Pyramid Principle",
    "tag": "t3",
    "steps": [
      [
        "Conclusion first",
        "Conclusion → Because → For example → Therefore. Lead with the answer, not the journey to it."
      ]
    ]
  },
  {
    "id": "feynman",
    "name": "Feynman Technique",
    "tag": "t3",
    "steps": [
      [
        "Name it plainly",
        "State the concept as if to a curious 12-year-old — no jargon."
      ],
      [
        "Explain in plain words",
        "Talk it through out loud. The moment you reach for jargon, you’ve found the gap."
      ],
      [
        "Find the gap",
        "Where the explanation broke down is exactly what you don’t yet understand. Go relearn that piece."
      ],
      [
        "Simplify & analogize",
        "Rebuild with one everyday analogy. If it still needs jargon, it isn’t simple enough yet."
      ]
    ]
  },
  {
    "id": "story",
    "name": "Story Framework (STAR)",
    "tag": "t3",
    "steps": [
      [
        "Situation",
        "Set the scene in one line."
      ],
      [
        "Task",
        "What needed solving."
      ],
      [
        "Action",
        "The decision you made."
      ],
      [
        "Result",
        "The outcome, stated plainly."
      ]
    ]
  },
  {
    "id": "englishlock",
    "name": "English Lock Rule",
    "tag": "t1",
    "steps": [
      [
        "The rule",
        "Once a sentence starts in English, it finishes in English — even mid-stumble."
      ],
      [
        "If you fully lose it",
        "Pause, breathe, restart the sentence in English, never Pidgin."
      ],
      [
        "Why",
        "No exceptions, so your brain stops treating Pidgin as an available exit."
      ]
    ]
  }
];

export const ROLE_MODELS = [
  {
    "name": "Vusi Thembekwayo",
    "desc": "Business gravitas through structure and restraint",
    "rows": [
      [
        "Tripartite structure",
        "Point → Counterpoint → Synthesis. State a claim, name the strongest objection, resolve into a sharper final position."
      ],
      [
        "Metaphor-to-data ratio",
        "Ground abstract claims in one concrete example before moving on — never left floating as theory."
      ],
      [
        "Deliberate pause",
        "A 2–3 second silence immediately after a strong statement, before elaboration."
      ]
    ]
  },
  {
    "name": "Mehdi Hasan",
    "desc": "Interview logic and interruption control",
    "rows": [
      [
        "Acknowledge-redirect",
        "\"Right, and here’s the piece that matters—\" absorbs an interruption, then pivots back to your point."
      ],
      [
        "The boundary",
        "\"Let me finish this thought, then I’ll take that—\" polite, firm, doesn’t concede the floor."
      ],
      [
        "The deflection",
        "\"That’s a separate question — let’s come back to it,\" for someone trying to derail rather than engage."
      ]
    ]
  },
  {
    "name": "Vinh Giang",
    "desc": "Vocal mechanics as trainable motor skill",
    "rows": [
      [
        "Yawn-Ahhh",
        "Start a yawn, hold the lifted soft palate, voice an \"ahh\" — opens the resonance space a tight, anxious throat closes off."
      ],
      [
        "Lip trills to rhythm",
        "Hum lip trills to a song’s melody — builds steady breath support without forcing volume."
      ],
      [
        "Over-articulation",
        "Exaggerate every consonant reading aloud, then repeat at normal pace holding the same jaw opening."
      ]
    ]
  }
];

export const RECOVERY = {
  "scenarios": [
    {
      "sit": "Forgot the sentence mid-way",
      "tree": [
        "Pause — full stop, don’t backfill with filler.",
        "Restate your last complete idea in English.",
        "Continue from there, slower. No apology."
      ]
    },
    {
      "sit": "Blanked completely",
      "tree": [
        "One diaphragmatic breath — buys 2 seconds legitimately.",
        "Say your conclusion again (\"The point is…\") — it re-anchors you and the listener.",
        "Rebuild from the conclusion outward."
      ]
    },
    {
      "sit": "Got interrupted",
      "tree": [
        "Hold the floor: \"Let me finish this thought, then I’ll take that.\"",
        "Finish your sentence in English.",
        "Then engage the interruption on your terms."
      ]
    },
    {
      "sit": "Lost eye contact / looked away",
      "tree": [
        "Don’t announce it. Finish the current clause.",
        "Re-anchor eye contact on the next sentence’s first word.",
        "Log it as a body-language cue for tomorrow’s mirror rep."
      ]
    },
    {
      "sit": "Switched to Pidgin",
      "tree": [
        "Language Lock: do NOT restart in Pidgin.",
        "Pause, breathe, restart the sentence in English.",
        "The switch is data for your trigger map, not a failure."
      ]
    }
  ],
  "triggerMap": [
    "Log every freeze/switch: who was present, the stakes, whether it was scripted.",
    "Look for the pattern — is it a person type (women, authority), a topic, or unscriptedness?",
    "The trigger, once named, becomes your next exposure-ladder target."
  ],
  "examples": [
    [
      "\"If I switch, they’ll think I’m uneducated.\"",
      "My degree is a fact. Pidgin is a habit, not a deficit."
    ],
    [
      "\"Everyone noticed that freeze.\"",
      "On playback, my \"obvious\" freeze was a 1-second pause nobody flagged."
    ],
    [
      "\"I need to feel calm before I speak.\"",
      "The exposure creates the calm. Waiting to feel ready is the trap."
    ]
  ]
};

export const FAQ = [
  {
    "q": "What if I skip a week?",
    "a": "Nothing breaks. This is an operating system, not a countdown. Resume at the module you were on — don’t restart from zero, and don’t \"make up\" skipped days by doubling. Consistency over weeks beats intensity over days. If you skip, run a Minimum Viable Day to keep the habit alive: one breath reset, one exposure, one tracker entry."
  },
  {
    "q": "What is a Minimum Viable Day?",
    "a": "The smallest version of the practice that still counts. On a bad day: 4 minutes of box breathing, one small exposure (even rung 1–2), and a single tracker line. It protects the streak and the identity (\"I am someone who does this\") without demanding the full 20-minute routine. A Minimum Viable Day is a win, not a failure."
  },
  {
    "q": "How do I know I’m improving?",
    "a": "Not by how you feel in the moment — feeling is a bad instrument here. Improvement shows up in the data: recovery rate climbing, anxiety-after dropping below anxiety-before, exposure rung progression, and your Week-1-vs-now baseline recording. Trust the Analytics tab over your memory of a single bad conversation."
  },
  {
    "q": "What if a freeze happens in a real, high-stakes moment?",
    "a": "Run PACE+ exactly as drilled: Pause, Accept, Continue in English, End clean. You don’t have to win the argument with your anxiety in the moment — if the reframe doesn’t land live, use it in the post-mortem. Then log it. A logged freeze with a clean recovery is a success, not a setback."
  },
  {
    "q": "Do I have to do the modules in order?",
    "a": "The first time through, roughly yes — breath and reframing (Modules 1–4) underpin everything above them. After that, this becomes a reference library: revisit any module when its skill feels rusty. Maintenance (Module 12) is meant to be re-read every few weeks indefinitely."
  },
  {
    "q": "Is this a substitute for therapy?",
    "a": "No. This is educational and self-directed. If freezing, anxiety, or fluency issues feel severe or persistent, a licensed speech-language pathologist or therapist can tailor this far more precisely to you. Verify any technique here independently."
  }
];

export const QUOTES = [
  "This isn’t a language problem — it’s a performance-under-pressure pattern.",
  "Breathe → speak in English → recover clean if you freeze. In that order.",
  "The exposure creates the calm. It is not a precondition for it.",
  "A logged freeze with a clean recovery is a success, not a setback.",
  "You replace a habit — you don’t just remove one.",
  "Slower, paired with eye contact, reads as control — not hesitation.",
  "Lead with the answer, not the journey to it.",
  "Absence of a freeze is still data. Log the quiet days too.",
  "The restart-language is always English. No exceptions.",
  "Completion matters, not the outcome.",
  "Your writing is already fluent. That’s evidence the gap is stress, not competence.",
  "Finishing the program is the start of maintenance, not the finish line."
];
