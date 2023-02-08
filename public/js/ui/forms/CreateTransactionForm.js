/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const dataUser = User.current();

    if (dataUser) {
    Account.list(dataUser, (err, response) => {
      if (response.success) {
        const select = this.element.querySelector('.accounts-select')

        for (let i = 0; i < response.data.length; i ++) {
          const optionList = document.createElement('option');
          optionList.value = response.data[i].id;
          optionList.textContent = response.data[i].name;
          select.appendChild(optionList);
        }
      }
    })
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    data.sum = Number(data.sum);
    console.log(data.sum);
    Transaction.create(data, (err, response) => {
      if (response.success) {
        console.log(data.type);
        const id = 'new-' + data.type + '-form';
        const transactionForm = document.getElementById(id);
        transactionForm.reset();

        const modalId = transactionForm.closest('.modal').dataset.modalId
        App.getModal(modalId).close();

        App.update();
      } else {
        alert(response.error);
      }
    })
  }
}