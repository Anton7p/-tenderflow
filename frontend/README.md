# Система управления тендерной документацией

## Описание проекта

Система для обработки тендерной документации с возможностью парсинга Excel файлов, редактирования позиций и генерации Word документов для тендера.

## Технологический стек

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev сервер с HMR
- **Ant Design** - UI компоненты
- **CSS Modules** - стилизация

### Библиотеки
- **@tanstack/react-table** - таблицы
- **@tanstack/react-query** - управление данными
- **react-hook-form** - формы и валидация
- **zustand** - управление состоянием
- **xlsx** - парсинг Excel файлов
- **docx** - генерация Word документов

## Архитектура

### Структура проекта
```
src/
├── app/                 # Основное приложение
│   ├── layout/         # Layout компоненты (Header, Sidebar, Workspace)
│   └── app.tsx         # Главный компонент приложения
├── pages/              # Страницы
│   ├── tender-upload.tsx       # Загрузка тендеров
│   ├── template-editor.tsx     # Редактор шаблонов
│   ├── document-journal.tsx    # Журнал документов
│   └── settings.tsx            # Настройки
├── shared/             # Общие компоненты
│   └── ui/             # UI компоненты (DataGrid, Form, CommandBar)
├── services/           # Сервисы
│   ├── excel-parser.ts # Парсинг Excel
│   └── word-generator.ts # Генерация Word
├── store/              # Zustand stores
│   ├── use-app-store.ts
│   ├── use-tender-store.ts
│   ├── use-template-store.ts
│   └── use-document-store.ts
├── styles/             # Глобальные стили
└── theme-config.ts     # Конфигурация темы Ant Design
```

## Функционал

### Реализовано
- **UI Layout**: Header, Sidebar, Workspace с ограничением ширины 1400px
- **Тема**: Modern 1C стиль (жёлтая гамма #FFE066, скругления 1px)
- **Компоненты**: DataGrid, Form, CommandBar на Ant Design
- **Парсинг Excel**: загрузка и парсинг .xlsx файлов
- **Редактор позиций**: добавление/удаление/обновление с пересчётом на лету
- **Генерация Word**: счёт, акт, УПД, контракт

### В разработке
- Предпросмотр Word документов
- Интеграция с TenderUpload

## Установка и запуск

```bash
cd frontend
npm install
npm run dev
```

## Конфигурация

### Vite
- HMR включён
- Dev сервер на порту 5173

### Ant Design Theme
- `colorPrimary: #FFD045`
- `borderRadius: 1px`
- `colorBgLayout: #F8FAFC`
- `fontFamily: 'Inter, system-ui, sans-serif'`

## Примеры файлов

В папке `files_example/` находятся примеры документов заказчика:
- Excel файлы для парсинга
- Word шаблоны для генерации
