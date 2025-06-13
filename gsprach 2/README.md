# G-Sprache Landing Page - Документація

## Огляд проекту
Повнофункціональний лендинг для подкаст-студії G-Sprache на українській мові, створений згідно з технічними вимогами та дизайн-специфікацією.

## Структура файлів
```
gsprache-landing/
├── index.html          # Основна HTML структура
├── styles.css          # CSS стилі та анімації
├── script.js           # JavaScript функціональність
├── images/             # Зображення та логотипи
│   ├── logo-ybc.png
│   ├── logo-startup.png
│   ├── studio-a.jpg
│   ├── studio-b.jpg
│   ├── studio-c.jpg
│   ├── client-1.jpg
│   ├── client-2.jpg
│   └── client-3.jpg
└── videos/             # Відеофайли
    ├── hero.mp4
    ├── testimonial-1.mp4
    └── testimonial-2.mp4
```

## Основні функції

### 1. Preloader
- Анімований SVG мікрофон з пульсацією
- Автоматично зникає після завантаження hero відео
- Fallback таймер 3 секунди

### 2. Hero Section
- Повноекранне відео фон (10s loop, muted)
- Адаптивні заголовки
- CTA кнопка з інтеграцією Stripe

### 3. Navigation
- Фіксована навігація з blur ефектом
- Smooth scroll до секцій
- Мобільне меню (hamburger)

### 4. Секції контенту
- **Social Proof**: Логотипи клієнтів з fade-in анімацією
- **Services**: 4 карточки послуг з hover ефектами
- **Spaces**: Swiper слайдер студій з автопрогравання
- **Pricing**: 3 тарифні плани з виділенням популярного
- **Process**: Timeline з 3 кроками
- **Testimonials**: Masonry grid з відео та текстовими відгуками
- **FAQ**: Accordion з плавними переходами
- **Contact**: Форма бронювання з валідацією

### 5. Інтеграції

#### Stripe Checkout
```javascript
// Ініціалізація
stripe = Stripe('pk_test_xxxxx');

// Створення сесії
fetch('/create-checkout', {method: 'POST'})
  .then(res => res.json())
  .then(session => stripe.redirectToCheckout({sessionId: session.id}));
```

#### Brevo CRM
```javascript
fetch('https://api.brevo.com/v3/contacts', {
  method: 'POST',
  headers: {
    'api-key': 'xkeysb_xxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: data.email,
    attributes: {
      FIRSTNAME: data.name,
      STUDIO: data.studio,
      TARIF: data.plan
    }
  })
});
```

### 6. Адаптивний дизайн
- Mobile-first підхід
- Breakpoints: 480px, 768px, 1024px
- Гнучкі grid системи
- Адаптивна типографіка (clamp)

### 7. Анімації та ефекти
- CSS transitions та transforms
- Intersection Observer для scroll анімацій
- Hover ефекти на всіх інтерактивних елементах
- Smooth scroll поведінка

## Кольорова палітра
- **Основний фон**: #0E0E0E (чорний)
- **Вторинний фон**: #103B27 (темно-зелений)
- **Акцент**: #BBC34A (jungle-lime)
- **Текст**: #ffffff (білий)
- **Вторинний текст**: rgba(255, 255, 255, 0.8)

## Шрифти
- **Основний**: Inter (Google Fonts)
- **Ваги**: 300, 400, 500, 600, 700

## Зовнішні залежності
- Swiper.js (слайдер)
- Flatpickr (date picker)
- Stripe.js (платежі)
- Google Fonts (шрифти)

## Налаштування для продакшену

### 1. Замініть API ключі
```javascript
// Stripe
stripe = Stripe('pk_live_your_key');

// Brevo
'api-key': 'your_brevo_api_key'
```

### 2. Додайте медіафайли
- Завантажте відео hero.mp4 (10s, loop-ready)
- Додайте зображення студій (studio-a.jpg, studio-b.jpg, studio-c.jpg)
- Логотипи клієнтів у форматі PNG
- Фото клієнтів для testimonials

### 3. Backend для Stripe
```javascript
// Node.js/Express приклад
app.post('/create-checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price: 'price_123',
      quantity: 1
    }],
    mode: 'payment',
    success_url: 'https://yoursite.com/thankyou',
    cancel_url: 'https://yoursite.com/'
  });
  
  res.json({id: session.id});
});
```

## Оптимізація продуктивності
- Lazy loading зображень
- Preload критичних ресурсів
- Мінімізація CSS/JS
- Оптимізація зображень (WebP)
- CDN для статичних файлів

## SEO оптимізація
- Семантична HTML розмітка
- Meta теги та Open Graph
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt

## Браузерна сумісність
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Мобільні браузери

## Тестування
- Валідація HTML/CSS
- Тестування на різних пристроях
- Перевірка швидкості завантаження
- Accessibility audit
- Cross-browser тестування

