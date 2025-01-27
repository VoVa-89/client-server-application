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
         console.log(usersList);
            return (
                    <div>
                        <Link className="App-link" to={apiRoutes.users + '/add'}>
                            Добавить пользователя
                        </Link>
        
                        <h3>Список всех пользователей:</h3>
                        {/* console.log(userList); */}
                        {!usersList ? null : usersList.map(user => (
                                <UserCard key={user.id} deleteUsersHandler={deleteUsersHandler} {...user} />
                            ))}
                        </div>
                    )
                }
            }
    

export default UsersList;


//    
        // return !usersList ? null : usersList.map(user => <UserCard key={user.id} {...user} />)
