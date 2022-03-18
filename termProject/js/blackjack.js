$(function()
{    
    $('#redo').on('click',function(){
        startGame();
    });
    
    startGame();
});

function startGame(dealerCards,playerCards,playerTotal,dealerTotal){
    var dealerCards = [];
    var playerCards = [];
    var playerTotal = 0;
    var dealerTotal = 0;
    var end = 0;
    var x = 0; // Player Counter
    var y = 0; // Dealer Counter
    document.getElementById('information').innerHTML = '<p>Would you like to draw another card?</p>'
    playerCards[x] = (getCard(playerCards,dealerCards));
    x += 1
    layCards(playerCards,dealerCards);
    playerTotal = countCards(playerCards);
    displayTotal(playerTotal,dealerTotal);

    $('#draw').on('click',function(){
        if (end == 0){
            playerCards[x] = getCard(playerCards,dealerCards);
            
            layCards(playerCards,dealerCards);
            x += 1;
            playerTotal = countCards(playerCards);
            displayTotal(playerTotal,dealerTotal);
            if (playerTotal > 21){
                document.getElementById('information').innerHTML = '<p>You have lost due to going over 21. Press restart to play again.</p>';
                end = 1;
            }
            else if (playerTotal == 21){
                document.getElementById('information').innerHTML = '<p>You have won due to reaching 21. Press restart to play again.</p>';
                end = 1;
            }
        }
    });
    $('#deal').on('click',function(){
        if (end == 0){
            while (true){
                if (dealerTotal > playerTotal && dealerTotal <= 21){
                    document.getElementById('information').innerHTML = '<p>Dealer has won. Press restart to play again.</p>';
                    end = 1;
                    break
                }
                else if (dealerTotal < 21){
                    dealerCards[y] = (getCard(playerCards,dealerCards));
                    layCards(playerCards,dealerCards);
                    y += 1;
                    dealerTotal = countCards(dealerCards);
                    displayTotal(playerTotal,dealerTotal);
                }
                else {
                    document.getElementById('information').innerHTML = '<p>You have won. Press restart to play again.</p>';
                    end = 1;
                    break
                }
            }
        }
    });
}

function getCard(playerCards,dealerCards){
    var number = 0
    
    while (number == 0){
        number = Math.floor(Math.random() * 52) + 1;
        if (playerCards.includes(number) || dealerCards.includes(number)){
            number = 0;
        }
    }
    return number
}

function layCards(playerCards,dealerCards){
    document.getElementById('player').innerHTML = '';
    document.getElementById('dealer').innerHTML = '';

    for (i in playerCards){
        card = checkNumber(playerCards[i]);
        card += checkLetter(playerCards[i]);
        document.getElementById('player').innerHTML += '<img src="media/' + card + '.png" alt=" "/>';
    }

    for (i in dealerCards){
        card = checkNumber(dealerCards[i])
        card += checkLetter(dealerCards[i])
        document.getElementById('dealer').innerHTML += '<img src="media/' + card + '.png" alt=" "/>'
    }
}

function countCards(cards){
    var ace = 0 // variable for marking how many aces there are
    var subtotal = 0
    for (i in cards){
        j = cards[i]%13
        if (j == 1){
            ace += 1
            subtotal += 11
        }
        else if (j == 11 || j == 12 || j == 0){
            subtotal += 10
        }
        else{
            subtotal += j
        }
    }
    while (true){
        if (subtotal > 21 && ace > 0){
            subtotal -= 10;
            ace -= 1;
        }
        else { return subtotal }
    }    
}


function displayTotal(playerTotal,dealerTotal){
    document.getElementById('dTot').innerHTML = '<p>DEALER POINTS:' + dealerTotal + '</p>'
    document.getElementById('pTot').innerHTML = '<p>PLAYER POINTS:' + playerTotal + '</p>'
}

function checkNumber(i){
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

function checkLetter(i){
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
        return 'C' // For king of clubs
    }
}