# Тестирование

Этот проект использует комплексную систему тестирования с использованием:

- **Vitest** - быстрый тестовый фреймворк
- **React Testing Library** - для тестирования React компонентов
- **MSW (Mock Service Worker)** - для мокирования API запросов
- **User Event** - для симуляции пользовательских взаимодействий

## Структура тестов

```
src/test/
├── setup.ts                 # Настройка тестового окружения
├── utils.tsx                # Утилиты для тестирования
├── types.ts                 # Типы для тестов
├── mocks/                   # Моки API
│   ├── server.ts           # MSW сервер
│   └── handlers.ts         # Обработчики API запросов
├── integration/            # Интеграционные тесты
│   └── auth-flow.test.tsx  # Тесты авторизации
└── README.md               # Документация по тестированию
```

## Запуск тестов

### Все тесты
```bash
npm test
```

### Тесты в watch режиме
```bash
npm run test:watch
```

### Однократный запуск
```bash
npm run test:run
```

### С покрытием кода
```bash
npm run test:coverage
```

### UI интерфейс
```bash
npm run test:ui
```

## Типы тестов

### 1. Unit тесты
- Тестируют отдельные функции и компоненты
- Быстрые и изолированные
- Примеры: `api.test.ts`, `LoginPage.test.tsx`

### 2. Component тесты
- Тестируют React компоненты в изоляции
- Проверяют рендеринг, взаимодействие пользователя
- Примеры: `Dashboard.test.tsx`, `ProtectedRoute.test.tsx`

### 3. Integration тесты
- Тестируют взаимодействие между компонентами
- Проверяют полные пользовательские сценарии
- Примеры: `auth-flow.test.tsx`

## Мокирование

### API запросы
Используется MSW для мокирования всех API запросов:

```typescript
// В handlers.ts
http.get('http://localhost:3000/prot/users', () => {
  return HttpResponse.json(mockUsers)
})
```

### React Router
Мокируется для тестирования навигации:

```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
```

### React Query
Мокируется для контроля состояния загрузки:

```typescript
const mockUseQuery = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: any) => mockUseQuery(options),
}))
```

## Утилиты тестирования

### render
Кастомная функция рендеринга с провайдерами:

```typescript
import { render } from '../test/utils'

render(<Component />, {
  initialAuthState: { user: mockUser, isAuthenticated: true }
})
```

### Моки данных
Предопределенные моки для разных типов пользователей:

```typescript
import { mockUser, mockEmployee, mockManager } from '../test/utils'
```

## Лучшие практики

### 1. Именование тестов
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {})
  it('should handle user interaction', () => {})
  it('should show error state', () => {})
})
```

### 2. Очистка состояния
```typescript
beforeEach(() => {
  vi.clearAllMocks()
  // Сброс состояния
})
```

### 3. Асинхронные операции
```typescript
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

### 4. Пользовательские взаимодействия
```typescript
const user = userEvent.setup()
await user.click(screen.getByRole('button'))
await user.type(screen.getByLabelText('Email'), 'test@example.com')
```

## Покрытие кода

Цель покрытия: **80%+**

Текущее покрытие можно посмотреть в:
- Консоли после `npm run test:coverage`
- HTML отчете в `coverage/index.html`

### Исключения из покрытия
- Конфигурационные файлы
- Типы TypeScript
- Тестовые файлы
- Файлы сборки

## Отладка тестов

### 1. Использование screen.debug()
```typescript
it('should debug component', () => {
  render(<Component />)
  screen.debug() // Выводит DOM в консоль
})
```

### 2. Виртуальный UI
```bash
npm run test:ui
```

### 3. Логирование в тестах
```typescript
it('should log values', () => {
  const result = someFunction()
  console.log('Result:', result)
})
```

## CI/CD

Тесты автоматически запускаются в CI/CD пайплайне:

1. **Linting** - проверка кода
2. **Type checking** - проверка типов
3. **Unit tests** - юнит тесты
4. **Integration tests** - интеграционные тесты
5. **Coverage report** - отчет о покрытии

## Расширение тестов

### Добавление нового теста
1. Создайте файл `ComponentName.test.tsx`
2. Импортируйте необходимые утилиты
3. Напишите тесты по образцу существующих
4. Запустите `npm test` для проверки

### Добавление новых моков
1. Обновите `handlers.ts` для новых API эндпоинтов
2. Добавьте типы в `types.ts` если нужно
3. Обновите утилиты в `utils.tsx`

## Полезные команды

```bash
# Запуск конкретного теста
npm test ComponentName.test.tsx

# Запуск тестов в определенной папке
npm test src/pages/

# Запуск с подробным выводом
npm test -- --reporter=verbose

# Обновление снапшотов
npm test -- --update-snapshots
```
