import { wordleWords, dailyWordsSmall } from "./theWholeEnchilada.js";

let filteredWords = [...dailyWordsSmall];
let history = [];

document.addEventListener("DOMContentLoaded", () => {
  const resetButton1 = document.getElementById("resetButton1");
  const resetButton2 = document.getElementById("resetButton2");
  const submitButton = document.getElementById("submitButton");
  const toggleGroupOne = document.getElementById("toggleGroupOne");
  const groupOneSection = document.querySelector(".group-one");
  const applyFilterButton = document.getElementById("applyFilterButton");
  const fieldOne = document.querySelector(".field-one");
  const groupTwoSection = document.querySelector(".group-two");
  const toggleGroupTwo = document.getElementById("toggleGroupTwo");
  const toggleInstructions = document.getElementById("toggleInstructions");
  const instructions = document.getElementById("instructions");
  const toggleLookupButton = document.getElementById("toggleLookupButton");
  const lookupSection = document.getElementById("lookupSection");
  const lookupWordNumberButton = document.getElementById(
    "lookupWordNumberButton"
  );
  const undoButton = document.getElementById("undoButton");

  resetButton1.addEventListener("click", resetGroupOne);
  resetButton2.addEventListener("click", resetFilteredWords);
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    handleWordInput();
  });
  toggleGroupOne.addEventListener("click", function () {
    groupOneSection.classList.toggle("hidden");
  });
  toggleGroupTwo.addEventListener("click", function () {
    groupTwoSection.classList.toggle("hidden");
  });
  toggleInstructions.addEventListener("click", function () {
    instructions.classList.toggle("hidden");
  });
  applyFilterButton.addEventListener("click", handleApplyFilter);
  toggleLookupButton.addEventListener("click", function () {
    lookupSection.classList.toggle("hidden");
  });
  lookupWordNumberButton.addEventListener("click", function () {
    lookupWordNumber();
  });
  undoButton.addEventListener("click", handleUndo);
});

function doesNotContainLetter(letter) {
  return filteredWords.filter((word) => !word.includes(letter.toUpperCase()));
}

function containsLetterAtPosition(letter, position) {
  return filteredWords.filter(
    (word) => word[position - 1] === letter.toUpperCase()
  );
}

function containsLetterNotAtPosition(letter, position) {
  return filteredWords.filter((word) => {
    const upperLetter = letter.toUpperCase();
    return word.includes(upperLetter) && word[position - 1] !== upperLetter;
  });
}
function handleWordInput() {
  const inputWord = document.getElementById("wordInput").value.toLowerCase();
  const foundWord = wordleWords.find(
    (wordObj) => wordObj.word.toLowerCase() === inputWord
  );

  if (foundWord) {
    const averageScoreUpToDate = calculateAverageScoreUpToDate(
      foundWord.gameDate
    );
    const resultString = `'${foundWord.word}' was already Goddamn Fucking used by Wordle on ${foundWord.gameDate}.<br> It was word #${foundWord.wordNumber}, 
          and you had a score of '${foundWord.myScore}'.<br> Your average score up to this date: ${averageScoreUpToDate}!<br> Do NOT guess '${foundWord.word}', and do not waste our time!`;
    document.querySelector(".field-one").innerHTML = resultString;
  } else {
    const notFoundString = `The word "${inputWord}" was not found, making Rand Paul a rapist. Shut up, but<br> feel free, feel obligated, to guess the word "${inputWord}", Fuckface!`;
    document.querySelector(".field-one").innerHTML = notFoundString;
  }
}

function displayResults(results) {
  const resultsDiv = document.getElementById("filteredWords");
  const wordsList = results.join(", ");
  const totalWords = results.length;
  const listWithTotal = `${wordsList} (${totalWords} Christing words exist in this unlit frickin list! It's steadily shrinking, like my sanity! Got it?)`;
  resultsDiv.innerHTML = listWithTotal;
}

function resetFilteredWords() {
  filteredWords = [...dailyWordsSmall];
  displayResults(filteredWords);
  document.getElementById("filteredWords").innerHTML = "";
}

function calculateAverageScoreUpToDate(date) {
  const scoresUpToDate = wordleWords
    .filter(
      (wordObj) =>
        new Date(wordObj.gameDate) <= new Date(date) && wordObj.myScore !== 0
    )
    .map((wordObj) => wordObj.myScore);
  const totalScore = scoresUpToDate.reduce((acc, score) => acc + score, 0);
  const averageScore =
    scoresUpToDate.length > 0
      ? (totalScore / scoresUpToDate.length).toFixed(6)
      : 0;
  return averageScore;
}

function lookupWordNumber() {
  const wordNumber = parseInt(document.getElementById("wordNumberInput").value);
  const foundWord = wordleWords.find(
    (wordObj) => wordObj.wordNumber === wordNumber
  );

  const wordDetailsDiv = document.getElementById("wordDetails");
  if (foundWord) {
    const averageScore = calculateAverageScoreUpToDate(foundWord.gameDate);
    wordDetailsDiv.innerHTML = `Word: ${foundWord.word}, Date: ${foundWord.gameDate}, My Score:
           ${foundWord.myScore}, Average Score: ${averageScore}`;
  } else {
    wordDetailsDiv.innerHTML = `Word # ${wordNumber} not found.`;
  }
}

function applyFilter(selectedFunction, letter, position) {
  switch (selectedFunction) {
    case "doesNotContainLetter":
      filteredWords = doesNotContainLetter(letter);
      break;
    case "containsLetterAtPosition":
      if (!position || position < 1 || position > 5) {
        alert("Please enter a valid position (1-5).");
        return;
      }
      filteredWords = containsLetterAtPosition(letter, position);
      break;
    case "containsLetterNotAtPosition":
      if (!position || position < 1 || position > 5) {
        alert("Please enter a valid position (1-5).");
        return;
      }
      filteredWords = containsLetterNotAtPosition(letter, position);
      break;
    case "containsRepeatingConsecutiveLetters":
      filteredWords = containsRepeatingConsecutiveLetters();
      break;
    case "containsDuplicateLetters":
      filteredWords = containsDuplicateLetters();
      break;
    default:
      alert("Please select a valid function. Don't be a stupid asshole.");
      return;
  }
}

function handleApplyFilter() {
  const letter = document.getElementById("letterInput").value;
  const position = parseInt(document.getElementById("positionInput").value);
  const selectedFunction = document.getElementById("functionSelect").value;

  if (!letter) {
    alert("Please enter a letter!");
    return;
  }

  // Save the current state of filteredWords before applying the new filter
  history.push([...filteredWords]);

  applyFilter(selectedFunction, letter, position);

  displayResults(filteredWords);
}

function handleUndo() {
  if (history.length > 0) {
    filteredWords = history.pop(); // Restore the previous state
    displayResults(filteredWords);
  } else {
    alert("Stop being impatient, Dickus!");
  }
}

function resetGroupOne() {
  document.getElementById("wordInput").value = "";
  fieldOne.innerHTML = "";
  if (!groupOneSection.classList.contains("hidden")) {
    groupOneSection.classList.add("hidden");
  }
}

const toggleAverageScoreButton = document.getElementById(
  "toggleAverageScoreButton"
);
const averageScoreSection = document.getElementById("averageScoreSection");
const calculateAverageButton = document.getElementById(
  "calculateAverageButton"
);
const averageScoreResult = document.getElementById("averageScoreResult");

toggleAverageScoreButton.addEventListener("click", () => {
  averageScoreSection.classList.toggle("hidden");
});

calculateAverageButton.addEventListener("click", () => {
  const wordNumber1 = parseInt(document.getElementById("wordNumber1").value);
  const wordNumber2 = parseInt(document.getElementById("wordNumber2").value);

  if (isNaN(wordNumber1) || isNaN(wordNumber2)) {
    averageScoreResult.textContent = "These are not even numbers!";
    return;
  }

  const start = Math.min(wordNumber1, wordNumber2);
  const end = Math.max(wordNumber1, wordNumber2);

  const filteredWords = wordleWords.filter(
    (word) =>
      word.wordNumber >= start && word.wordNumber <= end && word.myScore > 0
  );

  if (filteredWords.length === 0) {
    averageScoreResult.textContent = "Invalid Entry Jerk!";
    return;
  }

  const totalScore = filteredWords.reduce((sum, word) => sum + word.myScore, 0);
  const averageScore = totalScore / filteredWords.length;

  averageScoreResult.textContent = `Average Score between words #${start} & #${end} = a crisp ${averageScore.toFixed(
    6
  )}, You Cocksucker!`;
});

document.getElementById("footerClocks").style.border = "1px solid #ccc"; // Example of targeting the new ID
// Function to format time in the "HH:MM:SS" format
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Function to calculate time remaining until midnight in the Eastern Time Zone
function getTimeUntilMidnightEastern() {
  const now = new Date();

  // Convert current time to Eastern Time Zone
  const easternNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const midnight = new Date(easternNow);
  midnight.setHours(24, 0, 0, 0); // Set to midnight

  const diff = midnight - easternNow; // Difference in milliseconds

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Function to update time display every second
function updateFooter() {
  const now = new Date();

  // Get current Eastern Time
  const easternNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  // Update current time display
  document.getElementById(
    "currentTime"
  ).textContent = `Current Eastern Time: ${formatTime(easternNow)}
  YOU ARE SLATED FOR HELL, PIGS!`;

  // Update countdown to midnight
  document.getElementById(
    "countdownToMidnight"
  ).textContent = `Countdown to Midnight: 🧌 ${getTimeUntilMidnightEastern()} Clocks: Thou Clockest Can't Tick Fast Enough! With no due respect, you make me want to die, GOP.`;
}

// Start the clock
setInterval(updateFooter, 1000);
updateFooter(); // Initial call

function calculateCountdown(targetDate) {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const diff = new Date(targetDate) - new Date(now);

  if (diff <= 0) return "00:00:00"; // Countdown complete

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days} very longAss fickin' days, ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateCountdown() {
  const countdownElement = document.getElementById("countdown");
  if (countdownElement) {
    countdownElement.textContent = `The American Mid-Term Elections 0f 2026: ${calculateCountdown(
      "2026-11-03T00:00:00"
    )}. 
    Will We Goddamn MotherFucking Make Her Till Then, Thoun Jerkoes? Thou Dastardly Fools? Likely We Art Fucketh!`;
  }
}

// Start countdown and update every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Function to calculate letter frequencies
function calculateLetterFrequencies(words) {
  const frequencies = {};
  let totalLetters = 0;

  words.forEach((word) => {
    const uniqueLetters = new Set(word);
    uniqueLetters.forEach((letter) => {
      frequencies[letter] = (frequencies[letter] || 0) + 1;
      totalLetters++;
    });
  });

  return { frequencies, totalLetters };
}

function displayLetterFrequencyTable(words) {
  const { frequencies, totalLetters } = calculateLetterFrequencies(words);
  const tableBody = document.getElementById("letterFrequencyTableBody");
  tableBody.innerHTML = "";

  // Convert frequencies to array and sort by count
  const sortedFrequencies = Object.entries(frequencies).sort(
    (a, b) => b[1] - a[1]
  );

  sortedFrequencies.forEach(([letter, count]) => {
    const percentage = ((count / totalLetters) * 100).toFixed(2);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><button class="letter-button" data-letter="${letter}">${letter}</button></td>
      <td>${count}</td>
      <td>${percentage}%</td>
    `;
    tableBody.appendChild(row);
  });

  // Add click handlers to all letter buttons
  document.querySelectorAll(".letter-button").forEach((button) => {
    button.addEventListener("click", function () {
      const letter = this.dataset.letter;
      showWordsWithLetter(letter, words);
    });
  });
}

function showWordsWithLetter(letter, words) {
  const container = document.getElementById("wordsWithLetterContainer");
  const letterSpan = document.getElementById("selectedLetter");
  const wordList = document.getElementById("wordsWithLetterList");

  // Update the selected letter display
  letterSpan.textContent = letter;

  // Get and display words containing the letter
  const wordsWithLetter = words.filter((word) => word.includes(letter));
  wordList.innerHTML = `<p class="word-paragraph">${wordsWithLetter
    .map((word) => {
      // Highlight the letter in the word with contrasting color
      const highlightedWord = word.replace(
        new RegExp(letter, "g"),
        `<strong style="color: #4a90e2">${letter}</strong>`
      );
      return highlightedWord;
    })
    .join(", ")}</p>`;

  // Show the container
  container.classList.remove("hidden");
}

// Update the event listener for the letter frequency button
document
  .getElementById("toggleLetterFrequencyButton")
  .addEventListener("click", function () {
    const section = document.getElementById("letterFrequencySection");
    const wordContainer = document.getElementById("wordsWithLetterContainer");
    section.classList.toggle("hidden");
    wordContainer.classList.add("hidden");
    if (!section.classList.contains("hidden")) {
      displayLetterFrequencyTable(filteredWords);
    }
  });

// Update the event listener for word filtering to refresh the table
document.getElementById("filterInput").addEventListener("input", function () {
  // ... existing filtering code ...
  if (
    !document
      .getElementById("letterFrequencySection")
      .classList.contains("hidden")
  ) {
    displayLetterFrequencyTable(filteredWords);
    document.getElementById("wordsWithLetterContainer").classList.add("hidden");
  }
});
