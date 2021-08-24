var suits = ["Spades ♠️", "Hearts ♥️", "Diamonds ♦️", "Clubs ♣️"];

var gameMode = "input num of players";
var aIHand = [];
var playerList = [];
var numOfPlayer = 0;
var playerID = 0;
var aIScore = 0;
var turnNumber = 0;
var blackJackTops = 21;


var main = function(input) {
    var shuffledDeck = shuffleCards(deckCreator());

    if (gameMode == "input num of players") {
        numOfPlayer = Number(input);
        if (isNaN(numOfPlayer) || numOfPlayer == "") {
            return `Enter a valid number!`;
        }
        for (i = 0; i < numOfPlayer; i++) {
            playerList[i] = {
                id: i + 1,
                profile: {
                    score: 0,
                    bet: 0,
                    chips: 100,
                    bjState: 0,
                    BustState: 0,
                    turnDone: 0,
                    playerChoice: "stand",
                },
                hand: [],
            };
        }
        gameMode = "betting mode";
        return `We have ${numOfPlayer} players.<br>Hi Player 1, please enter the your amount of your bet.`;
    }

    if (gameMode == "betting mode") {
        while (playerID < numOfPlayer) {
            playerList[playerID].profile.bet = Number(input);
            if (isNaN(playerList[playerID].profile.bet) || input == "") {
                return `Error! Player ${playerID + 1}, please enter a number!`;
            }
            if (
                playerList[playerID].profile.bet > playerList[playerID].profile.chips
            ) {
                return `Insufficent chips Player ${playerID + 1}! Current chips: ${
          playerList[playerID].profile.chips
        }`;
            }
            var betMessage = `Player ${playerID + 1}! You bet ${
        playerList[playerID].profile.bet
      } chips. Current chips left is: ${
        playerList[playerID].profile.chips
      }<br>Enter bet for the next player`;
            playerID += 1;
            return betMessage;
        }
        gameMode = "drawCards";
        return `Hit Enter to cut the deck!`;
    }

    if (gameMode == "drawCards") {
        initializeHand(shuffledDeck);

        aIScore = addScore(aIHand);
        counter = 0;
        while (counter < numOfPlayer) {
            playerList[counter].profile.score = addScore(playerList[counter].hand);
            counter += 1;
        }

        gameMode = "gameMode";

        var blackJackMessage = blackJack();

        return `Hands Initialized.<br><br>${blackJackMessage}<br><br>Hit Enter to continue.`;
    }

    if (gameMode == "gameMode") {
        while (turnNumber < numOfPlayer) {
            if (playerList[turnNumber].profile.turnDone == 0) {
                gameMode = "gameMode2";
                return `Player ${turnNumber + 1} drew:<br>${cardPrinter(
          playerList[turnNumber].hand
        )}hit or stand<br>Current Score: ${
          playerList[turnNumber].profile.score
        }`;
            }
            turnNumber += 1;

            return `Player ${turnNumber + 1}'s turn done.`;
        }

        while (aIScore < 16) {
            aIHand.push(shuffledDeck.pop());
            aIScore = addScore(aIHand);
        }
        if (aIScore > blackJackTops) {
            for (i = 0; i < numOfPlayer; i++) {
                if (
                    playerList[i].profile.BustState == 0 &&
                    playerList[i].profile.bjState == 0
                ) {
                    playerList[i].profile.chips += playerList[i].profile.bet;
                }
            }
            var comBustMessage = `Computer Bust! Computer drew:<br> ${cardPrinter(
        aIHand
      )}<br> Players that survived wins their bet! Player 1, please enter bet to start new game`;
            resetState();
            return comBustMessage;
        }
        gameMode = "judge";
    }
    if (gameMode == "gameMode2") {
        while (turnNumber < numOfPlayer) {
            playerList[turnNumber].playerChoice = input.toString();

            if (playerList[turnNumber].playerChoice == "hit") {
                playerList[turnNumber].hand.push(shuffledDeck.pop());
                playerList[turnNumber].profile.score = addScore(
                    playerList[turnNumber].hand
                );
                if (playerList[turnNumber].profile.score > blackJackTops) {
                    playerList[turnNumber].profile.turnDone = 1;
                    playerList[turnNumber].profile.BustState = 1;

                    var BustMessage = `Player ${
            turnNumber + 1
          } Bust!<br>You drew:<br>${cardPrinter(
            playerList[turnNumber].hand
          )} Hit Enter for the next player!`;
                    turnNumber += 1;
                    gameMode = "gameMode";
                    return BustMessage;
                } else {
                    var hitMessage = `Hi Player ${
            turnNumber + 1
          }, you drew:<br>${cardPrinter(
            playerList[turnNumber].hand
          )}Hit or stand<br>Current Score: ${
            playerList[turnNumber].profile.score
          }`;
                    return hitMessage;
                }
            } else if (playerList[turnNumber].playerChoice == "stand") {
                playerList[turnNumber].profile.turnDone = 1;
                gameMode = "gameMode";
                var standMessage = `Player ${
          turnNumber + 1
        }'s turn done, Hit Enter for next player.`;
                turnNumber += 1;
                return standMessage;
            } else {
                return `Please choose to hit or stand to continue. Current Score: ${playerList[turnNumber].profile.score}`;
            }
        }
    }
    if (gameMode == "judge") {
        var resultMessage = `Computer has a score of ${aIScore}<br><br>Computer drew:<br>`;
        resultMessage += `${cardPrinter(aIHand)}<br>`;

        i = 0;
        while (i < numOfPlayer) {
            if (
                playerList[i].profile.BustState == 0 &&
                playerList[i].profile.bjState == 0
            ) {
                winner = compareScore(playerList[i].profile.score, aIScore);
                if (winner == "player") {
                    playerList[i].profile.chips += playerList[i].profile.bet;
                    resultMessage += `Player ${i + 1} wins Computer with score of ${
            playerList[i].profile.score
          } versus ${aIScore}<br>Current Chips: ${
            playerList[i].profile.chips
          }<br><br>`;
                }
                if (winner == "com") {
                    playerList[i].profile.chips -= playerList[i].profile.bet;
                    resultMessage += `Player ${i + 1} lost to Computer with score of ${
            playerList[i].profile.score
          } versus ${aIScore}<br>Current Chips: ${
            playerList[i].profile.chips
          }<br><br>`;
                }
                if (winner == "draw") {
                    resultMessage += `Player ${i + 1} draws with Computer with score of ${
            playerList[i].profile.score
          } versus ${aIScore}<br>Current Chips: ${
            playerList[i].profile.chips
          }<br><br>`;
                }
            }
            if (playerList[i].profile.BustState == 1) {
                playerList[i].profile.chips -= playerList[i].profile.bet;
                resultMessage += `Player ${i + 1} Bust with score of ${
          playerList[i].profile.score
        }<br>Current Chips: ${playerList[i].profile.chips}<br><br>`;
            }
            if (playerList[i].profile.bjState == 1) {
                resultMessage += `Player ${
          i + 1
        } has obtained BlackJack!<br>Current Chips: ${
          playerList[i].profile.chips
        }<br><br>`;
            }
            i += 1;
        }
        resetState();
        if (chipsChecker(playerList)) {
            for (i = 0; i < numOfPlayer; i++) {
                if (playerList[i].profile.chips <= 0)
                    resultMessage += `<br>Player ${i + 1} has 0 chips left! Game Over!`;
            }
            gameMode = "end frame";
        } else {
            resultMessage += `<br>Player 1 please enter bet to continue.`;
        }
        return `${resultMessage}`;
    }
    if (gameMode == "end frame") {
        return `Game has ended! Please refresh the page to play again!`;
    }
    if (input == "refresh") {
        return (gameMode = "input num of players");
    }
};

function chipsChecker(list) {
    for (i = 0; i < numOfPlayer; i++) {
        if (list[i].profile.chips <= 0) {
            return true;
        }
    }
}

function resetState() {
    for (i = 0; i < numOfPlayer; i++) {
        playerList[i].hand = [];
        playerList[i].profile.score = 0;
        playerList[i].profile.turnDone = 0;
        playerList[i].profile.BustState = 0;
        playerList[i].profile.playerChoice = "stand";
    }
    turnNumber = 0;
    playerID = 0;
    aIHand = [];
    gameMode = "betting mode";
}

function cardPrinter(list) {
    message = "";
    for (i = 0; i < list.length; i++) {
        message += `${list[i].name} of ${list[i].suit}<br>`;
    }
    return message;
}

function addScore(hand) {
    var score = 0;
    var numberOfAce = 0;

    for (i = 0; i < hand.length; i++) {
        if (hand[i].rank == 1) {
            numberOfAce += 1;
        }
        if (hand[i].rank > 10) {
            score += 10;
        } else {
            score = score + hand[i].rank;
        }
    }
    for (i = 0; i < numberOfAce; i++) {
        if (score + 10 <= blackJackTops) {
            score += 10;
        }
    }
    return score;
}

function compareScore(player, com) {
    if (player > com) {
        return `player`;
    } else if (com > player) {
        return `com`;
    } else {
        return `draw`;
    }
}

function blackJack() {
    var message = "";
    if (aIScore != blackJackTops) {
        message += `Computer no BlackJack!<br><br>`;
        for (i = 0; i < numOfPlayer; i++) {
            if (playerList[i].profile.score != blackJackTops) {
                message += `Player ${i + 1} no BlackJack!<br><br>`;
            }
        }
    }
    if (aIScore == blackJackTops) {
        message += `Computer BlackJack!<br>Hit Enter to play again!`;
        for (i = 0; i < numOfPlayer; i++) {
            if (playerList[i].profile.score != blackJackTops) {
                playerList[i].profile.chips -= playerList[i].profile.bet * 2;
            }
            if (playerList[i].profile.score == blackJackTops) {
                message += `Player ${i + 1} BlackJack!<br>`;
            }
        }
        resetState();
        if (chipsChecker(playerList)) {
            for (i = 0; i < numOfPlayer; i++) {
                if (playerList[i].profile.chips <= 0)
                    message += `<br>Player ${i + 1} has 0 chips left! Game Over!`;
            }
            gameMode = "end frame";
        }
        return `${message}`;
    } else {
        for (i = 0; i < numOfPlayer; i++) {
            if (playerList[i].profile.score == blackJackTops) {
                message += `Player ${i + 1} BlackJack!<br>`;
                playerList[i].profile.bjState = 1;
                playerList[i].profile.turnDone = 1;
                playerList[i].profile.chips += playerList[i].profile.bet * 2;
            }
        }
    }
    return `${message}`;
}

function initializeHand(shuffledDeck) {
    for (i = 0; i < numOfPlayer; i++) {
        playerList[i].hand.push(shuffledDeck.pop());
        playerList[i].hand.push(shuffledDeck.pop());
    }
    for (i = 0; i < 2; i++) {
        aIHand[i] = shuffledDeck.pop();
    }
}

var getRandomNumber = function(max) {
    return Math.floor(Math.random() * max);
};

function shuffleCards(cardDeck) {
    var currentIndex = 0;
    while (currentIndex < cardDeck.length) {
        var randomIndex = getRandomNumber(cardDeck.length);

        var randomCard = cardDeck[randomIndex];

        var currentCard = cardDeck[currentIndex];

        cardDeck[currentIndex] = randomCard;
        cardDeck[randomIndex] = currentCard;

        currentIndex = currentIndex + 1;
    }

    return cardDeck;
}

function deckCreator() {
    var cardDeck = [];
    var suitIndex = 0;
    while (suitIndex < suits.length) {
        var currentSuit = suits[suitIndex];
        var rankCounter = 1;
        while (rankCounter <= 13) {
            var cardName = rankCounter;
            if (cardName == 1) {
                cardName = "A";
            } else if (cardName == 11) {
                cardName = "J";
            } else if (cardName == 12) {
                cardName = "Q";
            } else if (cardName == 13) {
                cardName = "K";
            }
            var card = {
                name: cardName,
                suit: currentSuit,
                rank: rankCounter,
            };
            cardDeck.push(card);
            rankCounter += 1;
        }
        suitIndex += 1;
    }
    return cardDeck;
}
