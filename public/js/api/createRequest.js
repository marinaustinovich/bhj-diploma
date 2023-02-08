/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const fnc = options.callback;
    const xhr = new XMLHttpRequest();

        if (options.method === 'GET') {
            console.log(options);
            try {
                xhr.open(options.method, options.url, true);
                xhr.responseType = 'json';
                xhr.send();
            }
            catch (e) {
                // перехват сетевой ошибки
                options.callback(e, null);
                return;
            }
        } else {
            console.log(options);
            const formData = new FormData();
            formData.append('email', options.data.email);
            formData.append('password', options.data.password);
            formData.append('name', options.data.name);
            try {
                xhr.open(options.method, options.url, true);
                xhr.responseType = 'json';
                xhr.send(formData);
            }
            catch (e) {
                // перехват сетевой ошибки
                options.callback(e, null);
                return;
            }
        }

    xhr.onreadystatechange = function (options= {}) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.response);
            fnc(null, xhr.response);
        } else if (xhr.status >= 400) {
            fnc(new Error(xhr.statusText));
        }
    }
};
