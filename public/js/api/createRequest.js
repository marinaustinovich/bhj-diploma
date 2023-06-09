// /**
//  * Основная функция для совершения запросов
//  * на сервер.
//  * */
const prepareRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let data = null;

    if (options.method === 'GET' && options.data) {
        // Prepare URL parameters for GET request
        let params = new URLSearchParams();
        for (let key in options.data) {
            params.append(key, options.data[key]);
        }
        options.url += '?' + params.toString();
    } else if (options.method !== 'GET') {
        // Prepare FormData for non-GET requests
        data = new FormData();
        for (let key in options.data) {
            // If it's a DELETE request and key is 'account_id', add it as 'id'
            if (options.method === 'DELETE' && key === 'account_id') {
                data.append('id', options.data[key]);
            } else {
                data.append(key, options.data[key]);
            }
        }
    }

    xhr.open(options.method, options.url, true);
    xhr.responseType = 'json';

    return { xhr, data };
};

const sendRequest = ({ xhr, data }, callback) => {
    try {
        xhr.send(data);
    } catch (e) {
        // Catch network error
        console.error(e);
        callback(e, null);
        return;
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(null, xhr.response);
        } else if (xhr.status >= 400) {
            callback(new Error(xhr.statusText), null);
        }
    }
};

const createRequest = (options = {}) => {
    const { xhr, data } = prepareRequest(options);
    sendRequest({ xhr, data }, options.callback);
};
