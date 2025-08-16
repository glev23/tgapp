#!/bin/bash

echo "🚀 Деплой на GitHub Pages"

# Проверяем, что мы в корневой директории проекта
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Запустите скрипт из корневой директории проекта"
    exit 1
fi

# Собираем веб-приложение
echo "🔨 Сборка веб-приложения..."
cd apps/web
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки"
    exit 1
fi

echo "✅ Сборка завершена"

# Создаем временную директорию для деплоя
echo "📁 Подготовка файлов для деплоя..."
cd ../..
DEPLOY_DIR="deploy-gh-pages"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Копируем собранные файлы
cp -r apps/web/dist/* $DEPLOY_DIR/

echo "📋 Файлы готовы для деплоя:"
ls -la $DEPLOY_DIR/

echo ""
echo "🎯 Следующие шаги:"
echo "1. Создайте репозиторий на GitHub"
echo "2. Скопируйте файлы из папки '$DEPLOY_DIR' в репозиторий"
echo "3. Настройте GitHub Pages в Settings → Pages"
echo ""
echo "📁 Файлы для загрузки находятся в папке: $DEPLOY_DIR"
echo ""
echo "💡 Или используйте команды:"
echo "cd $DEPLOY_DIR"
echo "git init"
echo "git add ."
echo "git commit -m 'Initial commit'"
echo "git remote add origin https://github.com/username/repository.git"
echo "git push -u origin main" 