// The activities, in slide order. Edit wording here; both pages read this file.
window.ACTIVITIES = [
  { id: "wordcloud", label: "Warm-up word cloud", kind: "text", max: 3, display: "cloud",
    title: "How did you learn something new this week?", hint: "One or two words, e.g. YouTube" },

  { id: "cert", label: "Poll: certificates", kind: "choice", display: "bars",
    title: "Have you ever earned a certificate outside your degree?",
    options: ["Yes, from an online course", "Yes, from a workshop or competition", "Not yet, but I’d like to", "Not sure what counts"] },

  { id: "q1", quiz: true, label: "Myth or Fact 1", kind: "choice", options: ["Myth", "Fact"], answer: "Myth",
    title: "AI always gives correct answers.", why: "AI can be confidently wrong, so always check." },
  { id: "q2", quiz: true, label: "Myth or Fact 2", kind: "choice", options: ["Myth", "Fact"], answer: "Fact",
    title: "AI can explain the same topic in many different ways.", why: "Ask for an example, an analogy or a step-by-step version." },
  { id: "q3", quiz: true, label: "Myth or Fact 3", kind: "choice", options: ["Myth", "Fact"], answer: "Fact",
    title: "AI tools can invent sources that don’t exist.", why: "Made-up references happen. Verify every source." },
  { id: "q4", quiz: true, label: "Myth or Fact 4", kind: "choice", options: ["Myth", "Fact"], answer: "Myth",
    title: "Letting AI write your whole assignment still counts as learning.", why: "Learning happens when you do the thinking." },
  { id: "q5", quiz: true, label: "Myth or Fact 5", kind: "choice", options: ["Myth", "Fact"], answer: "Myth",
    title: "Micro-credentials can only be offered by universities.", why: "Industry, professional bodies and training providers offer them too." },
  { id: "q6", quiz: true, label: "Myth or Fact 6", kind: "choice", options: ["Myth", "Fact"], answer: "Fact",
    title: "Several micro-credentials can be stacked toward a bigger award.", why: "It depends on the programme and its credit rules." },
  { id: "q7", quiz: true, label: "Myth or Fact 7", kind: "choice", options: ["Myth", "Fact"], answer: "Fact",
    title: "Your learning platform can record how long you spend on a page.", why: "Platforms log activity such as time and clicks." },
  { id: "q8", quiz: true, label: "Myth or Fact 8", kind: "choice", options: ["Myth", "Fact"], answer: "Myth",
    title: "Once you graduate, you won’t need to learn new skills.", why: "Skills change fast. Lifelong learning is the new normal." },

  { id: "vote", label: "Hall vote: prediction", kind: "choice", display: "bars",
    title: "The university can predict you’ll fail a course. Should it tell you?",
    options: ["Yes", "No", "It depends"] },

  { id: "ideas", label: "Design your 2035 self", kind: "text", max: 3, display: "feed",
    title: "Your 2035 learner’s path",
    hint: "Degree + micro-credentials + AI tools + one human skill" },

  { id: "exit", label: "Exit ticket", kind: "text", max: 1, display: "feed",
    title: "One thing I’ll do differently with AI, starting tomorrow.", hint: "One specific sentence" },
];
window.TEAMS = [
  { id: "left", name: "Left" },
  { id: "middle", name: "Middle" },
  { id: "right", name: "Right" },
];
