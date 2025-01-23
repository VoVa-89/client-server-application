import React from 'react';

const UsersCard = (props) => (
    <div>
      <h2>Логин: {props.Login}</h2>
      <h2>Имя: {props.Name}</h2>
      <h2>Пароль: {props.Password}</h2>
    </div>
);

export default UsersCard;