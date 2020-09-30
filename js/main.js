'use strict';

const MOCK_QUANTITY = 8;

const PRICE_MIN = 1;
const PRICE_MAX = 50;
const PRICE_STEP = 1000;

const ROOMS_MIN = 1;
const ROOMS_MAX = 4;

const GUESTS_MIN = 2;
const GUESTS_MAX = 10;

const LOCATION_X_MIN = 0;
const LOCATION_Y_MIN = 130;
const LOCATION_Y_MAX = 630;

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

const TITLE_RENT = [
  `Сдам`,
  `Сдается`,
  `Свободно жилье -`,
  `Можно арендовать`,
  `Сдается жилье -`,
  `Специально для вас -`,
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

const typesMap = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`,
};

const offersZone = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`button`);

const getRandomIntNumber = (min = 0, max = 100) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getRandomArrayElements = (arr, n = 1) => {
  let randomArray = [];

  for (let i = 0; i < arr.length && i < n; i++) {
    const element = getRandomIntNumber(i, arr.length - 1);
    randomArray.push(arr[element]);
    const swap = arr[element];
    arr[element] = arr[i];
    arr[i] = swap;
  }

  return randomArray;
};

const getTitle = (type) => {
  return `${getRandomIntNumber(0, TITLE_RENT)} ${typesMap[type]}${(Math.random() < 0.5 ? `!` : `.`)}`;
};

const getDescription = (type, rooms) => {
  return `${typesMap[type]}, кол-во комнат - ${rooms}, ${getRandomIntNumber(0, DESCRIPTION_SLOGANS)}`;
};

const generateMocks = (n) => {
  const generatedMocks = [];

  let avatarNumbers = [];

  for (let i = 1; i <= n; i++) {
    avatarNumbers.push(i < 10 ? `0` + i : i);
  }

  avatarNumbers = getRandomArrayElements(avatarNumbers, n);

  for (let i = 0; i < n; i++) {
    const mock = {
      author: {
        avatar: `img/avatars/user${avatarNumbers[i]}.png`
      },
      offer: {
        title: getRandomArrayElements(TITLE_RENT),
        address: ``,
        price: getRandomIntNumber(PRICE_MIN, PRICE_MAX) * PRICE_STEP,
        type: getRandomIntNumber(0, APARTMENT_TYPES.length - 1),
        rooms: getRandomIntNumber(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomIntNumber(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomIntNumber(0, CHECK_IN_OUT.length - 1),
        checkout: getRandomIntNumber(0, CHECK_IN_OUT.length - 1),
        features: getRandomArrayElements(APARTMENT_FEATURES, getRandomIntNumber(1, APARTMENT_FEATURES.length)),
        description: getRandomArrayElements(DESCRIPTION_SLOGANS),
        photos: getRandomArrayElements(PHOTO, getRandomIntNumber(1, PHOTO.length))
      },
      location: {
        x: getRandomIntNumber(LOCATION_X_MIN, offersZone.offsetWidth),
        y: getRandomIntNumber(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    };

    mock.offer.title = getTitle(mock.offer.type);
    mock.offer.address = `${mock.location.x} ${mock.location.y}`;
    mock.offer.description = getDescription(mock.offer.type, mock.offer.rooms);

    generatedMocks.push(mock);
  }

  return generatedMocks;
};

const renderOffer = (offer) => {
  const offerPreset = pinTemplate.cloneNode(true);

  offerPreset.style = `left: ${offer.location.x - PIN_WIDTH / 2}px; top: ${offer.location.y - PIN_HEIGHT}px`;
  offerPreset.querySelector(`img`).src = `${offer.author.avatar}`;
  offerPreset.querySelector(`img`).alt = `${offer.offer.title}`;

  return offerPreset;
};

const offers = generateMocks(MOCK_QUANTITY);
const fragment = document.createDocumentFragment();
for (let i = 0; i < offers.length; i++) {
  fragment.append(renderOffer(offers[i]));
}

offersZone.append(fragment);

document.querySelector(`.map`).classList.remove(`map--faded`);
