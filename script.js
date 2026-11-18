
const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const exitBtn = document.getElementById("exitBtn");
const hintBtn = document.getElementById("hintBtn");
const listenBtn = document.getElementById("listenBtn");

const scoreElement = document.getElementById("score");
const recordElement = document.getElementById("record");
const levelElement = document.getElementById("level");
const timerElement = document.getElementById("timer");
const timerBox = document.getElementById("timerBox");

const instrumentEmoji = document.getElementById("instrumentEmoji");
const questionTitle = document.getElementById("questionTitle");
const questionDescription = document.getElementById("questionDescription");
const answersElement = document.getElementById("answers");
const messageElement = document.getElementById("message");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const questionNumber = document.getElementById("questionNumber");
const hintCount = document.getElementById("hintCount");

const finalScore = document.getElementById("finalScore");
const correctAnswers = document.getElementById("correctAnswers");
const finalRecord = document.getElementById("finalRecord");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");

// MUSIQA ASBOBLARI
const instruments = [
  {
    name: "Gitara",
    emoji: "🎸",
    description: "Torli musiqa asbobi",
    frequency: 330,
    wave: "triangle"
  },
  {
    name: "Pianino",
    emoji: "🎹",
    description: "Klaviaturali musiqa asbobi",
    frequency: 523,
    wave: "sine"
  },
  {
    name: "Skripka",
    emoji: "🎻",
    description: "Kamon bilan chalinadigan asbob",
    frequency: 660,
    wave: "sawtooth"
  },
  {
    name: "Baraban",
    emoji: "🥁",
    description: "Zarb bilan chalinadigan asbob",
    frequency: 110,
    wave: "triangle"
  },
  {
    name: "Nay",
    emoji: "🪈",
    description: "Puflab chalinadigan cholg‘u",
    frequency: 784,
    wave: "sine"
  },
  {
    name: "Saksafon",
    emoji: "🎷",
    description: "Puflab chalinadigan musiqa asbobi",
    frequency: 440,
    wave: "sawtooth"
  },
  {
    name: "Truba",
    emoji: "🎺",
    description: "Mis puflama cholg‘u",
    frequency: 587,
    wave: "square"
  },
  {
    name: "Dutor",
    emoji: "🪕",
    description: "O‘zbek xalq torli cholg‘usi",
    frequency: 392,
    wave: "triangle"
  },
  {
    name: "Doira",
    emoji: "🪘",
    description: "O‘zbek xalq zarbli cholg‘usi",
    frequency: 150,
    wave: "triangle"
  },
  {
    name: "Arfa",
    emoji: "🎼",
    description: "Ko‘p torli musiqa asbobi",
    frequency: 698,
    wave: "sine"
  },
  {
    name: "Akkordeon",
    emoji: "🪗",
    description: "Tugmali puflama cholg‘u",
    frequency: 494,
    wave: "square"
  },
  {
    name: "Kontrabas",
    emoji: "🎻",
    description: "Past ovozli katta torli asbob",
    frequency: 165,
    wave: "triangle"
  },
  {
    name: "Fleyta",
    emoji: "🪈",
    description: "Mayin ovozli puflama asbob",
    frequency: 880,
    wave: "sine"
  },
  {
    name: "Lira",
    emoji: "🎶",
    description: "Qadimiy torli musiqa asbobi",
    frequency: 587,
    wave: "sine"
  },
  {
    name: "Ksilofon",
    emoji: "🎵",
    description: "Yog‘och plastinkali zarbli asbob",
    frequency: 740,
    wave: "sine"
  },
  {
    name: "Elektrogitara",
    emoji: "🎸",
    description: "Elektr yordamida ovoz chiqaradigan gitara",
    frequency: 294,
    wave: "sawtooth"
  },
  {
    name: "Tuba",
    emoji: "🎺",
    description: "Past ovozli mis puflama asbob",
    frequency: 220,
    wave: "square"
  },
  {
    name: "Marakas",
    emoji: "🪇",
    description: "Silkitib chalinadigan zarbli asbob",
    frequency: 350,
    wave: "triangle"
  },
  {
    name: "Garmon",
    emoji: "🪗",
    description: "Havo yordamida ovoz chiqaradigan cholg‘u",
    frequency: 440,
    wave: "square"
  },
  {
    name: "Viyolonsel",
    emoji: "🎻",
    description: "Kamon bilan chalinadigan torli asbob",
    frequency: 262,
    wave: "sawtooth"
  }
];

// O'YIN O'ZGARUVCHILARI
let score = 0;
let record = Number(localStorage.getItem("musicQuizRecord")) || 0;
let currentIndex = 0;
let correctCount = 0;
let hints = 3;
let timeLeft = 20;
let timerInterval = null;
let currentQuestion = null;
let locked = false;
let gameQuestions = [];

recordElement.textContent = record;

// AUDIO TIZIMI
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      alert("Brauzeringiz audio tovushlarni qo‘llab-quvvatlamaydi.");
      return null;
    }

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

// Asbob tovushining elektron namunasini yaratish
function playInstrument(instrument) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const isDrum =
    instrument.name === "Baraban" ||
    instrument.name === "Doira" ||
    instrument.name === "Marakas";

  if (isDrum) {
    // Zarbli asboblar uchun qisqa tovush
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(
      instrument.frequency,
      now
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      45,
      now + 0.3
    );

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.35
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.36);
    return;
  }

  // Melodik asboblar uchun bir nechta nota
  const notes = [
    instrument.frequency,
    instrument.frequency * 1.25,
    instrument.frequency * 1.5
  ];

  notes.forEach((frequency, index) => {
    const startTime = now + index * 0.22;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = instrument.wave;
    oscillator.frequency.setValueAtTime(
      frequency,
      startTime
    );

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(
      0.2,
      startTime + 0.04
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + 0.48
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.5);
  });
}

function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 650;

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.1
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
}

// SAVOLLARNI ARALASHTIRISH
function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// O'YINNI BOSHLASH
function startGame() {
  clearInterval(timerInterval);

  getAudioContext();

  score = 0;
  currentIndex = 0;
  correctCount = 0;
  hints = 3;
  locked = false;

  gameQuestions = shuffle(instruments);

  scoreElement.textContent = score;
  hintCount.textContent = hints;

  showScreen(gameScreen);
  showQuestion();
}

function showScreen(screen) {
  welcomeScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  screen.classList.add("active");
}

// SAVOLNI KO'RSATISH
function showQuestion() {
  clearInterval(timerInterval);
  locked = false;

  if (currentIndex >= gameQuestions.length) {
    finishGame();
    return;
  }

  currentQuestion = gameQuestions[currentIndex];

  const questionOptions = shuffle([
    currentQuestion,
    ...shuffle(
      instruments.filter(
        item => item.name !== currentQuestion.name
      )
    ).slice(0, 3)
  ]);

  instrumentEmoji.textContent = currentQuestion.emoji;

  questionTitle.textContent = "Bu qaysi musiqa asbobi?";
  questionDescription.textContent =
    "Rasmga qarang, tovushni tinglang va javobni toping.";

  answersElement.innerHTML = "";
  messageElement.textContent = "";
  messageElement.className = "message";

  questionNumber.textContent =
    `Savol ${currentIndex + 1} / ${gameQuestions.length}`;

  const percentage =
    (currentIndex / gameQuestions.length) * 100;

  progressFill.style.width = percentage + "%";
  progressText.textContent = Math.round(percentage) + "%";

  const currentLevel = Math.floor(currentIndex / 4) + 1;
  levelElement.textContent = currentLevel + " / 5";

  questionOptions.forEach((instrument, index) => {
    const button = document.createElement("button");

    button.className = "answer-btn";
    button.textContent = `${index + 1}. ${instrument.name}`;

    button.addEventListener("click", () => {
      checkAnswer(instrument, button);
    });

    answersElement.appendChild(button);
  });

  // Har bosqichda vaqt biroz kamayadi
  timeLeft = Math.max(10, 20 - Math.floor(currentIndex / 4) * 2);

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

// VAQT HISOBLAGICHI
function updateTimer() {
  timerElement.textContent = timeLeft;

  if (timeLeft <= 5) {
    timerBox.classList.add("danger");
  } else {
    timerBox.classList.remove("danger");
  }

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    locked = true;

    messageElement.textContent =
      "⏰ Vaqt tugadi! To‘g‘ri javob: " +
      currentQuestion.name;

    messageElement.className = "message bad";

    showCorrectAnswer();

    setTimeout(nextQuestion, 1400);
    return;
  }

  timeLeft--;
}

// JAVOBNI TEKSHIRISH
function checkAnswer(selected, button) {
  if (locked) return;

  locked = true;
  clearInterval(timerInterval);
  playClickSound();

  const allButtons = document.querySelectorAll(".answer-btn");

  allButtons.forEach(btn => {
    btn.disabled = true;

    if (
      btn.textContent.includes(currentQuestion.name)
    ) {
      btn.classList.add("correct");
    }
  });

  if (selected.name === currentQuestion.name) {
    correctCount++;

    const points = 100 + timeLeft * 5;
    score += points;

    scoreElement.textContent = score;

    messageElement.textContent =
      `🎉 To‘g‘ri! +${points} ball`;

    messageElement.className = "message good";

    button.classList.add("correct");
  } else {
    button.classList.add("wrong");

    messageElement.textContent =
      `❌ Xato! To‘g‘ri javob: ${currentQuestion.name}`;

    messageElement.className = "message bad";
  }

  setTimeout(nextQuestion, 1200);
}

// TO'G'RI JAVOBNI AJRATISH
function showCorrectAnswer() {
  const allButtons = document.querySelectorAll(".answer-btn");

  allButtons.forEach(button => {
    button.disabled = true;

    if (button.textContent.includes(currentQuestion.name)) {
      button.classList.add("correct");
    }
  });
}

// KEYINGI SAVOL
function nextQuestion() {
  currentIndex++;
  showQuestion();
}

// YORDAM TUGMASI
function useHint() {
  if (locked) return;

  if (hints <= 0) {
    messageElement.textContent = "Yordamlar tugadi!";
    messageElement.className = "message bad";
    return;
  }

  const wrongButtons = [...document.querySelectorAll(".answer-btn")]
    .filter(button =>
      !button.textContent.includes(currentQuestion.name) &&
      !button.classList.contains("hidden-answer")
    );

  if (wrongButtons.length === 0) return;

  hints--;
  hintCount.textContent = hints;

  // Bitta noto‘g‘ri javobni yashiramiz
  const randomIndex = Math.floor(
    Math.random() * wrongButtons.length
  );

  wrongButtons[randomIndex].classList.add("hidden-answer");

  messageElement.textContent =
    "💡 Yordam: bitta noto‘g‘ri javob olib tashlandi.";

  messageElement.className = "message good";
}

// TOVUSHNI TINGLASH
function listenToInstrument() {
  if (!currentQuestion || locked) return;

  playInstrument(currentQuestion);

  listenBtn.classList.add("playing");
  listenBtn.innerHTML = "🎶 TOVUSH CHALINMOQDA...";

  setTimeout(() => {
    listenBtn.classList.remove("playing");
    listenBtn.innerHTML = "🔊 TOVUSHNI TINGLASH";
  }, 900);
}

// O'YIN YAKUNI
function finishGame() {
  clearInterval(timerInterval);
  timerBox.classList.remove("danger");

  progressFill.style.width = "100%";
  progressText.textContent = "100%";

  const isNewRecord = score > record;

  if (isNewRecord) {
    record = score;
    localStorage.setItem("musicQuizRecord", record);
  }

  recordElement.textContent = record;

  finalScore.textContent = score;
  correctAnswers.textContent =
    `${correctCount} / ${gameQuestions.length}`;

  finalRecord.textContent = record;

  if (correctCount === 20) {
    resultIcon.textContent = "🏆";
    resultTitle.textContent = "Musiqa ustasi!";
    resultDescription.textContent =
      "Ajoyib! Barcha musiqa asboblarini topding!";
  } else if (correctCount >= 15) {
    resultIcon.textContent = "🥇";
    resultTitle.textContent = "Juda zo‘r!";
    resultDescription.textContent =
      "Sen haqiqiy musiqa bilimdonisan!";
  } else if (correctCount >= 10) {
    resultIcon.textContent = "🎵";
    resultTitle.textContent = "Yaxshi natija!";
    resultDescription.textContent =
      "Yana mashq qil va yanada yaxshi natijaga erish!";
  } else {
    resultIcon.textContent = "🎧";
    resultTitle.textContent = "Yana urinib ko‘r!";
    resultDescription.textContent =
      "Musiqa asboblarini o‘rganishda davom et!";
  }

  if (isNewRecord && score > 0) {
    resultDescription.textContent += " Yangi rekord o‘rnatding! 🥇";
  }

  showScreen(resultScreen);
}

// TUGMALAR
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
hintBtn.addEventListener("click", useHint);
listenBtn.addEventListener("click", listenToInstrument);

exitBtn.addEventListener("click", () => {
  const leave = confirm("O‘yindan chiqmoqchimisiz?");

  if (leave) {
    clearInterval(timerInterval);
    showScreen(welcomeScreen);
  }
});
