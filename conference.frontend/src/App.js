//общеий предок - корневой элемент

import React, { Component } from 'react';

//импортируем дополнительные модули, отвечающие за роутинг
import { Router, Route, Switch, Link } from 'react-router-dom';
import createHistory from 'history/createHashHistory'

//импортируем дополнительные модули, отвечающие за работу с API
import { apiUrl, apiRoutes } from './apiConfig';

//импортируем компоненты приложения (MainPage, NewsList, NewsPage, NewsAdd, UsersList)
import MainPage from './components/MainPage'; //функция
import NewsList from './components/NewsList'; // класс
import NewsPage from './components/NewsPage'; //функция
import NewsAdd from './components/NewsAdd'; // класс
import UsersAdd from './components/UsersAdd';
import UsersPage from './components/UsersPage';

import UsersList from './components/UsersList'; // Класс
import './App.css';

const history = createHistory();

class App extends Component { // наш класс
  constructor(props) {
    super(props);

    //создаём два поля в this.state. Это нужно для хранения данных и меморизации
    this.state = {
      newsList: null,
      usersList: null,
    };
  }

  loadNews = () => {  // делает запрос к нашему API и сохраняет новости в this.state.newsList.
    fetch(apiUrl + apiRoutes.news)
      .then(res => res.json())
      .then(res => this.setState({ newsList: res }))
      .catch(error => {
        alert('Ошибка при получении списка новостей');
        console.error(error);
      });
  }

  loadUsers = () => {  // делает запрос к нашему API и сохраняет данные пользователей в this.state.usersList.
    fetch(apiUrl + apiRoutes.users)
      .then(res => res.json())
      .then(res => this.setState({ usersList: res }))
      .catch(error => {
        alert('Ошибка при получении списка пользователей');
        console.error(error);
      });
  }

  renderSingleNews = ({ match }) => { // является, по-сути, функцией высшего порядка, которая получает поле match, 
    // где находится id просматриваемой новости, и возвращает компонент NewsPage, куда передаёт данные этой новости. Участвует в роутинге.
    const { id: currentNewsId } = match.params;

    if (!this.state.newsList) {
      return <p>Новости ещё не загрузились</p>;
    }

    const newsData = this.state.newsList.find(
      news => Number(news.id) === Number(currentNewsId)
    );

    return <NewsPage newsData={newsData} />
  }



  addUsersCallback = (newUsers) => { //чтобы не делать дополнительный запрос на сервер, этот метод добавит в хранилище добавленного user из компонента UsersAdd.
    const { usersList } = this.state;
    this.setState({ newsList: [...usersList, newUsers] });
  }

  deleteUsersHandler = (id) => () => { //метод, который делает запрос на сервер, чтобы удалить новость по её id и удаляет эту Users из локального хранилища (this.state.usersList).
    const requestUrl = apiUrl + apiRoutes.users + `?id=${id}`;
    const { userList } = this.state;
    console.log('deleteUsersHandler requestUrl', requestUrl);

    fetch(requestUrl, { method: 'DELETE' })
      .then(res => {
        const { status } = res;

        if (status < 200 || status > 299) {
          throw new Error(`Ошибка при удалении! Код: ${status}`);
        }

        const cleanUsersList = UsersList.filter(users => users.id !== id);
        this.setState({ usersList: cleanUsersList });

        alert(`Автор с id: ${id} удален!`);
      })
      .catch(error => {
        console.log('catch error');
        console.error(error);
      });
  }

  addNewsCallback = (newNews) => { //чтобы не делать дополнительный запрос на сервер, этот метод добавит в хранилище добавленную новость из компонента NewsAdd.
    const { newsList } = this.state;
    this.setState({ newsList: [...newsList, newNews] });
  }

  deleteNewsHandler = (id) => () => { //метод, который делает запрос на сервер, чтобы удалить новость по её id и удаляет эту новость из локального хранилища (this.state.newsList).
    const requestUrl = apiUrl + apiRoutes.news + `?id=${id}`;
    const { newsList } = this.state;
    console.log('deleteNewsHandler requestUrl', requestUrl);

    fetch(requestUrl, { method: 'DELETE' })
      .then(res => {
        const { status } = res;

        if (status < 200 || status > 299) {
          throw new Error(`Ошибка при удалении! Код: ${status}`);
        }

        const cleanNewsList = newsList.filter(news => news.id !== id);
        this.setState({ newsList: cleanNewsList });

        alert(`Статья с id: ${id} удалена!`);
      })
      .catch(error => {
        console.log('catch error');
        console.error(error);
      });
  }

  render() {
    const { newsList, usersList } = this.state; //В методе render мы получаем два списка с данными с помощью деструктуризации this.state

    return (  //возвращаем html-разметку приложения, где есть хедер
      <div>
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>

        {/* происходит настройка роутинга. */}
        <Router history={history}>
          <div className="App-body">

            {/* компоненты внутренних ссылок  */}
            <nav className="App-nav-bar">
              <Link className="App-nav-item" to='/'>Главная</Link>
              <Link className="App-nav-item" to={apiRoutes.users}>Пользователи</Link>
              <Link className="App-nav-item" to={apiRoutes.news}>Новости</Link>
            </nav>

            <Switch>
              {/* сами роуты. */}
              {/* Роуты будут "срабатывать" в зависимости от изменения URL в приложении и показывать на странице тот или иной компонент, в зависимости от настройке. */}
              <Route exact path='/'>
                <MainPage />
              </Route>

              <Route exact path={apiRoutes.users + '/add'}>
                <UsersAdd addUsersCallback={this.addUsersCallback} />
              </Route>

              <Route exact path={apiRoutes.users}>
                <UsersList loadUsers={this.loadUsers} deleteUsersHandler={this.deleteUsersHandler} usersList={usersList} />
              </Route>
              
              <Route exact path={apiRoutes.news}>
                <NewsList loadNews={this.loadNews} deleteNewsHandler={this.deleteNewsHandler} newsList={newsList} />
              </Route>

              <Route exact path={apiRoutes.news + '/add'}>
                <NewsAdd addNewsCallback={this.addNewsCallback} />
              </Route>

              <Route exact path={apiRoutes.news + '/:id'} component={this.renderSingleNews} />

            </Switch>

          </div>
        </Router>

      </div>
    );
  }
}

export default App;
