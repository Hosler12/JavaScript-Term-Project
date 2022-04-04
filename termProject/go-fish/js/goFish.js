$(function () {
    $('#redo').on('click', function () { // Set up reset
        startGame();
    });

    startGame(); // Start game
});

function startGame(opponentCards, playerCards, playerTotal, opponentTotal) {
    var opponentCards = []; // Storage for cards
    var playerCards = [];
    var allCards = []; // All cards is used since player cards and opponent cards are subject to vanishing cards as books are made
    var values = []; // Temporary storage for cards that are part of a book
    var opponentOptions = []; // Temporary storage for valid opponent options
    var playerTotal = 0; // Player points
    var opponentTotal = 0;
    var tempCounts = []; // Temporary storage for calculating books
    var end = 0; // Ending "bool"
    var t = 0; // Temporary counter, wipe as soon as done using
    var x = 0; // Player Counter
    var y = 0; // Opponent Counter
    var z = 0; // All cards counter. Should never decrease unless game is resetting
    var remaining = 52; // Cards remaining in deck

    document.getElementById('information').innerHTML = '<p>Select a card from the drop down, then click "do you have a" to ask!</p>' // Set info to initial

    for (i = 0; i < 7; i++) { // Give the player cards
        playerCards[x] = (getCard(allCards)); // Add card to hand
        allCards[z] = playerCards[x]; // Add card to used cards
        z += 1; // Increment counters
        x += 1;
        remaining -= 1;
    }

    for (i = 0; i < 7; i++) { // Give opponent a hand
        opponentCards[y] = (getCard(playerCards, opponentCards));
        allCards[z] = opponentCards[y];
        z += 1;
        y += 1;
        remaining -= 1;
    }

    values = countCards(playerCards); // Check for player books. Returns [cards, subtotal]
    if (values[1] > 0) { // If books were found
        playerCards = values[0]; // Replace hand with new hand
        playerTotal += values[1]; // Increase the player's score based on number of books found
        
        x -= 4 * values[1]; // Decrease player card incrementer based on cards used
    }

    values = countCards(opponentCards); // Check for opponent books
    if (values[1] > 0) {
        opponentCards = values[0];
        opponentCards += values[1];
        y -= 4 * values[1];
    }

    displayTotal(playerTotal, opponentTotal); // Update totals
    layCards(playerCards) // Display player cards
    buildPlayerOptions(playerCards); // Calculate player options

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

            for (i in opponentCards) { // Check opponent cards for the value
                if (opponentCards[i] % 13 == chosen) { // If the card is valid, add it to the list
                    answer[t] = opponentCards[i]
                    t += 1;
                }
            }
            t = 0
            if (answer.length > 0) { // If the cards exist, give them over to the player
                document.getElementById('response').innerHTML = '<p> I have ' + answer.length + ' of those. Here you go.</p>';
                for (i in answer) { // For each valid card, add it to the player and splice it out of the opponents
                    playerCards[x] = answer[i]
                    opponentCards.splice(opponentCards.indexOf(answer[i]), 1);
                    x += 1
                    y -= 1
                }
            }
            else { // If there is no valid card then the player draws a card
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
            end = checkEnd(playerCards, opponentCards, playerTotal, opponentTotal); // Check to see if any hands are empty, or if anyone has over half the possible points

            displayTotal(playerTotal, opponentTotal); // Update totals


            if (end == 0) { // If the fishing did not end the game, the opponent asks for a random card from their list
                opponentOptions = []
                tempCounts = cardCountsCalc(opponentCards) // Build opponent options list, returns a list of counts of each card number, with 0 being kings
                for (i in tempCounts) {
                    if (tempCounts[i] > 0) { // For each count that is greater than 1, add it to the valid question list
                        opponentOptions[t] = i;
                        t += 1
                    }
                }
                t = 0;

                input = opponentOptions[Math.floor(Math.random() * opponentOptions.length)] // Pick a random card from the list

                if (input == 0) { // Turn the number received into the word version as needed.
                    chosen = 'King';
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

                for (i in playerCards) { // Checks player cards for the value
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
                else { // Otherwise the opponent draws a card
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
                buildPlayerOptions(playerCards); // Build player options from remaining hand
            }
        }
    });
}

function buildPlayerOptions(playerCards) { // Function to build player options list
    var tempCounts = cardCountsCalc(playerCards) // Get counts of each card value
    var playerOptions = [];
    var t = 0;
    for (i in tempCounts) {
        if (tempCounts[i] > 0) {
            playerOptions[t] = i; // For each count that was above 0, add it to the options list
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

function checkEnd(playerCards, opponentCards, playerTotal, opponentTotal) { // Function to see if the game is done
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
    else if (playerTotal > 6) { // If player has over half the possible points they win
        document.getElementById('response').innerHTML += '<p>You have won the game</p>'
    }
    else if (opponentTotal > 6) { // If the opponent has over half the possible points they win
        document.getElementById('response').innerHTML += '<p>The opponent has won the game</p>'
    }
    else { return 0 }
}

function getCard(allCards) { // Function to get a random valid card from the deck
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
        card = checkNumber(playerCards[i]); // Get the value of the card
        card += checkLetter(playerCards[i]); // Get the suit of the card
        document.getElementById('player').innerHTML += '<img src="../media/' + card + '.png" alt=" "/>';
    }
}

function countCards(cards) { // Function to check for books
    var subtotal = 0; // temporary total for book count
    var remove = []; // temporary removal storage
    var z = 0; // Temporary counter for temporary hand
    var cardCounts = cardCountsCalc(cards); // Count how many of each card value is in the hand

    for (i in cardCounts) { // For each count over 4, incrememnt values and remove from temporary hand
        if (cardCounts[i] == 4) {
            subtotal += 1;
            for (c in cards) { // Check each card in hand for value. If the value is correct, add it to the removal storage
                if (cards[c] % 13 == i) {
                    remove[z] = cards[c];
                    z += 1;
                }
            }
        }
    }
    for (c in remove){ // Remove the cards within the storage from the temporary hand
        cards.splice(cards.indexOf(remove[c]), 1);
    }
    return [cards, subtotal]; // Return the temporary hand and the number of books found
}

function cardCountsCalc(cards) { // Function to count how many of each card value a hand has
    var cardCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // variable for recording counts, king is zero 

    for (i in cards) { // For each card in the hand, incrememnt the the counts record
        cardCounts[cards[i] % 13] += 1;
    }

    return cardCounts; // Returns counts list
}

function displayTotal(playerTotal, opponentTotal) { // Function to display the totals calculated
    document.getElementById('oTot').innerHTML = '<p>OPPONENT POINTS:' + opponentTotal + '</p>'
    document.getElementById('pTot').innerHTML = '<p>PLAYER POINTS:' + playerTotal + '</p>'
}

function checkNumber(i) { // Function to figure out what number the card is using modular division. All numbers act as their full name counterparts except 0, which is king
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

function checkLetter(i) { // Do floor division to figure out which suit the card is.
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