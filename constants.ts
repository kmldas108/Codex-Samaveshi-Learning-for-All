import React from 'react';
import { UserDisability, AppMode } from "./types";

export const SUPPORTED_LANGUAGES = [
  "English", "Hindi", "Hinglish", "Tamil", "Telugu", "Kannada", "Bangla", "Assamese", "Marathi", "Odia", "Spanish", "French"
];

export const GRADE_OPTIONS = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
  "Undergraduate", "Lifelong Learner"
];

export const DISABILITY_OPTIONS = [
  { id: UserDisability.NONE, label: "None / General Learner", icon: "🎓" },
  { id: UserDisability.VISUAL, label: "Visual Impairment", icon: "👁️" },
  { id: UserDisability.HEARING, label: "Hearing Impairment", icon: "👂" },
  { id: UserDisability.DYSLEXIA, label: "Dyslexia / Reading", icon: "📖" },
];

export const DEFAULT_PREFERENCES = {
  name: "",
  grade: "Grade 6",
  language: "English",
  location: "General",
  disability: UserDisability.NONE,
  culturalContext: true,
};

export const APP_MODES = [
  {
    id: AppMode.HEAR_IMAGES,
    title: "Hear Images",
    subtitle: "Visual Impairment Friendly",
    description: "Spatially-aware descriptions & tactile model suggestions.",
    icon: "👁️‍🗨️",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    textColor: "text-blue-800",
    accepts: "image/*,video/*"
  },
  {
    id: AppMode.SEE_SOUND,
    title: "See Sound",
    subtitle: "Hearing Impairment Friendly",
    description: "Visual transcripts, sentiment analysis & key term highlighting.",
    icon: "🔇",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    textColor: "text-purple-800",
    accepts: "audio/*,video/*"
  },
  {
    id: AppMode.EASY_READ,
    title: "Easy Read Mode",
    subtitle: "Dyslexia & Learners",
    description: "Chunked text, local analogies & instant comprehension quizzes.",
    icon: "📖",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    textColor: "text-green-800",
    accepts: "image/*,video/*"
  },
  {
    id: AppMode.CLASS_PACK,
    title: "Class Pack",
    subtitle: "Teachers & Parents",
    description: "Generate student notes & WhatsApp-ready parent summaries.",
    icon: "🏫",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    textColor: "text-orange-800",
    accepts: "image/*,video/*,audio/*"
  }
];

// Icons as React Elements
export const ICONS = {
  camera: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" }),
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" })
  ),
  mic: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" })
  ),
  play: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" })
  ),
  pause: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 5.25v13.5m-7.5-13.5v13.5" })
  ),
  stop: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" })
  ),
  speaker: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" })
  ),
  settings: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" }),
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
  ),
  send: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" })
  ),
  upload: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" })
  ),
  spinner: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6 animate-spin" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" })
  ),
  dots: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 animate-pulse" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" })
  )
};

export const SUBJECT_OPTIONS = ["Science", "Mathematics", "Social Studies"];

export const CURRICULUM_DATA: Record<string, Record<string, string[]>> = {
  "Science": {
    "Kindergarten": ["Plants and Animals", "Our Body", "Weather and Seasons"],
    "Grade 1": ["Plants and Animals", "Weather and Seasons", "My Five Senses"],
    "Grade 2": ["Habitats", "Properties of Matter", "Forces and Motion"],
    "Grade 3": ["Life Cycles", "Earth Resources", "Light and Shadow"],
    "Grade 4": ["Simple Machines", "Human Body Systems", "Electricity and Magnetism"],
    "Grade 5": ["Ecosystems", "Solar System", "States of Matter"],
    "Grade 6": ["Photosynthesis", "Cell Structure", "Friction and Forces"],
    "Grade 7": ["Chemical Reactions", "Respiration in Organisms", "Light and Sound"],
    "Grade 8": ["Cell Division", "Microorganisms", "Metals and Non-metals"],
    "Grade 9": ["Laws of Motion", "Structure of Atom", "Tissue Systems"],
    "Grade 10": ["Genetics & Evolution", "Periodic Classification", "Electricity"],
    "Grade 11": ["Quantum Chemistry", "Thermodynamics", "Cell Division"],
    "Grade 12": ["Molecular Genetics", "Organic Mechanisms", "Electromagnetism"],
    "Undergraduate": ["Quantum Mechanics", "Molecular Biology", "Organic Synthesis"],
    "Lifelong Learner": ["Quantum Mechanics", "Ecology & Climate Change", "Astrophysics"]
  },
  "Mathematics": {
    "Kindergarten": ["Numbers to 10", "Shapes and Patterns", "Basic Measurement"],
    "Grade 1": ["Addition and Subtraction", "Shapes and Patterns", "Numbers to 100"],
    "Grade 2": ["Place Value", "Basic Measurement", "Money and Time"],
    "Grade 3": ["Multiplication and Division", "Fractions Introduction", "Graphing"],
    "Grade 4": ["Decimals and Fractions", "Area and Perimeter", "Angles"],
    "Grade 5": ["Volume", "Graphing Coordinates", "Large Number Operations"],
    "Grade 6": ["Fractions and Decimals", "Ratios and Rates", "Basic Equations"],
    "Grade 7": ["Proportions", "Integers and Rational Numbers", "Probability"],
    "Grade 8": ["Linear Equations", "Pythagorean Theorem", "Exponents"],
    "Grade 9": ["Quadratic Equations", "Congruence of Triangles", "Probability"],
    "Grade 10": ["Trigonometry", "Coordinate Geometry", "Quadratic Formula"],
    "Grade 11": ["Limits and Continuity", "Permutations & Combinations", "Vectors"],
    "Grade 12": ["Calculus & Integration", "Probability Distributions", "Matrices"],
    "Undergraduate": ["Real Analysis", "Abstract Algebra", "Linear Algebra"],
    "Lifelong Learner": ["Financial Mathematics", "Game Theory", "Statistics in Daily Life"]
  },
  "Social Studies": {
    "Kindergarten": ["My Family and School", "Holidays and Traditions", "Basic Directions"],
    "Grade 1": ["My Family and School", "Holidays and Traditions", "Basic Directions"],
    "Grade 2": ["Neighborhoods & Communities", "Basic Economics", "Famous Landmarks"],
    "Grade 3": ["World Geography", "Local Government", "Indigenous Cultures"],
    "Grade 4": ["State Geography & History", "Early Explorers", "Government Structure"],
    "Grade 5": ["Ancient American Civilizations", "The US Constitution", "Westward Expansion"],
    "Grade 6": ["Ancient Mesopotamia & Egypt", "Ancient Greece & Rome", "Democracy Origins"],
    "Grade 7": ["Medieval Empires", "Silk Road Trade", "Renaissance"],
    "Grade 8": ["Industrial Revolution", "Colonization", "Human Rights History"],
    "Grade 9": ["World War I", "French Revolution", "Indian National Movement"],
    "Grade 10": ["World War II", "Cold War Era", "Globalization"],
    "Grade 11": ["Comparative Governments", "Macroeconomics", "Sociology Introduction"],
    "Grade 12": ["Geopolitics", "Microeconomics", "Human Geography"],
    "Undergraduate": ["Modern Political Thought", "International Relations", "Anthropological Theories"],
    "Lifelong Learner": ["World History Overview", "Constitutional Law", "Environmental History"]
  }
};