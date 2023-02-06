/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
const keyName = 'user';
class User {
   static constructor() {
   this.URL = '/user';
  }

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
    return JSON.parse(localStorage.getItem(keyName))? JSON.parse(localStorage.getItem(keyName)) : undefined
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
                                  /* it's necessary from  callback a object like this
                                  {
                                  "success": true,
                                      "user": {
                                    "id": 2,
                                        "name": "Vlad",
                                        "email": "l@l.one",
                                        "created_at": "2019-03-06 18:46:41",
                                        "updated_at": "2019-03-06 18:46:41"
                                  }
                                }
                                */

// console.log(callback);
    const xhr = createRequest({
      // url: this.URL + '/current',
      url: 'file:///D:/OSPanel/domains/Marina/JavaScript/bhj-diploma/public/user/current',
      // data: ,
      method: 'GET',

      // задаём функцию обратного вызова
      callback(err, response) {
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        // ...
        // вызываем параметр, переданный в метод fetch
        callback(err, response);
      }
      // ...
    });
  }


  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {

  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {

  }
}
