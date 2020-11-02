'use strict';

(function () {

  const PRICE_MIN = 1;
  const PRICE_MAX = 50;
  const PRICE_STEP = 1000;

  const ROOMS_MIN = 1;
  const ROOMS_MAX = 6;

  const GUESTS_MIN = 2;
  const GUESTS_MAX = 12;

  const LOCATION_X_MIN = 0;
  const LOCATION_Y_MIN = 130;
  const LOCATION_Y_MAX = 630;
  const offersZone = document.querySelector(`.map__pins`);

  const RENT_WORDS = [
    `Сдам`,
    `Сдается`,
    `Свободно жилье`,
    `Можно арендовать`,
    `Сдается жилье`,
    `Специально для вас`,
  ];

  const APARTMENT_TYPES = [`palace`, `flat`, `house`, `bungalow`];

  const CHECK_IN_OUT = [`12:00`, `13:00`, `14:00`];

  const APARTMENT_FEATURES = [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`,
  ];

  const DESCRIPTION_SLOGANS = [
    `красивые виды из окон.`,
    `тихий район.`,
    `территория Якудзы.`,
    `центр города.`,
    `ярко выраженный местный колорит.`,
  ];

  const PHOTO = [
    `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`,
  ];

  const generateMocks = (n) => {
    const generatedMocks = [];

    for (let i = 0; i < n; i++) {
      const mock = {
        author: {
          avatar: `img/avatars/user0${i + 1}.png`
        },
        offer: {
          title: RENT_WORDS[window.util.getRandomIntNumber(0, RENT_WORDS.length - 1)],
          address: ``,
          price: window.util.getRandomIntNumber(PRICE_MIN, PRICE_MAX) * PRICE_STEP,
          type: window.util.getRandomIntNumber(0, APARTMENT_TYPES.length - 1),
          rooms: window.util.getRandomIntNumber(ROOMS_MIN, ROOMS_MAX),
          guests: window.util.getRandomIntNumber(GUESTS_MIN, GUESTS_MAX),
          checkin: window.util.getRandomIntNumber(0, CHECK_IN_OUT.length - 1),
          checkout: window.util.getRandomIntNumber(0, CHECK_IN_OUT.length - 1),
          features: window.util.shuffle(APARTMENT_FEATURES).slice(0, window.util.getRandomIntNumber(0, APARTMENT_FEATURES.length)),
          description: window.util.getRandomArrayElements(DESCRIPTION_SLOGANS),
          photos: [window.util.getRandomArrayElements(PHOTO, window.util.getRandomIntNumber(0, PHOTO.length - 1))]
        },
        location: {
          x: window.util.getRandomIntNumber(LOCATION_X_MIN, offersZone.offsetWidth),
          y: window.util.getRandomIntNumber(LOCATION_Y_MIN, LOCATION_Y_MAX)
        }
      };

      generatedMocks.push(mock);
    }

    return generatedMocks;
  };

  window.data = {
    generateMocks,
    offersZone
  };
})();
