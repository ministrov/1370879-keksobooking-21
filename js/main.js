'use strict';

const PHOTOLIST = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
const FEATURESLIST = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
const CHECKINDATA = ['12:00', '13:00', '14:00'];
const CHECKOUTDATA = ['12:00', '13:00', '14:00'];
const APARTMENTTYPELIST = ['palace', 'flat', 'house', 'bungalow'];
const MINY = 130;
const MAXY = 630;

// Фунция для получения случайного числа в указанном диапозоне

const getNumberRandomly = function (min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

// Функция для получения случайного элемента массива

const getElementRandomly = function (elements) {
  return elements[Math.floor(Math.random() * elements.length)];
};

// Функция для получения массива случайной длины

const getArrayRandomly = function (primaryArray) {
  let someArray = [];
  let someLength = Math.floor(Math.random() * primaryArray.length);

  for (var i = 0; i < someLength.length; i++) {
    someArray[i] = primaryArray[i];
  }

  return someArray;
};

let getPins = function () {
  let pins = [];

  for (let i = 0; i < 8; i++) {
    pins[i] = {
      "author": {
        "avatar": 'img/avatars/user0' + (i + 1) + '.png'
      },
      "offer": {
        "title": 'Уютная студия у метро',
        "address": '600, 350',
        "price": 10000,
        "type": getElementRandomly(APARTMENTTYPELIST),
        "rooms": 1,
        "guests": 2,
        "checkin": getElementRandomly(CHECKINDATA),
        "checkout": getElementRandomly(CHECKOUTDATA),
        "features": getArrayRandomly(FEATURESLIST),
        "description": 'Хорошая квартира-студия для комфортного проживания',
        "photos": getArrayRandomly(PHOTOLIST)
      },
      "location": {
        "x": 2,
        "y": getNumberRandomly(MINY, MAXY)
      }
    }; // закончился объект
  } // закончился  цикл
  return pins;
};

console.log(getPins());
