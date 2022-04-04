$(function() // Set up reset button and then start game
{    
    $('#redo').on('click',function(){
        startGame();
    });

    startGame();
});

function startGame(dealerCards,playerCards,playerTotal,dealerTotal){
    var dealerCards = []; // Storage for currently held cards
    var playerCards = [];
    var playerTotal = 0; // Temporary point storage
    var dealerTotal = 0;
    var end = 0; // End "bool"
    var x = 0; // Player card counter
    var y = 0; // Dealer card counter

    document.getElementById('information').innerHTML = '<p>Would you like to draw another card?</p>'
    playerCards[x] = (getCard(playerCards,dealerCards)); // Give player first card
    x += 1

    layCards(playerCards,dealerCards); // Display the card
    playerTotal = countCards(playerCards); // Get point total
    displayTotal(playerTotal,dealerTotal);

    $('#draw').on('click',function(){ // Set up draw button
        if (end == 0){ // If the game is not ended draw a valid card, display it, calculate new total, display total
            playerCards[x] = getCard(playerCards,dealerCards);
            layCards(playerCards,dealerCards);
            x += 1;
            
            playerTotal = countCards(playerCards);
            displayTotal(playerTotal,dealerTotal);
            if (playerTotal > 21){ // If total is too high, end game
                document.getElementById('information').innerHTML = '<p>You have lost due to going over 21. Press restart to play again.</p>';
                end = 1;
            }
            else if (playerTotal == 21){ // If total is 21, then player automatically wins
                document.getElementById('information').innerHTML = '<p>You have won due to reaching 21. Press restart to play again.</p>';
                end = 1;
            }
        }
    });

    $('#deal').on('click',function(){ // Set up computer draws
        if (end == 0){
            while (true){
                if (dealerTotal > playerTotal && dealerTotal <= 21){ // If the dealer's total is greater than the players and less than 21, end game
                    document.getElementById('information').innerHTML = '<p>Dealer has won. Press restart to play again.</p>';
                    end = 1;
                    break
                }
                else if (dealerTotal < 21){ // Otherwise keep drawing cards while below 21
                    dealerCards[y] = (getCard(playerCards,dealerCards));
                    layCards(playerCards,dealerCards);
                    y += 1;
                    dealerTotal = countCards(dealerCards);
                    displayTotal(playerTotal,dealerTotal);
                }
                else { // If dealer is over 21, the player wins
                    document.getElementById('information').innerHTML = '<p>You have won. Press restart to play again.</p>';
                    end = 1;
                    break
                }
            }
        }
    });
}

function getCard(playerCards,dealerCards){ // Function to draw a card. All cards are trated as a value from 1-52, details in checkNumber() and checkLetter()
    var number = 0
    
    while (number == 0){
        number = Math.floor(Math.random() * 52) + 1; // Get a random number between 1 and 52
        if (playerCards.includes(number) || dealerCards.includes(number)){ // If either deck contains this card, reset the number
            number = 0;
        }
    }
    return number // Returns the number to be added to the relevent hand
}

function layCards(playerCards,dealerCards){ // Function to display cards
    document.getElementById('player').innerHTML = ''; // Reset displays
    document.getElementById('dealer').innerHTML = '';

    for (i in playerCards){ // For each card in the player's deck
        card = checkNumber(playerCards[i]); // Get the number
        card += checkLetter(playerCards[i]); // Get the suit
        document.getElementById('player').innerHTML += '<img src="../media/' + card + '.png" alt=" "/>'; // Display the relevent png from this data
    }

    for (i in dealerCards){ // And repeat for dealer
        card = checkNumber(dealerCards[i])
        card += checkLetter(dealerCards[i])
        document.getElementById('dealer').innerHTML += '<img src="../media/' + card + '.png" alt=" "/>'
    }
}

function countCards(cards){ // Function to calculate totals, receives card list from either deck when needed
    var ace = 0 // variable for marking how many aces there are
    var subtotal = 0 // Storage for calculations
    for (i in cards){ // For each received card
        j = cards[i]%13 // Do modular division to get the card number
        if (j == 1){ // If it's a one(ace), make a note and increase the subtotal by 11
            ace += 1
            subtotal += 11
        }
        else if (j == 11 || j == 12 || j == 0){ // If it's an 11(jack), 12(queen), or 0(king) add 10
            subtotal += 10
        }
        else{ // Otherwise just treat as number
            subtotal += j
        }
    }
    while (true){
        if (subtotal > 21 && ace > 0){ // If the subtotal is too high while there are aces acting as 11s, remove 10 points and treat an ace as a 1
            subtotal -= 10;
            ace -= 1;
        }
        else { return subtotal } // When done return the total
    }    
}


function displayTotal(playerTotal,dealerTotal){ // Function to display the totals calculated
    document.getElementById('dTot').innerHTML = '<p>DEALER POINTS:' + dealerTotal + '</p>'
    document.getElementById('pTot').innerHTML = '<p>PLAYER POINTS:' + playerTotal + '</p>'
}

function checkNumber(i){ // Function to figure out what number the card is using modular division. All numbers act as their full name counterparts except 0, which is king
    if (i%13 == 1){
        return 'ace'
    }
    if (i%13 == 2){
        return 'two'
    }
    if (i%13 == 3){
        return 'three'
    }
    if (i%13 == 4){
        return 'four'
    }
    if (i%13 == 5){
        return 'five'
    }
    if (i%13 == 6){
        return 'six'
    }
    if (i%13 == 7){
        return 'seven'
    }
    if (i%13 == 8){
        return 'eight'
    }
    if (i%13 == 9){
        return 'nine'
    }
    if (i%13 == 10){
        return 'ten'
    }
    if (i%13 == 11){
        return 'jack'
    }
    if (i%13 == 12){
        return 'queen'
    }
    if (i%13 == 0){
        return 'king'
    }
}

function checkLetter(i){ // Do floor division to figure out which suit the card is.
    if (Math.floor( i/13 ) == 0){
        return 'C'
    }
    if (Math.floor( i/13 ) == 1){
        return 'D'
    }
    if (Math.floor( i/13 ) == 2){
        return 'H'
    }
    if (Math.floor( i/13 ) == 3){
        return 'S'
    }
    else {
        return 'C' // For king of clubs since 52 would actually return 4
    }
}