/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
    /**
     * Производит авторизацию с помощью User.login
     * После успешной авторизации, сбрасывает форму,
     * устанавливает состояние App.setState( 'user-logged' ) и
     * закрывает окно, в котором находится форма
     * */
    onSubmit(options) {
        User.login(options,(err, response) => {
                if (response.success) {
                    const loginForm = document.getElementById('login-form');
                    loginForm.reset();

                    const modalId = loginForm.closest('.modal').dataset.modalId
                    App.getModal(modalId).close();

                    App.setState('user-logged');
                }
            }
        );
    }

}