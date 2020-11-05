'use strict';

(function () {

  let startCoords = {};
  const adFormAddress = window.form.adFormAddress;
  const mainPin = window.activatePage.mainMapPin;
  const pinNeedleHeight = window.activatePage.MAIN_MAP_PIN_NEEDLE_HEIGHT;
  const pinHeight = window.activatePage.MAIN_MAP_PIN_HEIGHT;
  const pinWidth = window.activatePage.MAIN_MAP_PIN_WIDTH;
  const calcCoords = function (e) {
    mainPin.style.left = `${mainPin.offsetLeft + e.clientX - startCoords.x}px`;
    mainPin.style.top = `${mainPin.offsetTop + e.clientY - startCoords.y}px`;
    const pinCoords = {
      x: (mainPin.offsetLeft + pinWidth) / 2,
      y: mainPin.offsetTop + pinHeight + pinNeedleHeight
    };
    adFormAddress.value = `${pinCoords.x}, ${pinCoords.y}`;
    startCoords.x = e.clientX;
    startCoords.y = e.clientY;
  };
  mainPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();
    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;
    this.addEventListener(`mousemove`, calcCoords);
    this.addEventListener(`mouseup`, function (e) {
      calcCoords(e);
      this.removeEventListener(`mousemove`, calcCoords);
    });
  });
})();
