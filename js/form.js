'use strict';

const adForm = document.querySelector(`.ad-form`);
const userApartmentInput = adForm.querySelector(`#title`);
const adFormTimein = adForm.querySelector(`#timein`);
const adFormTimeout = adForm.querySelector(`#timeout`);
const capacityOptions = adFormCapacity.querySelectorAll(`option`);
const adFormAddress = adForm.querySelector(`#address`);
const adFormPrice = adForm.querySelector(`#price`);
const adFormType = adForm.querySelector(`#type`);
const adFormRoomNumber = adForm.querySelector(`#room_number`);
const adFormCapacity = adForm.querySelector(`#capacity`);

const completeAddressInput = () => {
  const y = (!getMapState())
    ? Math.round(parseInt(mainMapPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT + MAIN_MAP_PIN_NEEDLE_HEIGHT)
    : Math.round(parseInt(mainMapPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT / 2);

  adFormAddress.value = `${Math.round(parseInt(mainMapPin.style.left, 10) + MAIN_MAP_PIN_WIDTH / 2)}, ${y}`;
};

const onRoomNumberChange = () => {
  validateRooms();
};

validateRooms();

adFormRoomNumber.addEventListener(`change`, onRoomNumberChange);

const validateRooms = () => {
  const roomValue = adFormRoomNumber.value;
  capacityOptions.forEach((option) => {
    let isDisabled = !(numberOfGuests[roomValue].indexOf(option.value) >= 0);

    option.selected = numberOfGuests[roomValue][0] === option.value;
    option.disabled = isDisabled;
    option.hidden = isDisabled;
  });
};

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
