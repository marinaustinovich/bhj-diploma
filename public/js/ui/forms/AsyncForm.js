/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("переданный элемент не существует");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    const id = this.element.id
    const btnPrimary = document.querySelector(`.btn[form=${id}]`);
    btnPrimary.addEventListener('click', this.submit);
  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData(form) {
    const formData = new FormData(form);

    const entries = formData.entries();
    let data = {};
    for (let item of entries) {
      const key = item[0];
      const value = item[1];
      data[key] = value;
    }
    return data;
  }

  onSubmit(options){
    console.log(options); // для кажджой формы свой метод, надо еще дописать
  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit(e) {
    e.preventDefault();
    const form = e.currentTarget.form;

    const asyncForm = new AsyncForm(form);
    const dataForm = asyncForm.getData(form);

   asyncForm.onSubmit(dataForm);
  }
}