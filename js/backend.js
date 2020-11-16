'use strict';

(function () {
  const GET_URL = `https://21.javascript.pages.academy/code-and-magick/data`;
  const POST_URL = `https://21.javascript.pages.academy/code-and-magick`;
  const TIME_OUT_MS = 10000;

  const StatusCode = {
    OK: 200
  };

  const request = (onSuccess, onError, data) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
    });

    xhr.timeout = TIME_OUT_MS;

    if (data) {
      xhr.open(`POST`, POST_URL);
      xhr.send(data);
    } else {
      xhr.open(`GET`, GET_URL);
      xhr.send();
    }

  };

  window.backend = {
    load: request,
    save: request
  };
})();
