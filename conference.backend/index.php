<?php
require_once 'functions.php';
header('Access-Control-Allow-Origin: *'); //чтобы защита браузера не мешала обращаться к нашему бекенду, при чём здесь звёздочка означает вообще все возможные домены.
//!!!В реальных приложениях лучше ограничивать только своими доменами или вообще чтобы бекенд и фронтенд находились на одном домене.!!!!!
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE'); //позволяет защите браузера корректно обрабатывать запросы с перечисленными методами.
header('Content-Type: application/json');

try {
    if (empty($_GET['page'])) {
        http_response_code(404); // смотрит, был ли вообще добавлен какой-то роут, если нет, возвращает ошибку 404.
        exit('Not found');
    }

    $route = $_GET['page']; //сохраняем название роута в переменную
    $data; //  инициализируем переменную $data/, куда мы запишем данные, полученные после обработки запроса и вернём их на клиент

    switch ($_GET['method']) { //обрабатываем каждый метод запроса по-своему.
        case 'GET': {
                $data = getData($route, $_GET);
                break;
            }

        case 'POST': {
                $data = postData($route, $_GET);
                break;
            }

        case 'DELETE': {
                $data = deleteData($route, $_GET);
                break;
            }

        case 'OPTIONS': {  // Запрашивает поддерживаемые методы для ресурса. Этот метод используется для определения возможностей сервера.
                $data = ['auth' => true];
            }
    }

    if (empty($data)) { // проверяем, появилось ли что-то в переменной $data, если да, возвращаем это. Данные в эту переменную записываются с помощью обработчиков, находящихся в файле functions.php
        http_response_code(404);
        exit('Not found');
    }

    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} catch (Exception $error) {
    http_response_code(500);
    exit('Internal server error');
}
