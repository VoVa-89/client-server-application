// Функциональный компонент, принимает данные пользователя - login, name, password. Возвращает разметку записи о пользователе.

import React from 'react';

const UserCard = (props) => (
  <div>
    <h3>Логин: {props.login}</h3>
    <h5>Имя: {props.name}</h5>
    <p>Пароль: {props.password}</p>
    <div className="App-delete-btn" onClick={props.deleteUsersHandler(props.id)}>
      Удалить
    </div>
  </div>
);

export default UserCard;