import React from 'react';

const UsersPage = (props) => (
    <div>
        <h2>{props.usersData.Login}</h2>
        <h2>Автор: {props.usersData.Name}</h2>
        <p>{props.usersData.Password}</p>
    </div>
);

export default UsersPage;