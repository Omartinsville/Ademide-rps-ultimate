const choices = ["rock", "paper", "scissors"];

let statsChart;
    // BEST OF 5 = first to 3 wins
    const WIN_SCORE = 3;
    let userScore = 0;
    let computerScore = 0;
    let gameOver = false;

    const userScoreEl = document.getElementById("userScore");
    const computerScoreEl = document.getElementById("computerScore");
    const resultEl = document.getElementById("result");
    const resetBtn = document.getElementById("resetBtn");
    const totalRoundsEl = document.getElementById("totalRounds");
const totalMatchesEl = document.getElementById("totalMatches");
const totalWinsEl = document.getElementById("totalWins");
const totalLossesEl = document.getElementById("totalLosses");
const totalTiesEl = document.getElementById("totalTies");

const rockCountEl = document.getElementById("rockCount");
const paperCountEl = document.getElementById("paperCount");
const scissorsCountEl = document.getElementById("scissorsCount");

const exportBtn = document.getElementById("exportBtn");
const clearDataBtn = document.getElementById("clearDataBtn");

    // Add click listeners to buttons
    document.querySelectorAll(".choices button").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!gameOver) playRound(btn.dataset.choice);
        });
    });

    resetBtn.addEventListener("click", resetGame);
    exportBtn.addEventListener("click", exportCSV);
    clearDataBtn.addEventListener("click", clearSavedData);
//------------------
//  PLAY ROUND
//------------------
    function playRound(userChoice) {
        const computerChoice =
            choices[Math.floor(Math.random() * choices.length)];

        let resultText = "";
        let resultClass = "";
        let result = "";
//  Tie
        if (userChoice === computerChoice) {
            resultText = "It's a Tie!";
            resultClass = "tie";
            result = "tie";
        }
//  User wins
        else if (
            (userChoice === "rock" && computerChoice === "scissors") ||
            (userChoice === "paper" && computerChoice === "rock") ||
            (userChoice === "scissors" && computerChoice === "paper")
        ) {
            resultText = "You win this round!";
            resultClass = "win";
            result = "win";
            userScore++;
        }
        // Computer wins

        else {
            resultText = "You lose this round!";
            resultClass = "lose";
            result = "lose";
            computerScore++;
        }

        updateUI(userChoice, computerChoice, resultText, resultClass);
        // SAVE ROUND DATA
        saveRoundData(
            userChoice,
            computerChoice,
            result
        );

        checkGameOver();
    }
// -----------------
//  UPDATE UI
// -----------------
    function updateUI(userChoice, computerChoice, resultText, resultClass) {
        userScoreEl.textContent = userScore;
        computerScoreEl.textContent = computerScore;

        resultEl.innerHTML = `
            You chose: <strong>${userChoice}</strong><br>
            Computer chose: <strong>${computerChoice}</strong><br>
            <span class="${resultClass}">${resultText}</span>
        `;
    }
    // -----------------
    // CHECK GAME OVER
    // -----------------

    function checkGameOver() {
        if (userScore === WIN_SCORE || computerScore === WIN_SCORE) {
            gameOver = true;

            const finalMsg =
                userScore > computerScore
                ? "You won the match!"
                : "Computer won the match!";

            resultEl.innerHTML += `<br><strong>${finalMsg}</strong>`;
            resetBtn.style.display = "inline-block";
        
    // disable buttons
    document.querySelectorAll(".choices button")
    .forEach(btn => {
        btn.disabled = true;
    });
    saveMatchData(finalMsg);
}
}
// ------------------------
// RESET GAME
// ------------------------

    function resetGame() {
        userScore = 0;
        computerScore = 0;
        gameOver = false;

        userScoreEl.textContent = 0;
        computerScoreEl.textContent = 0;

        resultEl.textContent = "Pick a move to start!";
        resetBtn.style.display = "none";

        // re-enable bbuttons
        document.querySelectorAll(".choices button")
        .forEach(btn => {
            btn.disabled =false;
        });
    }
    // ---------------
    // SAVE ROUND DATA
    // ---------------
    function saveRoundData(userChoice, computerChoice, result) {
        const roundData = {
            userChoice,
            computerChoice,
            result,
            userScore,
            computerScore,
            timestamp: new Date().toISOString()
                    };
                    //get existing data
            let history = 
            JSON.parse(localStorage.getItem("rpsHistory")) || [];

            // add new round
            history.push(roundData);

            // save back
            localStorage.setItem(
                "rpsHistory", 
                JSON.stringify(history)
            );
            console.log("Saved Round: ", roundData);
            updateDashboard();
                }
            // ---------------
            // SAVE MATCH DATA
            // ---------------
    function saveMatchData(finalResult) {
            const matchData = {
                finalResult,
                finalUserScore: userScore,
                finalComputerScore: computerScore,
                timestamp: new Date().toISOString()
            };

            let matches  =
                JSON.parse(localStorage.getItem("rpsMatches")) || [];
            
                matches.push(matchData);

                localStorage.setItem(
                    "rpsMatches",
                    JSON.stringify(matches)
                );
                console.log("Saved Match: ", matchData);
                updateDashboard();
                updateMatchHistory();
        }
    function updateDashboard() {

    const history =
        JSON.parse(localStorage.getItem("rpsHistory")) || [];

    const matches =
        JSON.parse(localStorage.getItem("rpsMatches")) || [];

    // --------------------
    // DOM ELEMENTS
    // --------------------

    const badgeEl =
        document.getElementById("badge");

    const winRateEl =
        document.getElementById("winRate");

    const winStreakEl =
        document.getElementById("winStreak");

    const recentMatchEl =
        document.getElementById("recentMatch");

    const favoriteMoveEl =
        document.getElementById("favoriteMove");

    // --------------------
    // MOST RECENT MATCH
    // --------------------

    if (matches.length > 0) {

        const latestMatch =
            matches[matches.length - 1];

        recentMatchEl.textContent =
            `${latestMatch.finalResult}
            (${latestMatch.finalUserScore} -
            ${latestMatch.finalComputerScore})`;

    } else {

        recentMatchEl.textContent = "None";
    }

    // --------------------
    // BASIC TOTALS
    // --------------------

    totalRoundsEl.textContent = history.length;
    totalMatchesEl.textContent = matches.length;

    let wins = 0;
    let losses = 0;
    let ties = 0;

    let rockCount = 0;
    let paperCount = 0;
    let scissorsCount = 0;

    // --------------------
    // WIN STREAK
    // --------------------

    let currentStreak = 0;
    let longestStreak = 0;

    // --------------------
    // PROCESS HISTORY
    // --------------------

    history.forEach(round => {

        // WIN / LOSS / TIE

        if (round.result === "win") {

            wins++;

            currentStreak++;

            if (currentStreak > longestStreak) {

                longestStreak = currentStreak;
            }

        }

        else if (round.result === "lose") {

            losses++;

            currentStreak = 0;
        }

        else {

            ties++;

            currentStreak = 0;
        }

        // MOVE COUNTS

        if (round.userChoice === "rock") {

            rockCount++;
        }

        else if (round.userChoice === "paper") {

            paperCount++;
        }

        else if (round.userChoice === "scissors") {

            scissorsCount++;
        }
    });

    // --------------------
    // WIN STREAK DISPLAY
    // --------------------

    winStreakEl.textContent = longestStreak;

    // --------------------
    // FAVORITE MOVE
    // --------------------

    let favoriteMove = "Rock";

    const maxMove = Math.max(
        rockCount,
        paperCount,
        scissorsCount
    );

    if (maxMove === paperCount) {

        favoriteMove = "Paper";
    }

    if (maxMove === scissorsCount) {

        favoriteMove = "Scissors";
    }

    favoriteMoveEl.textContent = favoriteMove;

    // --------------------
    // WIN RATE
    // --------------------

    const totalPlayed =
        wins + losses + ties;

    const winRate =
        totalPlayed > 0
        ? ((wins / totalPlayed) * 100).toFixed(1)
        : 0;

    winRateEl.textContent =
        `${winRate}%`;

    // --------------------
    // BADGES
    // --------------------

    let badge = "Rookie Player";

    if (wins >= 200) {

        badge = "Legendary Champion 🏆";
    }

    else if (wins >= 100) {

        badge = "Pro Player 🎮";
    }

    else if (wins >= 50) {

        badge = "Rising Star ⭐";
    }

    else if (wins >= 10) {

        badge = "Getting Started 👍";
    }

    badgeEl.textContent = badge;

    // --------------------
    // UPDATE UI TOTALS
    // --------------------

    totalWinsEl.textContent = wins;

    totalLossesEl.textContent = losses;

    totalTiesEl.textContent = ties;

    rockCountEl.textContent = rockCount;

    paperCountEl.textContent = paperCount;

    scissorsCountEl.textContent = scissorsCount;

    // --------------------
    // UPDATE CHART
    // --------------------

    renderChart(
        wins,
        losses,
        ties
    );

    // --------------------
    // UPDATE MATCH HISTORY
    // --------------------

    updateMatchHistory();
}
    //--------------------
    // UPDATE MATCH HISTORY
    // --------------------
    function updateMatchHistory() {
    const matches =
        JSON.parse(localStorage.getItem("rpsMatches")) || [];

    const tbody =
        document.querySelector("#historyTable tbody");

    tbody.innerHTML = "";

    matches.forEach(match => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                ${new Date(match.timestamp)
                    .toLocaleString()}
            </td>

            <td>${match.finalResult}</td>

            <td>
                ${match.finalUserScore} -
                ${match.finalComputerScore}
            </td>
        `;

        tbody.appendChild(row);
    });
}
    // --------------------
    // EXPORT CSV
    // -------------------
    function exportCSV() {
        const history = JSON.parse(localStorage.getItem("rpsHistory")) || [];
        if (history.length === 0) {
            alert("No data to export!");
            return;
        }
        let csv = "userChoice,computerChoice,result,userScore,computerScore,timestamp\n";
        history.forEach(round => {
            csv +=
            `${round.userChoice},` +
            `${round.computerChoice},` +
            `${round.result},` +
            `${round.userScore},` +
            `${round.computerScore},` +
            `${round.timestamp}\n`
        });
        const blob = new Blob([csv], {
            type: "text/csv"
        });
        const url = URL.createObjectURL(blob);
        const a =document.createElement("a");

        a.href = url;
        a.download = "rps_dataset.csv";
        a.click();
        URL.revokeObjectURL(url);
    }
    // --------------
    // CLEAR SAVED DATA
    // ---------------
    function clearSavedData() {
        localStorage.removeItem("rpsHistory");
        localStorage.removeItem("rpsMatches");
        updateDashboard();
        alert("Saved Data Cleared!");
    }     
    updateDashboard();

    // --------------------------
    // MEMORY SLIDESHOW
    // --------------------------
    const slides = [
    {
        image: "images/photo1.jpg",
        caption: "Childhood memories together"
    },
    {
        image: "images/photo2.jpg",
        caption: "Endless Rock Paper Scissors battles"
    },
    {
        image: "images/photo3.jpg",
        caption: "Happy Birthday Champion"
    }
];

let currentSlide = 0;

const slideImage = document.getElementById("slideImage");
const slideCaption = document.getElementById("slideCaption");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showSlide(index) {
    slideImage.src = slides[index].image;
    slideCaption.textContent = slides[index].caption;
}

nextBtn.addEventListener("click", () => {
    currentSlide++;
    if (currentSlide >= slides.length) currentSlide = 0;
    showSlide(currentSlide);
});

prevBtn.addEventListener("click", () => {
    currentSlide--;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    showSlide(currentSlide);
});
slideImage.onerror = () => {
    slideImage.src = "images/fallback.jpg";
};
setInterval(() => {
    currentSlide++;
    if (currentSlide >= slides.length) currentSlide = 0;
    showSlide(currentSlide);
}, 4000);

function renderChart(wins, losses, ties) {

    const ctx =
        document.getElementById("statsChart");

    if (!ctx) return;

    if (statsChart) {
        statsChart.destroy();
    }

    statsChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "Wins",
                "Losses",
                "Ties"
            ],

            datasets: [{
                data: [
                    wins,
                    losses,
                    ties
                ],

                backgroundColor: [
                    "#4caf50",
                    "#f44336",
                    "#ff9800"
                ]
            }]
        },

        options: {
            responsive: true
        }
    });
}
// initial load
showSlide(currentSlide);
updateDashboard();
