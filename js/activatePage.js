'use strict';

(function () {

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

  const activatePage = () => {
    window.form.toggleFormElementsState();
    window.form.completeAddressInput();
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
    window.form.completeAddressInput();

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
