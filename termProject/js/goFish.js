$(function () {
    $('#redo').on('click', function () {
        startGame();
    });

    startGame();
});

function startGame(opponentCards, playerCards, playerTotal, opponentTotal) {
    var opponentCards = [];
    var playerCards = [];
    var allCards = [];
    var values = [];
    var opponentOptions = [];
    var playerTotal = 0;
    var opponentTotal = 0;
    var tempCounts = [];
    var end = 0;
    var t = 0; // Temporary counter, wipe as soon as done using
    var x = 0; // Player Counter
    var y = 0; // Opponent Counter
    var z = 0; // All cards Counter
    var remaining = 52;

    document.getElementById('information').innerHTML = '<p>Select a card from the drop down, then click "do you have a" to ask!</p>' // Set info to start info

    for (i = 0; i < 7; i++) { // Give the player cards
        playerCards[x] = (getCard(allCards));
        allCards[z] = playerCards[x]
        z += 1
        x += 1;
        remaining -= 1
    }

    for (i = 0; i < 7; i++) { // Give opponent a hand
        opponentCards[y] = (getCard(playerCards, opponentCards));
        allCards[z] = opponentCards[y]
        z += 1
        y += 1;
        remaining -= 1
    }

    values = countCards(playerCards); // Check for player books
    if (values[1] > 0) {
        playerCards = values[0];
        playerTotal += values[1];
        
        x -= 4 * values[1]
    }

    values = countCards(opponentCards); // Check for opponent books
    if (values[1] > 0) {
        opponentCards = values[0];
        opponentCards += values[1];
        y -= 4 * values[1]
    }

    displayTotal(playerTotal, opponentTotal); // Update totals
    layCards(playerCards)
    buildPlayerOptions(playerCards);

    $('#fish').on('click', function () {
        if (end == 0) {
            var input = '';
            var chosen = 0; // Storage for current selection
            var answer = []; // Temporary storage of valid fish
            input = document.getElementById('options').value; // Get the value and turn it into a number
            if (input == 'King') {
                chosen = 0;
            }
            else if (input == 'Ace') {
                chosen = 1;
            }
            else if (input == 'Jack') {
                chosen = 11;
            }
            else if (input == 'Queen') {
                chosen = 12;
            }
            else {
                chosen = parseInt(input)
            }

            for (i in opponentCards) {
                if (opponentCards[i] % 13 == chosen) {
                    answer[t] = opponentCards[i]
                    t += 1;
                }
            }
            t = 0
            if (answer.length > 0) { // If the cards exist, give them over to the player
                document.getElementById('response').innerHTML = '<p> I have ' + answer.length + ' of those. Here you go.</p>';
                for (i in answer) {
                    playerCards[x] = answer[i]
                    opponentCards.splice(opponentCards.indexOf(answer[i]), 1);
                    x += 1
                    y -= 1
                }
            }
            else {
                document.getElementById('response').innerHTML = '<p> Go fish. </p>';
                if (remaining > 0) {
                    playerCards[x] = (getCard(allCards));
                    allCards[z] = playerCards[x]
                    z += 1
                    x += 1;
                    remaining -= 1
                }
            }

            values = countCards(playerCards); // Check for player books
            if (values[1] > 0) {
                playerCards = values[0];
                playerTotal += values[1];
                
                x -= 4 * values[1]
            }
            
            layCards(playerCards);
            end = checkEnd(playerCards, opponentCards, playerTotal, opponentTotal);

            displayTotal(playerTotal, opponentTotal); // Update totals


            if (end == 0) { // If the fishing did not end the game, the opponent asks for a random card from their list
                opponentOptions = []
                tempCounts = cardCountsCalc(opponentCards) // Build opponent options list
                for (i in tempCounts) {
                    if (tempCounts[i] > 0) {
                        opponentOptions[t] = i;
                        t += 1
                    }
                }
                t = 0;

                input = opponentOptions[Math.floor(Math.random() * opponentOptions.length)]

                if (input == 0) {
                    chosen = 'king';
                }
                else if (input == 1) {
                    chosen = 'Ace';
                }
                else if (input == 11) {
                    chosen = 'Jack';
                }
                else if (input == 12) {
                    chosen = 'Queen';
                }
                else{
                    chosen = parseInt(input)
                }

                document.getElementById('response').innerHTML += '<p> Do you have a ' + chosen + '?';
                answer = [];

                for (i in playerCards) {
                    if (playerCards[i] % 13 == input) {
                        answer[t] = playerCards[i]
                        t += 1;
                    }
                }
                t = 0

                if (answer.length > 0) { // If the cards exist, give them over to the opponent
                    document.getElementById('response').innerHTML += 'You have ' + answer.length + ' of those. Thank you for giving them to me.</p>';
                    for (i in answer) {
                        opponentCards[y] = answer[i]
                        playerCards.splice(playerCards.indexOf(answer[i]), 1);
                        y += 1
                        x -= 1
                    }
                }
                else {
                    document.getElementById('response').innerHTML += ' I guess I\'ll draw then. </p>';
                    if (remaining > 0) {
                        opponentCards[y] = (getCard(allCards));
                        allCards[z] = opponentCards[y]
                        z += 1
                        y += 1;
                        remaining -= 1
                    }
                }

                values = countCards(opponentCards); // Check for opponent books
                if (values[1] > 0) {
                    opponentCards = values[0];
                    opponentTotal += values[1];
                    
                    y -= 4 * values[1]
                }

                layCards(playerCards);
                end = checkEnd(playerCards, opponentCards, playerTotal, opponentTotal);

                displayTotal(playerTotal, opponentTotal);
                buildPlayerOptions(playerCards);
            }
        }
    });
}

function buildPlayerOptions(playerCards) {
    var tempCounts = cardCountsCalc(playerCards) // Build player options list
    var playerOptions = [];
    var t = 0;
    for (i in tempCounts) {
        if (tempCounts[i] > 0) {
            playerOptions[t] = i;
            t += 1
        }
    }
    t = 0;

    document.getElementById('options').innerHTML = '<select>'; // Put options in drop down
    for (i in playerOptions) {
        if (playerOptions[i] == 0) {
            document.getElementById('options').innerHTML += '<option>King</option>'
        }
        else if (playerOptions[i] == 1) {
            document.getElementById('options').innerHTML += '<option>Ace</option>'
        }
        else if (playerOptions[i] == 11) {
            document.getElementById('options').innerHTML += '<option>Jack</option>'
        }
        else if (playerOptions[i] == 12) {
            document.getElementById('options').innerHTML += '<option>Queen</option>'
        }
        else {
            document.getElementById('options').innerHTML += '<option>' + playerOptions[i] + '</option>'
        }
    }
    document.getElementById('options').innerHTML += '</select>';
}

function checkEnd(playerCards, opponentCards, playerTotal, opponentTotal) {
    if (playerCards.length == 0 || opponentCards.length == 0) { // If a hand runs out compare scores
        if (playerTotal > opponentTotal) {
            document.getElementById('response').innerHTML += '<p>You have won the game.</p>'
        }
        else if (opponentTotal < playerTotal) {
            document.getElementById('response').innerHTML += '<p>The opponent has won the game.</p>'
        }
        else {
            document.getElementById('response').innerHTML += '<p>You and the opponent have tied.</p>'
        }
        return 1;
    }
    else if (playerTotal > 6) { // If player has over half the possible points
        document.getElementById('response').innerHTML += '<p>You have won the game</p>'
    }
    else if (opponentTotal > 6) { // If the opponent has over half the possible points
        document.getElementById('response').innerHTML += '<p>The opponent has won the game</p>'
    }
    else { return 0 }
}

function getCard(allCards) {
    var number = 0

    while (number == 0) { // Get a random card, then see if it's in either hand
        number = Math.floor(Math.random() * 52) + 1;
        if (allCards.includes(number)) {
            number = 0;
        }
    }
    return number
}

function layCards(playerCards) { // Display the cards
    document.getElementById('player').innerHTML = '';
    for (i in playerCards) {
        card = checkNumber(playerCards[i]);
        card += checkLetter(playerCards[i]);
        document.getElementById('player').innerHTML += '<img src="media/' + card + '.png" alt=" "/>';
    }
}

function countCards(cards) {
    var subtotal = 0;
    var remove = []; // temporary removal storage
    var z = 0;
    var cardCounts = cardCountsCalc(cards);

    for (i in cardCounts) {
        if (cardCounts[i] == 4) {
            subtotal += 1;
            for (c in cards) {
                if (cards[c] % 13 == i) {
                    remove[z] = cards[c];
                    z += 1;
                }
            }
        }
    }
    for (c in remove){
        cards.splice(cards.indexOf(remove[c]), 1);
    }
    return [cards, subtotal];
}

function cardCountsCalc(cards) {
    var cardCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // variable for recording counts, king is zero 

    for (i in cards) {
        cardCounts[cards[i] % 13] += 1;
    }

    return cardCounts;
}

function displayTotal(playerTotal, opponentTotal) {
    document.getElementById('oTot').innerHTML = '<p>OPPONENT POINTS:' + opponentTotal + '</p>'
    document.getElementById('pTot').innerHTML = '<p>PLAYER POINTS:' + playerTotal + '</p>'
}

function checkNumber(i) {
    if (i % 13 == 1) {
        return 'ace'
    }
    if (i % 13 == 2) {
        return 'two'
    }
    if (i % 13 == 3) {
        return 'three'
    }
    if (i % 13 == 4) {
        return 'four'
    }
    if (i % 13 == 5) {
        return 'five'
    }
    if (i % 13 == 6) {
        return 'six'
    }
    if (i % 13 == 7) {
        return 'seven'
    }
    if (i % 13 == 8) {
        return 'eight'
    }
    if (i % 13 == 9) {
        return 'nine'
    }
    if (i % 13 == 10) {
        return 'ten'
    }
    if (i % 13 == 11) {
        return 'jack'
    }
    if (i % 13 == 12) {
        return 'queen'
    }
    if (i % 13 == 0) {
        return 'king'
    }
}

function checkLetter(i) {
    if (Math.floor(i / 13) == 0) {
        return 'C'
    }
    if (Math.floor(i / 13) == 1) {
        return 'D'
    }
    if (Math.floor(i / 13) == 2) {
        return 'H'
    }
    if (Math.floor(i / 13) == 3) {
        return 'S'
    }
    else {
        return 'C' // For king of clubs
    }
}