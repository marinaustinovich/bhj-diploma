/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
    onSubmit(options) {
    User.register(options,(err, response) => {
          if (response.success) {
            const registerForm = document.getElementById('register-form');
            registerForm.reset();
            App.setState('user-logged');
            const modalId = registerForm.closest('.modal').dataset.modalId
            App.getModal(modalId).close();
          }
        }
    );
  }

}