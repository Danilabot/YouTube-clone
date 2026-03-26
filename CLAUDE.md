# DanyTube — YouTube Clone

## Структура проекта

Монорепо из двух независимых приложений:

```
danytube/
├── youtube-clone/     # Фронтенд (Vite + React 19 + TypeScript/JSX)
│   ├── src/
│   │   ├── api/           # API-функции (likes, dislikes, saved, comments)
│   │   │   └── config.ts  # API_BASE_URL — единая точка конфигурации URL бэкенда
│   │   ├── Components/    # UI-компоненты
│   │   │   ├── Authhorization/  # Login (TSX), Registration (JSX)
│   │   │   ├── Feed/            # Лента видео (YouTube Data API v3)
│   │   │   ├── PlayVideo/       # Страница видео
│   │   │   ├── LikeWeb/         # Лайки/дизлайки (видео + комментарии)
│   │   │   ├── SaveButton/      # Сохранение видео
│   │   │   ├── SubscribeButton/ # Подписки
│   │   │   ├── SubscriptionList/# Список подписок
│   │   │   ├── Sidebar/         # Боковая панель
│   │   │   ├── Navbar/          # Верхняя навигация
│   │   │   ├── MobileNavbar/    # Мобильная навигация
│   │   │   ├── Profile/         # Профиль пользователя
│   │   │   ├── Recommended/     # Рекомендации
│   │   │   └── AppRouter/       # Роутинг
│   │   ├── context/       # AuthProvider (React Context) — дублирует Redux auth
│   │   ├── redux/         # Redux Toolkit (authSlice + hooks)
│   │   ├── UI/            # Переиспользуемые UI-компоненты (Input, Modal, Loader)
│   │   └── utils/         # Утилиты (API_KEY YouTube, форматирование)
│   ├── vercel.json        # Vercel конфиг: SPA rewrites
│   └── vite.config.js     # Vite конфиг
│
└── auth-backend/      # Бэкенд авторизации (Express + Sequelize + SQLite)
    ├── src/
    │   ├── app.js              # Express app, CORS, маршруты, lazy DB init
    │   ├── config/database.js  # Sequelize + SQLite (/tmp на Vercel)
    │   ├── controllers/        # authController, likeController, dislikeController, savedVideoController, commentLikeController
    │   ├── middleware/         # auth (JWT protect), validate (input validation)
    │   ├── models/             # User, Like, Dislike, Subscription, SavedVideo, CommentLike
    │   └── routes/             # authRoutes, likeRoutes, dislikeRoutes, Subscriptions, commentLikeRoutes, savedVideoRoutes
    ├── server.js               # Точка входа для локальной разработки (порт 5000)
    └── vercel.json             # Vercel конфиг: serverless Express

```

## Технологии

- **Фронтенд**: Vite 7, React 19, TypeScript, React Router 7, Redux Toolkit, TanStack Query, react-window (виртуализация)
- **Бэкенд**: Express 4, Sequelize 6, SQLite3, JWT (jsonwebtoken), bcryptjs
- **Деплой**: Vercel (фронт — статика, бэк — serverless functions)

## API-конфигурация

Все API-запросы к бэкенду идут через `API_BASE_URL` из `youtube-clone/src/api/config.ts`.
Переменная окружения `VITE_API_URL` задает URL бэкенда. Fallback: `http://localhost:5000`.

## API-маршруты бэкенда

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/profile` — профиль (JWT)
- `PUT /api/auth/profile` — обновление профиля (JWT)
- `POST /api/auth/logout` — выход (JWT)
- `GET/POST /api/videos/:id/like` — лайки видео
- `GET/POST /api/videos/:id/dislike` — дизлайки видео
- `GET/POST/DELETE /api/subscriptions/:channelId` — подписки
- `GET /api/subscriptions/my` — мои подписки
- `GET/POST /api/comments/:id/like` — лайки комментариев
- `GET/POST/DELETE /api/saved/:videoId` — сохраненные видео
- `GET /api/health` — health check

## Деплой на Vercel

Деплоятся как **два отдельных проекта** на Vercel:

### 1. auth-backend
```bash
cd danytube/auth-backend
vercel
```
Env vars в Vercel Dashboard: `JWT_SECRET`, `NODE_ENV=production`

### 2. youtube-clone
```bash
cd danytube/youtube-clone
vercel
```
Env vars в Vercel Dashboard: `VITE_API_URL=https://<auth-backend-url>.vercel.app`

## Важные нюансы

- SQLite на Vercel пишет в `/tmp` — данные **не персистентны** между cold starts. Для продакшена нужно мигрировать на PostgreSQL (Vercel Postgres / Neon / Supabase).
- Смешанный стек: часть компонентов `.tsx`, часть `.jsx` — исторически сложилось.
- Авторизация дублируется: есть и React Context (`AuthProvider`) и Redux (`authSlice`). Redux — основной.
- YouTube Data API v3 ключ хранится в `utils/data.js`.
