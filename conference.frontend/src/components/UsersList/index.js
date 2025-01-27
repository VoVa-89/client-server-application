// Компонент на основе класса. Не имеет локального стейта или методов. Сделан именно на основе класса из-за необходимости работы с методом componentDidMount. 
// Работает по аналогии с компонентом NewsList.
//Список пользователей

import React, { Component } from 'react';
import UserCard from '../UserCard';
import { Link } from 'react-router-dom';

import { apiRoutes } from '../../apiConfig';

class UsersList extends Component {

    componentDidMount() {
        if (!this.props.usersList) {
            this.props.loadUsers();
        }
    }

    render() {
        const { usersList, deleteUsersHandler } = this.props;

        return (
            <div>
                <Link className="App-link" to={apiRoutes.users + '/add'}>
                    Добавить пользователя
                </Link>

                <h3>Список всех новостей:</h3>

                {!usersList ? null : usersList.map(users => (
                    <UserCard key={users.id} deleteUsersHandler={deleteUsersHandler} {...users} />
                ))}
            </div>
        )
    }

}

export default UsersList;