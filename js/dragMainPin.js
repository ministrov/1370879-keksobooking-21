'use strict';

(function () {

  const PIN_HEIGHT = 83;
  const PIN_WIDTH = 32;

  const mainPin = window.activatePage.mainMapPin;

  const locationBorderX = {
    min: 0,
    max: 1200
  };

  const locationBorderY = {
    min: 130,
    max: 630
  };

  const setCoordinates = (x, y) => {
    if (y < locationBorderY.min - PIN_HEIGHT) {
      y = locationBorderY.min - PIN_HEIGHT;
    } else if (y > locationBorderY.max - PIN_HEIGHT) {
      y = locationBorderY.max - PIN_HEIGHT;
    } else if (x < locationBorderX.min - PIN_WIDTH) {
      x = locationBorderX.min - PIN_WIDTH;
    } else if (x > locationBorderX.max - PIN_WIDTH) {
      x = locationBorderX.max - PIN_WIDTH;
    }

    mainPin.style.left = `${x}px`;
    mainPin.style.top = `${y}px`;
  };

  const onPinMouseDown = (evt) => {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const setNewCoordinates = function (element) {
      let shift = {
        x: startCoords.x - element.clientX,
        y: startCoords.y - element.clientY
      };

      startCoords = {
        x: element.clientX,
        y: element.clientY
      };

      // mainPin.style.top = `${mainPin.offsetTop - shift.y}px`;
      // mainPin.style.left = `${mainPin.offsetLeft - shift.x}px`;

      setCoordinates(mainPin.offsetLeft - shift.x, mainPin.offsetTop - shift.y);
    };

    const mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      setNewCoordinates(moveEvt);
    };

    const mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      // условие при котором не будет отключаться форма
      document.removeEventListener(`mousemove`, mouseMoveHandler);
      document.removeEventListener(`mouseup`, mouseUpHandler);
    };

    document.addEventListener(`mousemove`, mouseMoveHandler);
    document.addEventListener(`mouseup`, mouseUpHandler);
  };

  mainPin.addEventListener(`mousedown`, onPinMouseDown);
})();
