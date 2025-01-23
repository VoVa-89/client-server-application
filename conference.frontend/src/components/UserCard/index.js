import React from 'react';

const UsersCard = (props) => (
  <div>
    <h2>Логин: {props.login}</h2>
    <h2>Имя: {props.name}</h2>
    <h2>Пароль: {props.password}</h2>
  </div>
);

export default UsersCard;