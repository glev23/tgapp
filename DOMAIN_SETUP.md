# Настройка домена tg.raddison_two.novaml.ru

## 🚀 Быстрый запуск

1. **Убедитесь, что Docker запущен**
2. **Запустите скрипт:**
   ```bash
   chmod +x start-with-domain.sh
   ./start-with-domain.sh
   ```

## 🌐 Настройка DNS

Убедитесь, что домен `tg.raddison_two.novaml.ru` указывает на IP-адрес вашего сервера:

```bash
# Проверьте текущий DNS
nslookup tg.raddison_two.novaml.ru

# Или используйте dig
dig tg.raddison_two.novaml.ru
```

## 🔧 Ручная настройка

### 1. Остановите существующие контейнеры
```bash
docker-compose down
```

### 2. Создайте директории для логов
```bash
mkdir -p logs/nginx
```

### 3. Запустите с новой конфигурацией
```bash
docker-compose up --build -d
```

## 📋 Что изменилось

### Nginx конфигурация
- ✅ Настроен домен `tg.raddison_two.novaml.ru`
- ✅ Поддержка HTTP (80) и HTTPS (443)
- ✅ Проксирование API на `/api/`
- ✅ Gzip сжатие
- ✅ Безопасные заголовки
- ✅ Кэширование статических файлов

### Docker Compose
- ✅ Порт 80 и 443 для веб-сервера
- ✅ Сеть `tgapp-network`
- ✅ Переменные окружения для домена
- ✅ Логи nginx
- ✅ Labels для Traefik (опционально)

### Переменные окружения
- ✅ `DOMAIN=tg.raddison_two.novaml.ru`
- ✅ `API_URL=https://tg.raddison_two.novaml.ru/api`
- ✅ `NODE_ENV=production`

## 🔒 SSL сертификаты

Для включения HTTPS:

1. **Получите SSL сертификаты** (Let's Encrypt, Cloudflare, etc.)
2. **Создайте директорию ssl:**
   ```bash
   mkdir -p ssl
   ```
3. **Поместите сертификаты:**
   - `ssl/cert.pem` - публичный ключ
   - `ssl/key.pem` - приватный ключ
4. **Раскомментируйте SSL секцию в nginx.conf**
5. **Раскомментируйте volume в docker-compose.yml**
6. **Перезапустите:**
   ```bash
   docker-compose restart web
   ```

## 🐛 Устранение проблем

### Проверка статуса
```bash
docker-compose ps
docker-compose logs web
docker-compose logs api
```

### Проверка nginx
```bash
docker exec tgapp-web nginx -t
docker exec tgapp-web nginx -s reload
```

### Проверка сети
```bash
docker network ls
docker network inspect tgapp_tgapp-network
```

## 📊 Мониторинг

### Логи в реальном времени
```bash
# Веб-сервер
docker-compose logs -f web

# API
docker-compose logs -f api

# Все сервисы
docker-compose logs -f
```

### Статистика контейнеров
```bash
docker stats
```

## 🛑 Остановка

```bash
docker-compose down
```

## 🔄 Перезапуск

```bash
docker-compose restart
```

## 📝 Полезные команды

```bash
# Пересборка без кэша
docker-compose build --no-cache

# Просмотр переменных окружения
docker-compose config

# Проверка конфигурации nginx
docker exec tgapp-web nginx -t

# Вход в контейнер
docker exec -it tgapp-web sh
docker exec -it tgapp-api sh
``` 