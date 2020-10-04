'use strict';

const MOCK_QUANTITY = 8;

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

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

const RENT_WORDS = [
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

const numericalEndingsMap = {
  room: [`комната`, `комнаты`, `комнат`],
  guest: [`гостя`, `гостей`, `гостей`],
};
const map = document.querySelector('.map');
const fragmentPinList = document.createDocumentFragment();
const fragmentOfferCards = document.createDocumentFragment();
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const filtersContainer = map.querySelector(`.map__filters-container`);

const getRandomIntNumber = (min = 0, max = 100) => {
  return min + Math.floor(Math.random() * (max - min + 1));
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
  return `${RENT_WORDS[getRandomIntNumber(0, RENT_WORDS.length - 1)]} ${typesMap[type]} ${(Math.random() < 0.5 ? `!` : `.`)}`;
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
        title: getRandomArrayElements(RENT_WORDS),
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

const renderOfferPin = (offer) => {
  const offerPreset = pinTemplate.cloneNode(true);

  offerPreset.style = `left: ${offer.location.x - PIN_WIDTH / 2}px; top: ${offer.location.y - PIN_HEIGHT}px`;
  offerPreset.querySelector(`img`).src = `${offer.author.avatar}`;
  offerPreset.querySelector(`img`).alt = `${offer.offer.title}`;

  return offerPreset;
};

const renderOfferCard = (item) => {
  const {
    author: {
      avatar
    },
    offer: {
      title,
      address,
      price,
      type,
      rooms,
      guests,
      checkin,
      checkout,
      features,
      description,
      photos,
    },
  } = item;

  const offerPreset = cardTemplate.cloneNode(true);

  offerPreset.querySelector(`.popup__avatar`).src = avatar;
  offerPreset.querySelector(`.popup__title`).textContent = title;
  offerPreset.querySelector(`.popup__text--address`).textContent = address;
  offerPreset.querySelector(`.popup__type`).textContent = typesMap[type];

  if (price) {
    offerPreset.querySelector(`.popup__text--price`).innerHTML = `${price}&#x20bd;<span>/ночь</span>`;
  } else {
    offerPreset.querySelector(`.popup__text--price`).textContent = ``;
  }

  if (rooms && guests) {
    offerPreset.querySelector(`.popup__text--capacity`).textContent = `${getTrueNumericalEndingWords(rooms, `room`)} для ${getTrueNumericalEndingWords(guests, `guest`)}`;
  } else {
    offerPreset.querySelector(`.popup__text--capacity`).textContent = ``;
  }

  if (checkin && checkout) {
    offerPreset.querySelector(`.popup__text--time`).textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
  } else {
    offerPreset.querySelector(`.popup__text--time`).textContent = ``;
  }

  if (type && rooms) {
    offerPreset.querySelector(`.popup__description`).textContent = description;
  } else {
    offerPreset.querySelector(`.popup__description`).textContent = ``;
  }

  const popupFeatures = offerPreset.querySelector(`.popup__features`);

  popupFeatures.innerHTML = ``;

  for (let i = 0; i < features.length; i++) {
    const feature = document.createElement(`li`);
    feature.classList.add(`popup__feature`);
    feature.classList.add(`popup__feature--${features[i]}`);
    popupFeatures.append(feature);
  }

  for (let i = 0; i < photos.length; i++) {
    offerPreset.querySelectorAll(`.popup__photo`)[i].src = photos[i];

    if (i < photos.length - 1) {
      offerPreset.querySelector(`.popup__photos`);
      offerPreset.append(offerPreset.querySelector(`.popup__photo`).cloneNode());
    }
  }

  if (!photos) {
    offerPreset.querySelector(`.popup__photo`).remove();
  }

  for (let i = 0; i < offerPreset.children.length; i++) {
    if (
      (!offerPreset.children[i].textContent && i > 1 && i !== 8 && i !== 10) ||
      (!offerPreset.children[i].src && i === 0) ||
      (!offerPreset.children[i].querySelectorAll(`li`).length && i === 8) ||
      (!offerPreset.children[i].querySelectorAll(`img`).length && i === 10)
    ) {
      offerPreset.children[i].classList.add(`hidden`);
    }
  }

  return offerPreset;
};

const offers = generateMocks(MOCK_QUANTITY);

offers.forEach((pin) => {
  fragmentPinList.append(renderOfferPin(pin));
});

offersZone.append(fragmentPinList);
fragmentOfferCards.append(renderOfferCard(offers[0]));
map.insertBefore(fragmentOfferCards, filtersContainer);
map.classList.remove(`map--faded`);
