# ProximaSkill — академия массажа

MVP онлайн-школы: публичный сайт, кабинет ученика и админка преподавателя.

- **Backend:** Laravel 13 + Sanctum
- **Frontend:** React + Vite + Tailwind
- **Локально:** SQLite (файл `backend/database/database.sqlite`)
- **Прод:** Laravel Cloud + MySQL, который вы подключаете в панели Cloud

## Как запустить локально

Нужны PHP 8.4, Composer и Node.js. Docker и MySQL для разработки не нужны.

```bash
cd backend
composer install
cp .env.example .env   # если ещё нет .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve

cd ../frontend
npm install
npm run dev
```

Сайт: [http://localhost:5173](http://localhost:5173). API: [http://localhost:8000](http://localhost:8000).

## Демо-аккаунты

Пароль у всех: `password`

| Роль | Email |
| --- | --- |
| Администратор | admin@soma.academy |
| Преподаватель | teacher@soma.academy |
| Модератор | moderator@soma.academy |
| Ученик | student@soma.academy |

У ученика уже открыт курс «Классический массаж» и выдан сертификат гос. образца.

## Деплой в Laravel Cloud

Сайт и API выкатываются одним приложением. Корень в Cloud — папка `backend`. Во время сборки скрипт ставит зависимости React из соседней папки `frontend/` и кладёт собранный сайт в `backend/public`. В проде браузер ходит в API по относительному адресу `/api`, отдельный фронтенд и CORS не нужны.

Нужны Laravel 13 (уже в проекте), PHP 8.4 и репозиторий на GitHub, GitLab или Bitbucket. SQLite в Cloud не работает: диск окружения стирается при каждом деплое.

### 1. Залейте код

```bash
git add .
git commit -m "Prepare Laravel Cloud deploy"
git remote add origin git@github.com:ВАШ_АККАУНТ/massagist.git
git push -u origin main
```

### 2. Подключите Git

1. Откройте [cloud.laravel.com](https://cloud.laravel.com).
2. **Account settings → Source controls** → GitHub, GitLab или Bitbucket.
3. Дайте Laravel Cloud доступ к репозиторию.

### 3. Создайте приложение

1. **New application → From existing repository**.
2. Репозиторий `massagist`. Cloud увидит монорепо — корень приложения **`backend`**.
3. Регион: `eu-central-1` (Frankfurt) или ближайший к пользователям.
4. Ветка: `main`.
5. В **General settings → Runtime** выберите **PHP 8.4**.

### 4. Команды сборки и деплоя

В настройках окружения, раздел **Deployments**:

Build command:

```bash
bash scripts/cloud-build.sh
```

Deploy command:

```bash
bash scripts/cloud-deploy.sh
```

Скрипт сборки ставит Composer-зависимости, собирает React и выполняет `php artisan optimize`. Скрипт деплоя только накатывает миграции. Не добавляйте `storage:link`, `optimize:clear` и `queue:restart`: Cloud сам перезапускает воркеры, а изменения файловой системы в deploy command не сохраняются.

### 5. База данных

1. Окружение → infrastructure canvas → **Add database** → **Laravel MySQL**.
2. Тот же регион, что у приложения. Для старта хватит небольшого кластера.
3. Привяжите базу к окружению.

Cloud сам запишет `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` и `DB_PASSWORD`. Не копируйте эти поля вручную.

Первый деплой запускайте после базы и переменных. Если Cloud успел собрать приложение раньше и миграции упали, нажмите Deploy ещё раз.

### 6. Переменные окружения

Скопируйте `deploy/env.production.example` в **Environment variables** и замените `APP_URL` на адрес, который Cloud выдаст приложению (`https://….laravel.cloud`).

`VITE_API_URL` в Cloud задавать не нужно: прод-сборка ходит в `/api` на том же домене. Локальный `frontend/.env` в репозиторий не попадает и на сборку в Cloud не влияет.

`APP_KEY` задайте, только если Cloud его не создал. Сгенерировать локально:

```bash
cd backend && php artisan key:generate --show
```

Вставьте вывод в переменную `APP_KEY` и задеплойте ещё раз. После любой смены переменных нужен новый деплой: `php artisan optimize` запекает конфиг в образ.

### 7. Файлы (баннеры и картинки)

Локальный диск на Cloud не хранит загрузки между деплоями и репликами.

1. На canvas нажмите **Add bucket** → **Laravel Object Storage**.
2. Видимость бакета: **Public**. Jurisdiction: **European Union**, если приложение в Европе.
3. Сделайте бакет диском по умолчанию.
4. В проекте уже есть `league/flysystem-aws-s3-v3`. Не задавайте `FILESYSTEM_DISK` вручную — Cloud подставит имя диска, и загрузки пойдут в бакет.
5. Задеплойте ещё раз.

У R2 нет прав на отдельный файл. Не включайте `visibility: public` в конфиге диска: бакет и так публичный, а ACL R2 отклоняет.

### 8. Первый запуск с демо-данными

В окружении откройте **Commands** и один раз выполните:

```bash
php artisan migrate --force --seed
```

Повторный `--seed` создаст демо-пользователей ещё раз. Дальше деплои гоняет только `scripts/cloud-deploy.sh`.

Пароль демо-аккаунтов: `password`. На проде после проверки смените его или не запускайте сидер.

### 9. Проверка

После зелёного деплоя откройте `APP_URL`:

- главная школы открывается;
- `https://ваш-домен.laravel.cloud/up` отвечает, что приложение живо;
- `https://ваш-домен.laravel.cloud/api/public/home` отдаёт JSON;
- вход `admin@soma.academy` / `password` пускает в админку, если сидер уже отработал.

Дальше каждый push в `main` сам запускает деплой. Очереди и планировщик проекту не нужны.
