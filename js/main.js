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

const MAIN_MAP_PIN_WIDTH = 62;
const MAIN_MAP_PIN_HEIGHT = 62;
const MAIN_MAP_PIN_NEEDLE_HEIGHT = 22;

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

const Key = { // Enum object
  ENTER: `Enter`,
  ESC: `Escape`
};

const MouseKey = {
  LEFT: 0
};

const typesMap = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`,
};

const numericalEndingsMap = {
  room: [`комната`, `комнаты`, `комнат`],
  guest: [`гостя`, `гостей`, `гостей`],
};

const minPricesMap = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalow: 0,
};

const numberOfGuests = {
  1: [`1`],
  2: [`1`, `2`],
  3: [`1`, `2`, `3`],
  100: [`0`]
};

const offersZone = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`button`);
const map = document.querySelector(`.map`);
const fragmentPinList = document.createDocumentFragment();
const fragmentOfferCards = document.createDocumentFragment();
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const filtersContainer = map.querySelector(`.map__filters-container`);
const adForm = document.querySelector(`.ad-form`);
const userApartmentInput = adForm.querySelector(`#title`);
const adFormAddress = adForm.querySelector(`#address`);
const adFormPrice = adForm.querySelector(`#price`);
const adFormType = adForm.querySelector(`#type`);
const adFormTimein = adForm.querySelector(`#timein`);
const adFormTimeout = adForm.querySelector(`#timeout`);
const adFormRoomNumber = adForm.querySelector(`#room_number`);
const adFormCapacity = adForm.querySelector(`#capacity`);
const mainMapPin = map.querySelector(`.map__pin--main`);
const capacityOptions = adFormCapacity.querySelectorAll(`option`);

const validateRooms = () => {
  const roomValue = adFormRoomNumber.value;
  capacityOptions.forEach((option) => {
    let isDisabled = !(numberOfGuests[roomValue].indexOf(option.value) >= 0);

    option.selected = numberOfGuests[roomValue][0] === option.value;
    option.disabled = isDisabled;
    option.hidden = isDisabled;
  });
};

const onRoomNumberChange = () => {
  validateRooms();
};

validateRooms();

adFormRoomNumber.addEventListener(`change`, onRoomNumberChange);

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

const generateMocks = (n) => {
  const generatedMocks = [];

  for (let i = 0; i < n; i++) {
    const mock = {
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: RENT_WORDS[getRandomIntNumber(0, RENT_WORDS.length - 1)],
        address: ``,
        price: getRandomIntNumber(PRICE_MIN, PRICE_MAX) * PRICE_STEP,
        type: getRandomIntNumber(0, APARTMENT_TYPES.length - 1),
        rooms: getRandomIntNumber(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomIntNumber(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomIntNumber(0, CHECK_IN_OUT.length - 1),
        checkout: getRandomIntNumber(0, CHECK_IN_OUT.length - 1),
        features: shuffle(APARTMENT_FEATURES).slice(0, getRandomIntNumber(0, APARTMENT_FEATURES.length)),
        description: getRandomArrayElements(DESCRIPTION_SLOGANS),
        photos: [getRandomArrayElements(PHOTO, getRandomIntNumber(0, PHOTO.length - 1))]
      },
      location: {
        x: getRandomIntNumber(LOCATION_X_MIN, offersZone.offsetWidth),
        y: getRandomIntNumber(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    };

    generatedMocks.push(mock);
  }

  return generatedMocks;
};

const closePopup = () => {
  const popup = map.querySelector(`.popup`);

  if (popup) {
    popup.remove();
    document.removeEventListener(`keydown`, onCardEscKeyDown);
  }
};

const renderOfferPin = (offer) => {
  const offerPreset = pinTemplate.cloneNode(true);

  offerPreset.style.left = `${offer.location.x - PIN_WIDTH / 2}px`;
  offerPreset.style.top = `${offer.location.y - PIN_HEIGHT}px`;

  let img = offerPreset.querySelector(`img`);
  img.src = `${offer.author.avatar}`;
  img.alt = `${offer.offer.title}`;

  offerPreset.addEventListener(`click`, () => {
    closePopup();
    renderOfferCard(offer);
  });

  return offerPreset;
};

const onCardEscKeyDown = (evt) => {
  if (evt.key === Key.ESC) {
    closePopup();
  }
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
    offerPreset.querySelector(`.popup__text--price`).textContent = `${price}/ночь`;
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

  if (features) {
    popupFeatures.innerHTML = ``;

    for (let i = 0; i < features.length; i++) {
      const feature = document.createElement(`li`);
      feature.classList.add(`popup__feature`, `popup__feature--${features[i]}`);
      popupFeatures.append(feature);
    }
  } else {
    popupFeatures.remove();
  }


  if (!photos) {
    offerPreset.querySelector(`.popup__photo`).remove();
  } else {
    offerPreset.querySelector(`.popup__photo`).src = photos[0];

    for (let i = 0; i < photos.length; i++) {
      if (i < photos.length - 1) {
        offerPreset.querySelector(`.popup__photos`);
        let newImage = offerPreset.querySelector(`.popup__photo`).cloneNode();
        newImage.src = photos[i];
        offerPreset.append(newImage);
      }
    }
  }

  const closeButton = offerPreset.querySelector(`.popup__close`);

  closeButton.addEventListener(`click`, (evt) => {
    if (evt.button === MouseKey.LEFT) {
      closePopup();
    }
  });

  document.addEventListener(`keydown`, onCardEscKeyDown);

  map.insertBefore(offerPreset, filtersContainer);
};

const offers = generateMocks(MOCK_QUANTITY);

offers.forEach((pin) => {
  fragmentPinList.append(renderOfferPin(pin));
});

map.insertBefore(fragmentOfferCards, filtersContainer);

const toggleFormElementsState = () => {
  const fieldsets = document.querySelectorAll(`fieldset, select`);

  fieldsets.forEach((fieldset) => {
    fieldset.disabled = !fieldset.disabled;
  });
};

const getMapState = () => {
  return map.classList.contains(`.map--faded`);
};

const completeAddressInput = () => {
  const y = (!getMapState())
    ? Math.round(parseInt(mainMapPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT + MAIN_MAP_PIN_NEEDLE_HEIGHT)
    : Math.round(parseInt(mainMapPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT / 2);

  adFormAddress.value = `${Math.round(parseInt(mainMapPin.style.left, 10) + MAIN_MAP_PIN_WIDTH / 2)}, ${y}`;
};

const activatePage = () => {
  toggleFormElementsState();
  completeAddressInput();
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);

  offers.forEach((pin) => {
    fragmentPinList.append(renderOfferPin(pin));
  });

  offersZone.append(fragmentPinList);
};

const deactivatePage = () => {
  completeAddressInput();

  toggleFormElementsState();

  const minPrice = minPricesMap[adFormType.value];
  adFormPrice.placeholder = minPrice;
  adFormPrice.min = minPrice;
};

deactivatePage();

mainMapPin.addEventListener(`mousedown`, (evt) => {
  if (evt.button === MouseKey.LEFT) {
    activatePage();
  }
});

mainMapPin.addEventListener(`keydown`, (evt) => {
  if (evt.key === Key.ENTER) {
    activatePage();
  }
});

adFormType.addEventListener(`change`, () => {
  const minPrice = minPricesMap[adFormType.value];
  adFormPrice.placeholder = minPrice;
  adFormPrice.min = minPrice;
});

adFormTimein.addEventListener(`change`, () => {
  adFormTimeout.value = adFormTimein.value;
});

adFormTimeout.addEventListener(`change`, () => {
  adFormTimein.value = adFormTimeout.value;
});

userApartmentInput.addEventListener(`invalid`, () => {
  if (userApartmentInput.validity.tooShort) {
    userApartmentInput.setCustomValidity(`Имя должно состоять минимум из двух символов`);
  } else if (userApartmentInput.validity.tooLong) {
    userApartmentInput.setCustomValidity(`Имя не должно превышать 25-ти символов`);
  } else if (userApartmentInput.validity.valueMissing) {
    userApartmentInput.setCustomValidity(`Обязательное поле`);
  } else {
    userApartmentInput.setCustomValidity(``);
  }
});
