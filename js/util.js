'use strict';

(function () {

  const numericalEndingsMap = {
    room: [`комната`, `комнаты`, `комнат`],
    guest: [`гостя`, `гостей`, `гостей`],
  };

  const getRandomIntNumber = (min = 0, max = 100) => {
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };


  const getTrueNumericalEndingWords = (q = 1, word) => {
    if (q % 100 < 11 || q % 100 > 14) {
      if (q % 10 === 1) {
        return `${q} ${numericalEndingsMap[word][0]}`;
      } else if (q % 10 > 1 && q % 10 < 5) {
        return `${q} ${numericalEndingsMap[word][1]}`;
      }
    }

    return `${q} ${numericalEndingsMap[word][2]}`;
  };

  const getRandomArrayElements = (arr) => {
    return arr[getRandomIntNumber(0, arr.length - 1)];
  };

  window.util = {
    getTrueNumericalEndingWords,
    getRandomArrayElements,
    shuffle,
    getRandomIntNumber
  };
})();
