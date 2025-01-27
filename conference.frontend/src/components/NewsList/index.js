// Компонент на основе класса. Перед тем, как отрисовать компонент, проверяет, был ли передан список с новостями. Если нет - вызывает функцию загрузки новостей из 
// родительского компонента. Эта функция изменит состояние родителя, что заставит компонент перерисовать себя.

// В методе render() компонента мы получаем список новостей и переданную функцию удаления новостей. Добавляем ссылку на добавление новости после чего делаем проверку, 
// если у нас нет списка новостей, то компонент возвращает null, чтобы ничего не отрисовать, если список есть, то генерируем массив из компонентов NewsCard с данными каждой статьи.

import React, { Component } from 'react';
import NewsCard from '../NewsCard';
import { Link } from 'react-router-dom';

import { apiRoutes } from '../../apiConfig';

class NewsList extends Component {

    componentDidMount() {
        if (!this.props.newsList) {
            this.props.loadNews();
        }
    }

    render() {
        const { newsList, deleteNewsHandler } = this.props;
        return (
            <div>
                <Link className="App-link" to={apiRoutes.news + '/add'}>
                    Добавить новость
                </Link>

                <h3>Список всех новостей:</h3>

                {!newsList ? null : newsList.map(news => (
                    <NewsCard key={news.id} deleteNewsHandler={deleteNewsHandler} {...news} />
                ))}
            </div>
        )
    }
}

export default NewsList;