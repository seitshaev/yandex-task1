'use strict';
//Base class
var Card = function (obj) {
    this.from = obj.from;
    this.to = obj.to;
    this.transport = {
        "type": obj.transport.type
    };
};

//Child classes and outputs methods for different cards types
var BusCard = function (obj) {
    Card.call(this, obj);
    this.transport.properties = {
        "seat": obj.transport.properties.seat
    }
};
BusCard.prototype.createOutput = function () {
    return "Take bus from " + this.from + " to " + this.to + ". " +
        "Seat " + this.transport.properties.seat;
};

var AirplaneCard = function (obj) {
    Card.call(this, obj);
    this.transport.properties = {
        "seat": obj.transport.properties.seat,
        "gate": obj.transport.properties.gate,
        "number": obj.transport.properties.number
    }
};
AirplaneCard.prototype.createOutput = function () {
    return "From " + this.from + " Airport, take flight " + this.transport.properties.number + " to " + this.to + ". " +
        "Gate " + this.transport.properties.gate + ". " +
        "Seat " + this.transport.properties.seat;
};

var TrainCard = function (obj) {
    Card.call(this, obj);
    this.transport.properties = {
        "seat": obj.transport.properties.seat,
        "platform": obj.transport.properties.platform,
        "number": obj.transport.properties.number
    }
};
TrainCard.prototype.createOutput = function () {
    return "Take train " + this.transport.properties.number + " from " + this.from + " to " + this.to + ". " +
        "Platform " + this.transport.properties.platform + ". " +
        "Seat " + this.transport.properties.seat;
};

function trip(file, ulElem) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var cards = JSON.parse(xhr.responseText), cardsArr = [];
            cards.tickets.forEach(function (item, i, arr) {
                switch (item.transport.type) {
                    case 'airplane':
                        cardsArr[i] = new AirplaneCard(item);
                        break;
                    case 'bus':
                        cardsArr[i] = new BusCard(item);
                        break;
                    case 'train':
                        cardsArr[i] = new TrainCard(item);
                        break;
                }
            });
            var sortedArr = sortCards(cardsArr);
            var list = document.getElementById(ulElem), newLi;
            sortedArr.forEach(function (item, i, arr) {
                newLi = document.createElement('li');
                newLi.innerHTML = item.createOutput();
                list.appendChild(newLi);
            });
        }
    };
    xhr.send(null);
}

function sortCards(arr) {
    var count, i, j, firstCard, currentCard, sortedArr = [];
    //Find first card
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length; j++) {
            count = 0;
            if (Object.values(arr[j]).indexOf(arr[i].from) === 1) {
                count++;
                break;
            }
        }
        if (!count) {
            firstCard = arr[i];
            break;
        }
    }
    //Create sorted array
    sortedArr[0] = currentCard = firstCard;
    for (i = 0; i < arr.length; i++) {
        if (Object.values(arr[i]).indexOf(currentCard.to) === 0) {
            currentCard = arr[i];
            sortedArr.push(currentCard);
        }
    }
    return sortedArr;
}
