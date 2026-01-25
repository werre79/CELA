import { Injectable, signal, computed } from '@angular/core';

export type Language = 'uk' | 'pl' | 'en';

// ТУТ МИ ПИШЕМО ТІЛЬКИ УКРАЇНСЬКОЮ (Поки розробляємо)
const DATA = {
  nav: {
    about: 'Про нас',
    services: 'Напрямки',
    projects: 'Проєкти',
    publications: 'Публікації',
    team: 'Команда',
    contact: 'Контакти',
    consultation: 'Замовити консультацію',
    support: 'Підтримати'
  },
  hero: {
    badge: 'Експертний погляд на майбутнє',
    titleStart: 'Центр економіко-правової',
    titleEnd: 'аналітики',
    description: 'Незалежний аналітичний центр. Стійка відбудова, безпека та сталий розвиток України.',
    btnContact: 'Зв\'язатись з нами',
    btnMore: 'Наші проєкти',
    btnSupport: 'Підтримати'
  },
  about: {
    title: 'Хто ми є',
    description: 'Ми — незалежний аналітичний центр, що фокусується на стійкій відбудові України, питаннях безпеки та впровадженні ESG стандартів.',
    cards: {
      innovation: { title: 'Інновації', desc: 'Використання сучасних підходів.' },
      justice: { title: 'Справедливість', desc: 'Захист прав та інтересів громад.' },
      community: { title: 'Спільнота', desc: 'Об\'єднання експертів та бізнесу.' }
    }
  },
  services: {
    title: 'Наші напрямки діяльності',
    subtitle: 'Комплексний підхід: Аналіз • Коментування • Розробка',
    items: [
      { title: 'Стійка відбудова України', desc: 'Аналіз планів відновлення та стратегій.' },
      { title: 'Безпековий напрямок', desc: 'Економічна, соціальна та правова безпека.' },
      { title: 'ESG та Сталий розвиток', desc: 'Екологічне та корпоративне управління.' },
      { title: 'Правова експертиза', desc: 'Аналіз законодавства та розробка актів.' }
    ]
  },
  projects: {
    title: 'Наші Проєкти',
    donors: 'Підтримані донорами',
    probono: 'Pro Bono (Волонтерські)',
    // Тут уже є ID та DETAILS для нашої нової структури сторінок
    items: [
      { 
        id: 'monitoring-vidbudova', 
        title: 'Моніторинг відбудови', 
        type: 'donor', 
        desc: 'За підтримки міжнародних фондів.',
        details: 'Тут буде повний текст про моніторинг відбудови...'
      },
      { 
        id: 'legal-aid-vpo',
        title: 'Безкоштовна правова допомога', 
        type: 'probono', 
        desc: 'Консультації для ВПО.',
        details: 'Тут буде повний текст про правову допомогу...'
      }
    ]
  },
  team: {
    title: 'Керівництво',
    subtitle: 'Експерти, що керують змінами.',
    members: [
      { name: 'Ім\'я Прізвище', role: 'Директор' },
      { name: 'Ім\'я Прізвище', role: 'Керівник правового напрямку' },
      { name: 'Ім\'я Прізвище', role: 'Керівник економічного напрямку' }
    ]
  },
  contact: {
    title: 'Зв\'яжіться з нами',
    description: 'Замовте консультацію або запропонуйте співпрацю.',
    addressTitle: 'Адреса',
    addressValue: 'м. Київ, Україна',
    emailTitle: 'Email',
    phoneTitle: 'Телефон',
    formTitle: 'Замовити консультацію',
    socials: { youtube: 'YouTube', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn' },
    form: {
      name: 'Ім\'я',
      namePlaceholder: 'Ваше ім\'я',
      email: 'Email',
      emailPlaceholder: 'email@example.com',
      message: 'Повідомлення',
      messagePlaceholder: 'Опишіть ваш запит...',
      submit: 'Відправити запит',
      submitting: 'Відправка...',
      success: 'Дякуємо! Ми зв\'яжемося з вами.'
    }
  },
  footer: {
    rights: '© 2026 Центр економіко-правової аналітики',
    privacy: 'Політика конфіденційності',
    terms: 'Умови використання'
  },
  publications: {
     title: 'Публікації',
     categories: ['Аналітика', 'Новини', 'Дайджести'],
     readMore: 'Читати'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('uk');
  
  // МАГІЯ ТУТ: Ми завжди повертаємо DATA, незалежно від мови.
  // Це дозволяє сайту працювати без помилок, поки ми розробляємо структуру.
  t = computed(() => DATA);

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    document.documentElement.lang = lang;
    // У майбутньому тут буде логіка перемикання словників
    console.log(`Мову перемкнуто на ${lang}, але поки що відображається UA (Dev Mode)`);
  }
  
  getProjectById(id: string) {
    return this.t().projects.items.find((p: any) => p.id === id);
  }
}