FROM python:3.12-slim

# Устанавливаем Poetry
ENV POETRY_VERSION=1.8.3
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_CACHE_DIR=/opt/.cache

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Poetry
RUN pip install --no-cache-dir poetry==${POETRY_VERSION}

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем весь исходный код (включая pyproject.toml и app/)
COPY . .

# Устанавливаем зависимости
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --only main

# Открываем порт
EXPOSE 8000

# Запускаем приложение через poetry run
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 