// Контролируемый компонент на основе класса. Компонент добавления новостей. В конструкторе создаётся this.state со следующими полями:

// title - заголовок добавляемой новости
// author - автор добавляемой новости
// text - текст добавляемой новости
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

class NewsAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            author: '',
            text: '',
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

        const { title, author, text } = this.state;
        const { addNewsCallback } = this.props;

        if ([title, author, text].some(el => !el.length)) {
            return this.setState({ error: 'Заполните все поля!', messages: '' });
        }

        const requestUrl = apiUrl + apiRoutes.news + `?title=${title}&author=${author}&text=${text}`;

        fetch(requestUrl, { method: 'POST' })
            .then(res => {
                const { status } = res;

                if (status < 200 || status > 299) {
                    throw new Error(`Ошибка при добавлении новости. Код ${status}`);
                }

                return res.json();
            })
            .then(addedNews => {
                addNewsCallback(addedNews);
                this.setState({
                    title: '',
                    author: '',
                    text: '',
                    messages: 'Новость успешно добавлена!',
                    error: '',
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: error.message, messages: '' });
            });
    }

    render() {
        const { title, author, text, messages, error } = this.state;

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
                        name="title"
                        placeholder="Заголовок"
                        onChange={this.onChangeHandler}
                        value={title}
                    />
                </label>

                <label className="App-label">
                    Автор:
                    <input
                        className="App-input-field"
                        name="author"
                        placeholder="Автор"
                        onChange={this.onChangeHandler}
                        value={author}
                    />
                </label>

                <label className="App-label">
                    Текст:
                    <textarea
                        className="App-input-field"
                        name="text"
                        placeholder="Текст"
                        onChange={this.onChangeHandler}
                        value={text}
                    />
                </label>

                <button
                 type="submit"
                 style={{"background-color":
                    title.length < 3       ?
                    "rgb(229, 229, 229)" :
                    author.length < 3  ?
                    "rgb(229, 229, 229)" :
                    text.length < 3    ?
                    "rgb(229, 229, 229)" :
                    "rgb(176, 243, 71)"}}
>
                    Добавить
                </button>
            </form>
        );
    }
}

export default NewsAdd;