'use strict';

(function () {

  const MAIN_MAP_PIN_WIDTH = 62;
  const MAIN_MAP_PIN_HEIGHT = 62;
  const MAIN_MAP_PIN_NEEDLE_HEIGHT = 22;

  const MAX_COUNT = 5;
  const mainMapPin = window.main.map.querySelector(`.map__pin--main`);
  const offersZone = document.querySelector(`.map__pins`);
  const offers = [];

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

  const onSuccess = (data) => {
    window.form.toggleFormElementsState();
    completeAddressInput();

    window.main.map.classList.remove(`map--faded`);
    window.form.adForm.classList.remove(`ad-form--disabled`);

    data.slice().forEach((item) => {
      if (item.offer) {
        offers.push(item);
      }
    });

    offers.slice(0, MAX_COUNT).forEach((pin) => {
      window.main.fragmentPinList.append(window.main.renderOfferPin(pin));
    });

    offersZone.append(window.main.fragmentPinList);
  };

  const onError = (error) => {
    let node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = error;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  const activatePage = () => {
    window.backend.load(onSuccess, onError);
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

  const onMainPinMouseDown = (evt) => {
    if (evt.button === MouseKey.LEFT) {
      activatePage();
      mainMapPin.removeEventListener(`mousedown`, onMainPinMouseDown);
    }
  };

  mainMapPin.addEventListener(`mousedown`, onMainPinMouseDown);

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
    mainMapPin,
    MAIN_MAP_PIN_NEEDLE_HEIGHT,
    MAIN_MAP_PIN_WIDTH,
    MAIN_MAP_PIN_HEIGHT
  };
})();
