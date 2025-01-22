//Импортируются React, ReactDOM, корневой компонент (App.js), общий файл со стилями
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

//Вызывается метод ReactDOM.render(), в который мы передаём наш корневой компонент и элемент, найденный по ID 'root'
ReactDOM.render(<App />, document.getElementById('root'));


//Примечание!
// Библиотека React.js не умеет рисовать ничего на странице.
// Основная задача библиотеки - создавать виртуальное DOM-дерево 
// и ОЧЕНЬ быстро вносить в него изменения!

// За создание и изменение элементов в браузере отвечает библиотека ReactDOM