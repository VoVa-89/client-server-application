import React, { Component } from 'react';
import { apiUrl, apiRoutes } from '../../apiConfig';

class UsersAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Login: '',
            Name: '',
            Password: '',
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

        const { Login, Name, Password } = this.state;
        const { addUsersCallback } = this.props;

        if ([Login, Name, Password].some(el => !el.length)) {
            return this.setState({ error: 'Заполните все поля!', messages: '' });
        }

        const requestUrl = apiUrl + apiRoutes.users + `?Login=${Login }&Name=${ Name }&Password=${ Password}`;

        fetch(requestUrl, { method: 'POST' })
            .then(res => {
                const { status } = res;

                if (status < 200 || status > 299) {
                    throw new Error(`Ошибка при добавлении новости. Код ${status}`);
                }

                return res.json();
            })
            .then(addedUsers => {
                addUsersCallback(addedUsers);
                this.setState({
                    Login: '',
                    Name: '',
                    Password: '',
                    messages: 'Регистрация прошла успешно!',
                    error: '',
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: error.message, messages: '' });
            });
    }

    render() {
        const { Login, Name, Password, messages, error } = this.state;

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
                    Заголовок:
                    <input
                        className="App-input-field"
                        name="Login"
                        placeholder="Login"
                        onChange={this.onChangeHandler}
                        value={Login}
                    />
                </label>

                <label className="App-label">
                    Автор:
                    <input
                        className="App-input-field"
                        name="Name"
                        placeholder="Name"
                        onChange={this.onChangeHandler}
                        value={Name}
                    />
                </label>

                <label className="App-label">
                    Текст:
                    <textarea
                        className="App-input-field"
                        name="Password"
                        placeholder="Password"
                        onChange={this.onChangeHandler}
                        value={Password}
                    />
                </label>

                <button type="submit">
                    Добавить
                </button>
            </form>
        );
    }
}

export default UsersAdd;