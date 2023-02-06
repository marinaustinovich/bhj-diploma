/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();

        if (options.method === 'GET') {
            console.log(options.url);
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
            const formData = new FormData();
            formData.append('mail', options.data.email);
            formData.append('password', options.data.password);
            try {
                xhr.open(options.method, options.url, true);
                xhr.responseType = 'json';
                // xhr.withCredentials = true;
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
            options.callback(null, xhr.response);
        } else if (xhr.status >= 400) {
            options.callback(new Error(xhr.statusText));
        }
    }
};
