// Контролируемый компонент на основе класса. Компонент добавления gjkmpjdfntktq. В конструкторе создаётся this.state со следующими полями:
// login - логин пользователя
// name - имя пользователя
// password - пароль пользователя
// messages - текст возможных сообщений
// error - текст возможных ошибок
// Почему "Контролируемый компонент"? Этот компонент генерирует html-форму. При изменении значений в любом из полей формы, происходит изменение состояния компонента и 
// его перерисовка. Поэтому, все значения из полей ввода хранятся в this.state. Это удобно для дальнейшей обработки данных.

// Компонент содержит методы:

// onChangeHandler - обрабатывает изменения в полях ввода, принимает один аргумент - объект события, извлекает из него поля name и value, в которых будет содержаться имя 
// изменяемого поля и его значение, и сохраняет значение в локальном состоянии.
// onSubmitHandler - обрабатывает событие submit формы, прерывает действие по умолчанию извлекает данные из this.state, получает метод добавления статей в список предка и 
// делает проверку полей на наполненость. Если значение хотя бы одного из полей имеет длину 0, то прерывает выполнение обработчика события и помещает в локальный стейт текст 
// об ошибке, который будет выведен на страницу. Если ошибки нет, создаёт URL для обращения к серверу, куда помещает данные в query-параметры и делает запрос к серверу с 
// методом POST. Если сервер ответил статусом, отличным от 200-299, то выкидывает ошибку. Если ошибки нет, то полученные данные преобразует в js-объект и передаёт дальше по цепочке. Если всё хорошо, вызывается метод предка, для добавления новой статьи в локальный стейт и очищает данные формы из своего стейта и помещает туда сообщение об успешном добавлении. Если же вдруг возникла ошибка, добавляет текст ошибки в соответствующее поле стейта.
// Получилось объёмно по последнему методу (есть смысл разбить его на несколько мелких методов).

// В методе render() мы сперва извлекаем данные стейта для дальнейшего их рендеринга. Элементу формы назначаем обработчик события submit, делаем проверку переменной messages, 
// если она не пуста - выводим сообщение. Аналогично с ошибками. Далее мы создаём поля ввода, где назначаем им обработчик события ввода и задаём значение из стейта.


import React, { Component } from 'react';

import { apiUrl, apiRoutes } from '../../apiConfig';

class UsersAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            name: '',
            password: '',
            messages: '',
            error: '',
        }
    }

    onChangeHandler = (event) => {
        const { name, value } = event.currentTarget;
        this.setState({ [name]: value });
        //Метод render() вызывается каждый раз, когда вызывается метод this.setState()
        //что заставляет компонент перерисовываться!
        //Будьте с этим аккуратнее и не допускайте бесконечных циклов перерисовки!
    }

    onSubmitHandler = (event) => {
        event.preventDefault();

        const { login, name, password } = this.state;
        const { addUsersCallback } = this.props;

        if ([login, name, password].some(el => !el.length)) {
            return this.setState({ error: 'Заполните все поля!', messages: '' });
        }

        const requestUrl = apiUrl + apiRoutes.users + `?login=${login}&name=${name}&password=${password}`;

        fetch(requestUrl, { method: 'POST' })
            .then(res => {
                const { status } = res;

                if (status < 200 || status > 299) {
                    throw new Error(`Ошибка при добавлении пользователя. Код ${status}`);
                }

                return res.json();
            })
            .then(addedUsers => {
                addUsersCallback(addedUsers);
                this.setState({
                    login: '',
                    name: '',
                    password: '',
                    messages: 'Пользователь успешно добавлен!',
                    error: '',
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: error.message, messages: '' });
            });
    }

    render() {
        const { login, name, password, messages, error } = this.state;
        return (
            <form onSubmit={this.onSubmitHandler}>

                {!messages ? null : (
                    <p className="App-messages-box">
                        {messages}
                    </p>
                )}

                {!error ? null : (
                    <p className="App-error-box">
                        Ошибка! {error}
                    </p>
                )}


                <label className="App-label">
                    Логин:
                    <input
                        className="App-input-field"
                        name="login"
                        placeholder="Логин"
                        onChange={this.onChangeHandler}
                        value={login}
                       
                    />
                </label>

                <label className="App-label">
                    Имя:
                    <input
                        className="App-input-field"
                        name="name"
                        placeholder="Имя"
                        onChange={this.onChangeHandler}
                        value={name}
                    />
                </label>

                <label className="App-label">
                    Пароль:
                    <textarea
                        className="App-input-field"
                        name="password"
                        placeholder="Пароль"
                        onChange={this.onChangeHandler}
                        value={password}
                    />
                </label>

                <button 
                type="submit"
                    style={{"background-color": login.length < 3       ?
                    "rgb(229, 229, 229)" :
                    name.length < 3  ?
                    "rgb(229, 229, 229)" :
                    password.length < 3    ?
                    "rgb(229, 229, 229)" :
                    "rgb(176, 243, 71)"}}

                > Добавить </button>
  
            </form>
        );
    
    }
}

export default UsersAdd;