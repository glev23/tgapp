# 🚀 Инструкция по деплою на бесплатные платформы

## 📋 Подготовка проекта

### 1. **Сборка веб-приложения**
```bash
cd apps/web
npm run build
```

### 2. **Проверка собранных файлов**
```bash
ls -la dist/
# Должны быть: index.html, assets/, images/
```

## 🌐 GitHub Pages (Бесплатно)

### 1. **Создайте репозиторий на GitHub**
- Имя: `yourusername.github.io` (для личного сайта)
- Или любой другой репозиторий

### 2. **Создайте ветку gh-pages**
```bash
git checkout -b gh-pages
```

### 3. **Скопируйте собранные файлы**
```bash
# В корень репозитория
cp -r apps/web/dist/* .
```

### 4. **Загрузите на GitHub**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### 5. **Настройте GitHub Pages**
- Settings → Pages
- Source: Deploy from a branch
- Branch: gh-pages
- Folder: / (root)

### 6. **Ваш сайт будет доступен по адресу:**
- `https://yourusername.github.io` (если репозиторий yourusername.github.io)
- `https://yourusername.github.io/repository-name` (для других репозиториев)

## 🔥 Netlify (Бесплатно)

### 1. **Зарегистрируйтесь на netlify.com**

### 2. **Подключите GitHub репозиторий**
- New site from Git
- Connect to GitHub
- Выберите ваш репозиторий

### 3. **Настройте сборку:**
```
Build command: npm run build
Publish directory: apps/web/dist
```

### 4. **Деплой произойдет автоматически**

### 5. **Получите бесплатный домен:**
- `https://your-site-name.netlify.app`
- Или настройте свой домен

## 🚀 Vercel (Бесплатно)

### 1. **Зарегистрируйтесь на vercel.com**

### 2. **Подключите GitHub репозиторий**
- Import Project
- Import Git Repository
- Выберите ваш репозиторий

### 3. **Настройте проект:**
```
Framework Preset: Vite
Root Directory: apps/web
Build Command: npm run build
Output Directory: dist
```

### 4. **Автоматический деплой**

### 5. **Получите домен:**
- `https://your-project.vercel.app`

## 📁 Структура для деплоя

### GitHub Pages (простой способ):
```
yourusername.github.io/
├── index.html
├── assets/
│   ├── index-*.css
│   └── index-*.js
└── images/
    └── *.svg
```

### Netlify/Vercel:
```
your-repo/
├── apps/
│   └── web/
│       ├── src/
│       ├── package.json
│       ├── vite.config.ts
│       └── dist/ (создается при сборке)
└── README.md
```

## ⚠️ Важные моменты

### 1. **API URL**
В `apps/web/src/lib/api.ts` измените базовый URL:
```typescript
// Для GitHub Pages
export const API_BASE_URL = 'https://your-api-domain.com/api'

// Для Netlify/Vercel
export const API_BASE_URL = 'https://your-api-domain.com/api'
```

### 2. **Base URL для Vite**
В `apps/web/vite.config.ts` добавьте:
```typescript
export default defineConfig({
  base: '/repository-name/', // для GitHub Pages
  // или
  base: '/', // для Netlify/Vercel
  // ... остальные настройки
})
```

### 3. **CORS настройки**
Убедитесь, что ваш API разрешает запросы с нового домена.

## 🎯 Рекомендации

1. **Начните с GitHub Pages** - самый простой способ
2. **Netlify** - отличный выбор для статических сайтов
3. **Vercel** - лучший для React/Vue приложений
4. **Все платформы бесплатны** для небольших проектов

## 🔗 Полезные ссылки

- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html) 