'use strict';

(function () {
  const adForm = document.querySelector(`.ad-form`);
  const userApartmentInput = adForm.querySelector(`#title`);
  const adFormTimein = adForm.querySelector(`#timein`);
  const adFormTimeout = adForm.querySelector(`#timeout`);
  const adFormAddress = adForm.querySelector(`#address`);
  const adFormPrice = adForm.querySelector(`#price`);
  const adFormType = adForm.querySelector(`#type`);
  const adFormRoomNumber = adForm.querySelector(`#room_number`);
  const adFormCapacity = adForm.querySelector(`#capacity`);
  const capacityOptions = adFormCapacity.querySelectorAll(`option`);

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

  const toggleFormElementsState = () => {
    const fieldsets = document.querySelectorAll(`fieldset, select`);

    fieldsets.forEach((fieldset) => {
      fieldset.disabled = !fieldset.disabled;
    });
  };

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

  window.form = {
    toggleFormElementsState,
    adForm,
    adFormType,
    adFormPrice,
    minPricesMap,
    adFormAddress
  };
})();
