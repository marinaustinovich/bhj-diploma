/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const fnc = options.callback;
    const xhr = new XMLHttpRequest();

        if (options.method === 'GET') {
            try {
                let arrKeysValuesData = Object.entries(options.data);
                console.log(arrKeysValuesData);
                for (let i = 0; i < arrKeysValuesData.length; i ++) {
                    arrKeysValuesData[i] = arrKeysValuesData[i].join('=');
                }

                arrKeysValuesData = arrKeysValuesData.join('&');
                console.log(arrKeysValuesData);
                options.url = options.url + '?' + arrKeysValuesData;
                console.log(options.url);
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
            try {
                const formData = new FormData();

                    if (options.method === 'PUT') {
                        formData.append('type', options.data.type);
                        formData.append('account_id', options.data.account_id);
                        formData.append('sum', options.data.sum);
                        formData.append('name', options.data.name);
                    }  else if (options.method === 'DELETE') {
                        formData.append('id', options.data.account_id);
                    } else {
                        formData.append('email', options.data.email);
                        formData.append('password', options.data.password);
                        formData.append('name', options.data.name);
                }

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
