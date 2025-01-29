// Функциональный компонент, ничего не принимает и возвращает статичную html-разметку

import React, { Component } from 'react';
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import { apiUrl, apiRoutes } from '../../apiConfig';


const MainPage = () => (
    <div>
        <h1>Добро пожаловать в наше приложение!</h1>
        {/* <button>Регистрация</button>  */}
         <Link className="App-link" to={apiRoutes.users + '/add'}>
          Регистрация
         </Link>
        <span className="App-logo-box">I love <img src={logo} className="App-logo" alt="React" title="React" />.js</span>
        <p>Здесь можно посмотреть список новостей и пользователей с сервера, а так же, добавить или удалить новость!</p>

    </div>
);

export default MainPage;