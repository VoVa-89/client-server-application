<?php

//Этот обработчик должен брать данные на сервере и возвращать их.
//принимает два аргумента, это $route, по которому мы будем искать, и $params - прочие параметры, которые мы будем передавать в обработчик.
function getData($route, $params = [])
{
    $filePath = makeRoutePath($route); //создаём путь до файла с данными по переданному роуту.

    if (!file_exists($filePath)) { // проверка на существование этого файла и, если его нет, то мы возвращаем ошибку 404 с текстом Not found.
        http_response_code(404);
        exit('Not found');
    }

    $dataJSON = file_get_contents($filePath); //преобразуем в строку
    $data = json_decode($dataJSON, true); //конвертируем полученный JSON-файл с данными в php-массив

    //делаем проверку на существование поля id в переданном массиве $params. Если он там есть, то это означает, 
    //что запрос был выполнен на сервер таким образом: http://conference.backend/news?id=1 (например id=1).
    //Это будет означать, что нужно вернуть только новость с id 1, иначе - вернуть все.
    if (!empty($params['id'])) {
        $id = $params['id'];
        return array_find($data, function ($element) use ($id) {
            return (int) $element['id'] === (int) $id;
        });
    }

    return $data; //иначе - вернуть все данные.
}

function postData($route, $params = [])
{
    $filePath = makeRoutePath($route);

    if (!file_exists($filePath)) {
        http_response_code(404);
        exit('Not found');
    }

    $dataJSON = file_get_contents($filePath);
    $data = json_decode($dataJSON, true);
    $newData = []; //  инициализируем переменную, куда будут добавлены данные для записи в файл.

    switch ($route) { // обработка роутов.
        case 'news': {
                //проверяет наличие всех необходимых полей, переданных в переменной $params
                if (empty($params['title']) || empty($params['text']) || empty($params['author'])) {
                    http_response_code(400); //если чего-то не хватает, возвращает ошибку 400, обозначающую проблему в запросе
                    exit('Request error');
                }

                $newData = [ //Записывает в переменную $newData новые данные для записи.
                    'title' => $params['title'],
                    'text' => $params['text'],
                    'author' => $params['author'],
                ];

                break;
            }

        case 'users': {
                if (empty($params['login']) || empty($params['name']) || empty($params['password'])) {
                    http_response_code(400);
                    exit('Request error');
                }

                $newData = [
                    'login' => $params['login'],
                    'name' => $params['name'],
                    'password' => $params['password'],
                ];

                break;
            }
    }
    // создаст новый id для новой записи, взяв id последней записи в массиве $data и прибавив к нему 1.
    $lastDataId = $data[count($data) - 1]['id'];
    $newData['id'] = ++$lastDataId;
    //новые записи добавляются в конец массива $data
    $data[] = $newData;

    //происходит запись в файл, где хранятся эти данные.
    $dataToWriteJSON = json_encode($data, JSON_UNESCAPED_UNICODE); //преобразуем массив в строку JSON. JSON
    $writeReslt = file_put_contents($filePath, $dataToWriteJSON); // записываем строки в файл

    if (!$writeReslt) {
        http_response_code(500);
        echo 'Internal server error';
        exit;
    }

    return $newData;
}

function deleteData($route, $params = [])
{
    $filePath = makeRoutePath($route);

    if (!file_exists($filePath)) {
        http_response_code(404);
        exit('Not found');
    } else if (empty($params['id'])) {
        http_response_code(400);
        exit('Request error');
    }

    $dataJSON = file_get_contents($filePath);
    $data = json_decode($dataJSON, true);
    $deletableId = $params['id'];

    // происходит поиск той записи, которую нужно удалить с помощью нашей вспомогательной функции array_find() и запись сохраняется в переменную $dataToDelete.
    $dataToDelete = array_find($data, function ($element) use ($deletableId) {
        return (int) $element['id'] === (int) $deletableId;
    });

    if (empty($dataToDelete)) { //проверяем, найден ли файл
        http_response_code(404);
        exit('Not found');
    }

    //После этого, мы фильтруем наш исходный массив с помощью встроенной в php функции array_filter() и обновленныё результат записываем в файл.
    $resultData = array_filter($data, function ($element) use ($deletableId) {
        return (int) $element['id'] !== (int) $deletableId;
    });

    $dataToWriteJSON = json_encode($resultData, JSON_UNESCAPED_UNICODE);
    $writeReslt = file_put_contents($filePath, $dataToWriteJSON);

    if (!$writeReslt) {
        http_response_code(500);
        echo 'Internal server error';
        exit;
    }

    return $dataToDelete;
}
//функция принимает 1 аргумент (строку) и делает путь до нашей директории data. При этом, роутом должно быть название 
//нужного файла без расширения (без .json в конце). Возвращает функция строку, являющуюся абсолютным путём до директории с файлами. 
//При этом, мы используем суперглобальную переменную __DIR__, с помощью которой нам не важно, какая OS используется на сервере, путь будет корректным.
function makeRoutePath($route)
{
    $filenameJson = $route . '.json';
    $dataDirPath = __DIR__ . '/data/';
    return $dataDirPath . $filenameJson;
}

//функция принимает два аргумента, это массив $haystack, в котором мы будем что-то искать, и функция $callback, 
//которая будет следить за корректностью поиска. Внутри функции мы перебираем входящий массив с помощью цикла foreach, 
//внутри мы выполняем нашу функцию $callback и делаем проверку, если функция вернула истину, мы возвращаем элемент, 
//на котором находимся, прерывая выполнение цикла. Это значит, что функция $callback проверяет соответствие элемента нашему сложному условию, находящемуся в функции.
function array_find($haystack, $callback)
{
    foreach ($haystack as $element)
        if ($callback($element))
            return $element;
}
