/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
const keyName = 'user';

class User {
      static URL = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem(keyName, JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem(keyName);
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */

  static fetch(callback) {
    createRequest({
      url: this.URL + '/current',
      data: callback(),
      method: 'GET',
      callback: (err, response)=> {
        if (response && response.user) {
          this.setCurrent(response.user);
        } else {
          alert('Необходима авторизация');
          this.unsetCurrent();
        }
      }
    });
  }


  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    if (data.email !== '') {
      createRequest({
        url: this.URL + '/login',
        data: data,
        method: 'POST',
        responseType: 'json',
        callback: (err, response) => {
          if (response && response.user) {
            this.setCurrent(response.user);
          } else {
            alert(`Пользователь c email ${data.email} и паролем ${data.password} не найден`);
          }

          callback(err, response);
        }
      });
    } else {
      alert('Введите email!');
    }
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      data: data,
      method: 'POST',
      responseType: 'json',
      callback: (err, response) => {
        if (response && response.success) {
          this.setCurrent(response.user);
        } else {
          alert(response.error);
        }

        callback(err, response);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout',
      data: {},
      method: 'POST',
      responseType: 'json',
      callback: (err, response) => {
        if (response && response.success) {
          this.unsetCurrent();
        } else {
          console.log(response.error);
        }
        callback(err, response);
      }
    });
  }
}
