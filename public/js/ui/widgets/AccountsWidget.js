/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error("переданный элемент не существует");
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = document.querySelector('.create-account');
    createAccount.addEventListener('click', () => App.getModal('newAccount').open());
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const dataUser = User.current();

    if (dataUser) {
      Account.list(dataUser, (err, response) => {
        if (response.success) {
          this.clear();
        }

       for (let i = 0; i < response.data.length; i ++) {
         this.renderItem(response.data[i]);
       }
      })
    }

  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const  accounts = Array.from(document.getElementsByClassName('account'));
    const accountsPanel = document.querySelector('.accounts-panel');
    const countAccounts = accounts.length;

    for (let i = 0; i < countAccounts; i ++) {
      accountsPanel.removeChild(accounts[i]);
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const elementActive = element.closest('ul').querySelector('.active');

    if(elementActive) {
      elementActive.classList.remove('active');
    }

    element.classList.add('active');
    App.showPage( 'transactions', {account_id: element.dataset.id});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const list = document.createElement('li');
    const link = document.createElement('a');
    const spanText = document.createElement('span');
    const spanSum = document.createElement('span');

    list.classList.add('account');
    list.dataset.id = item.id;
    list.addEventListener('click', (e) => this.onSelectAccount(e.currentTarget));

    link.setAttribute('href', '#');
    spanText.textContent = item.name + ' / ';
    spanSum.textContent = item.sum + '  ₽';

    link.append(spanText, spanSum);
    list.append(link);
    return list;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.element.append(this.getAccountHTML(data));
  }
}
