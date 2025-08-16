# Radisson Hotels & Resorts App

Веб-приложение для Radisson Hotels & Resorts с карточками услуг.

## Технологии

- React 18
- CSS3
- SF Pro Text шрифты
- Docker
- Nginx

## Запуск с Docker

### Требования
- Docker
- Docker Compose

### Быстрый запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd raddisson-tg-app
```

2. Запустите приложение:
```bash
docker-compose up -d
```

3. Откройте браузер и перейдите по адресу:
```
http://localhost:3000
```

### Команды Docker

**Сборка и запуск:**
```bash
docker-compose up --build
```

**Остановка:**
```bash
docker-compose down
```

**Просмотр логов:**
```bash
docker-compose logs -f
```

**Пересборка:**
```bash
docker-compose down
docker-compose up --build
```

## Разработка

### Локальный запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите в режиме разработки:
```bash
npm start
```

3. Откройте http://localhost:3000

### Сборка для продакшена

```bash
npm run build
```

## Структура проекта

```
src/
├── components/          # React компоненты
│   └── ContentMiddleIos/
├── screens/            # Экраны приложения
│   └── Store/
├── images/             # Изображения
├── fonts/              # Шрифты SF Pro Text
├── fonts.css           # Подключение шрифтов
└── App.js              # Главный компонент
```

## Особенности

- ✅ Адаптивный дизайн
- ✅ Красивые карточки с изображениями
- ✅ Шрифты SF Pro Text
- ✅ Docker контейнеризация
- ✅ Nginx для продакшена
- ✅ Оптимизация производительности

## Лицензия

MIT
