'use strict';

(function () {

  const MAIN_MAP_PIN_WIDTH = 62;
  const MAIN_MAP_PIN_HEIGHT = 62;
  const MAIN_MAP_PIN_NEEDLE_HEIGHT = 22;

  const MOCK_QUANTITY = 8;
  const mainMapPin = window.main.map.querySelector(`.map__pin--main`);
  const offers = window.data.generateMocks(MOCK_QUANTITY);

  const Key = { // Enum object
    ENTER: `Enter`,
    ESC: `Escape`
  };

  const MouseKey = {
    LEFT: 0
  };

  const getMapState = () => {
    return window.main.map.classList.contains(`.map--faded`);
  };

  const completeAddressInput = () => {
    const y = (!getMapState())
      ? Math.round(parseInt(mainMapPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT + MAIN_MAP_PIN_NEEDLE_HEIGHT)
      : Math.round(parseInt(mainMapPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT / 2);

    window.form.adFormAddress.value = `${Math.round(parseInt(mainMapPin.style.left, 10) + MAIN_MAP_PIN_WIDTH / 2)}, ${y}`;
  };

  const activatePage = () => {
    window.form.toggleFormElementsState();
    completeAddressInput();
    window.main.map.classList.remove(`map--faded`);
    window.form.adForm.classList.remove(`ad-form--disabled`);

    offers.forEach((pin) => {
      window.main.fragmentPinList.append(window.main.renderOfferPin(pin));
    });

    window.data.offersZone.append(window.main.fragmentPinList);
  };

  const onCardEscKeyDown = (evt) => {
    if (evt.key === Key.ESC) {
      closePopup();
    }
  };

  const closePopup = () => {
    const popup = window.main.map.querySelector(`.popup`);

    if (popup) {
      popup.remove();
      document.removeEventListener(`keydown`, onCardEscKeyDown);
    }
  };

  const deactivatePage = () => {
    completeAddressInput();

    window.form.toggleFormElementsState();

    const minPrice = window.form.minPricesMap[window.form.adFormType.value];
    window.form.adFormPrice.placeholder = minPrice;
    window.form.adFormPrice.min = minPrice;
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

  window.activatePage = {
    MouseKey,
    closePopup,
    offers,
    onCardEscKeyDown,
    mainMapPin
  };
})();
