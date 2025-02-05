// Функциональный компонент, ничего не принимает и возвращает статичную html-разметку

import React, { Component } from 'react';
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import { apiUrl, apiRoutes } from '../../apiConfig';


const MainPage = () => (
    <div>
        <h2>Добро пожаловать в наше приложение!</h2>
       
         <Link className="App-link" to={apiRoutes.users + '/add'}>
          Регистрация
         </Link>
        <span className="App-logo-box">I love read news!    <img src="logo.png" className="App-logo" alt="React" title="React" /></span>
        <p>Здесь можно посмотреть список новостей и пользователей с сервера, а так же, добавить или удалить новость!</p>

    </div>
);

export default MainPage;

