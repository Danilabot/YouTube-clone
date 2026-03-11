# YouTube Clone

Полноценный клон YouTube с авторизацией, лайками, подписками и тёмной темой.

## Стек технологий

### Frontend
- React 18 + TypeScript
- Redux Toolkit (управление состоянием)
- React Router v6 (навигация)
- TanStack Query (работа с API)
- CSS Modules + адаптивная верстка
- react-virtualized (виртуальный скролл)
- react-hot-toast (уведомления)

### Backend
- Node.js + Express
- SQLite + Sequelize ORM
- JWT аутентификация
- REST API

### API
- YouTube Data API v3


## Функциональность

### Пользователи
- Регистрация / Вход / Выход
- Профиль пользователя
- Сохранение сессии через JWT

### Взаимодействие с видео
- Лайки / Дизлайки (с сохранением в БД)
- Сохранение видео в "Сохранённые"
- Просмотр сохранённых видео
- Кэширование запросов через TanStack Query

### Каналы
- Страница канала с информацией
- Подписка / Отписка на каналы
- Список подписок в сайдбаре
- Видео канала

### Поиск
- Поиск видео по названию
- Отдельная страница результатов
- Результаты с пагинацией

### Комментарии
- Просмотр комментариев к видео
- Лайки комментариев

### Интерфейс
- Адаптивный дизайн (десктоп / планшет / мобильный)
- Тёмная / светлая тема (с сохранением в localStorage)
- Скелетоны при загрузке
- Виртуальный скролл для главной страницы

### Оптимизация
- React.memo для тяжёлых компонентов
- useCallback / useMemo
- TanStack Query (кэширование)
- Ленивая загрузка страниц (React.lazy)
- Debounce для поиска

---

## Установка и запуск

### 1. Клонировать репозиторий
```bash
git clone https://github.com/your-username/youtube-clone.git
cd youtube-clone
```

### 2. Установить зависимости

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd auth-backend
npm install
```

### 3. Настройка

Создать файл `.env` в папке `auth-backend`:
JWT_SECRET=your_secret_key


### 4. Запуск

**Backend:**
```bash
cd auth-backend
npm run dev
```

**Frontend:**
```bash
npm run dev
```



## Планы по развитию

- RTK Query (замена TanStack Query)
- Бесконечный скролл на главной
- Загрузка видео на канал
- Плейлисты
- Тесты (Jest + React Testing Library)

---

## Автор

Соловьёв Данила Дмитриевич  
GitHub: Danilabot 