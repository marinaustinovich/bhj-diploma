/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error("переданный элемент не существует");
    }
    this.element = element;
    this.lastOptions = '';
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelector('.remove-account');
    removeAccount.addEventListener('click', () => {
      this.removeAccount(this.lastOptions);
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount(data) {
    if (this.lastOptions !== '') {
      const resultConfirm = confirm('Вы действительно хотите удалить счёт?');
      if (resultConfirm) {
        this.clear();
        Account.remove(data, (err, response) => {
          if (response.success) {
            App.updateWidgets();
            App.updateForms();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const resultConfirm = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (resultConfirm) {
        Transaction.remove({account_id: id}, (err, response) => {
          if (response.success) {
              App.update();
            }
        });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.lastOptions = options;

      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          const name = response.data.find(item => item.id === options.account_id).name;
          this.renderTitle(name);
          Transaction.list(options, (err, response) => this.renderTransactions(response.data));
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.lastOptions = '';
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const time = new Date(Date.parse(date));
    const year = time.getFullYear();
    const day = time.getDate();

    let month = time.getMonth();
    switch(month) {
      case 0: month = 'января';
              break;
      case 1: month = 'февраля';
              break;
      case 2: month = 'марта';
              break;
      case 3: month = 'апреля';
              break;
      case 4: month = 'мая';
              break;
      case 5: month = 'июня';
              break;
      case 6: month = 'июля';
              break;
      case 7: month = 'августа';
              break;
      case 8: month = 'сентября';
              break;
      case 9: month = 'октября';
              break;
      case 10: month = 'ноября';
              break;
      case 11: month = 'декабря';
              break;
      default: break;
    }

    let hour = time.getHours();
    if (hour < 10) {
      hour = '0' + hour;
    }

    let minute = time.getMinutes();
    if (minute < 10) {
      minute = '0' + minute;
    }

    date = `${day} ${month} ${year} г. в ${hour}:${minute}`;
    return date
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transaction = document.createElement('div');
    transaction.classList.add('transaction');
    transaction.classList.add('transaction_' + item.type);
    transaction.classList.add('row');

    transaction.innerHTML =  `    
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>`;

    const transactionRemove = transaction.querySelector('.transaction__remove');
    transactionRemove.addEventListener('click', () => {
        this.removeTransaction(transactionRemove.dataset.id);
    });
    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content');
    content.innerHTML = '';
    for (let i = 0; i < data.length; i ++) {
      content.appendChild(this.getTransactionHTML(data[i]));
    }
  }
}