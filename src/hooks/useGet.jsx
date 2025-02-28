import { useEffect, useState } from "react"; // Импорт хуков useEffect и useState

// Пользовательский хук useGet для выполнения GET-запросов
export function useGet(url, token) {
  const [data, setData] = useState(); // Состояние для хранения данных
  const [error, setError] = useState(); // Состояние для ошибок
  const [isLoading, setIsLoading] = useState(); // Состояние загрузки

  useEffect(() => {
    setIsLoading(true); // Устанавливаем состояние загрузки в true перед началом запроса
    
    // Настройки для fetch-запроса
    const options = {
      headers: token // Если передан токен, добавляем заголовок Authorization
        ? {
            Authorization: `Bearer ${token}`, // Форматируем токен
          }
        : {}, // Если токен отсутствует, оставляем заголовки пустыми
    };

    // Выполняем запрос fetch
    fetch(url, options)
      .then((res) => res.json()) // Преобразуем ответ в JSON
      .then((data) => setData(data)) // Сохраняем данные в состояние
      .catch((err) => setError(err)) // В случае ошибки сохраняем ошибку в состояние
      .finally(() => setIsLoading(false)); // Устанавливаем состояние загрузки в false после завершения запроса
  }, [url]); // Хук useEffect будет запускаться при изменении URL

  // Возвращаем объект с данными, ошибкой и состоянием загрузки
  return { data, error, isLoading };
}