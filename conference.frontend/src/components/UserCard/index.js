import React from 'react';
import { Link } from 'react-router-dom';
import { apiRoutes } from '../../apiConfig';

 // Функциональный компонент, принимает данные пользователя - login, name, password. Возвращает разметку записи о пользователе. 
  
const UserCard = (props) => ( 
  <div> 
    <h3>Логин: {props.Login}</h3> 
    <h5>Имя: {props.Name}</h5> 
    <p>Пароль: {props.Password}</p> 
    <div className="App-delete-btn" onClick={props.deleteUsersHandler(props.id)}> 
      Удалить 
    </div> 
  </div> 
); 
 
export default UserCard;
 