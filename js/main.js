'use strict';

(function () {
  const PIN_WIDTH = 50;
  const PIN_HEIGHT = 70;

  const typesMap = {
    palace: `Дворец`,
    flat: `Квартира`,
    house: `Дом`,
    bungalow: `Бунгало`,
  };

  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`button`);
  const map = document.querySelector(`.map`);
  const fragmentPinList = document.createDocumentFragment();
  const fragmentOfferCards = document.createDocumentFragment();
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
  const filtersContainer = map.querySelector(`.map__filters-container`);

  const renderOfferPin = (offer) => {
    const offerPreset = pinTemplate.cloneNode(true);

    offerPreset.style.left = `${offer.location.x - PIN_WIDTH / 2}px`;
    offerPreset.style.top = `${offer.location.y - PIN_HEIGHT}px`;

    let img = offerPreset.querySelector(`img`);
    img.src = `${offer.author.avatar}`;
    img.alt = `${offer.offer.title}`;

    offerPreset.addEventListener(`click`, () => {
      window.activatePage.closePopup();
      renderOfferCard(offer);
    });

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
      offerPreset.querySelector(`.popup__text--price`).textContent = `${price}/ночь`;
    } else {
      offerPreset.querySelector(`.popup__text--price`).textContent = ``;
    }

    if (rooms && guests) {
      offerPreset.querySelector(`.popup__text--capacity`).textContent = `${window.util.getTrueNumericalEndingWords(rooms, `room`)} для ${window.util.getTrueNumericalEndingWords(guests, `guest`)}`;
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
      if (evt.button === window.activatePage.MouseKey.LEFT) {
        window.activatePage.closePopup();
      }
    });

    document.addEventListener(`keydown`, window.activatePage.onCardEscKeyDown);

    map.insertBefore(offerPreset, filtersContainer);
  };

  map.insertBefore(fragmentOfferCards, filtersContainer);

  window.main = {
    map,
    renderOfferPin,
    fragmentPinList,
  };
})();
