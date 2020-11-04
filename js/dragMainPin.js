'use strict';

(function () {
  window.activatePage.mainMapPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  });
})();
