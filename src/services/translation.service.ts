import { Injectable, signal, computed } from '@angular/core';

export type Language = 'uk' | 'pl' | 'en';

const TRANSLATIONS = {
  uk: {
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
        innovation: {
          title: 'Інновації',
          desc: 'Використання сучасних підходів для вирішення складних викликів.'
        },
        justice: {
          title: 'Справедливість',
          desc: 'Захист прав та інтересів громад через якісну правову експертизу.'
        },
        community: {
          title: 'Спільнота',
          desc: 'Об\'єднання експертів та бізнесу для спільного розвитку.'
        }
      }
    },
    services: {
      title: 'Наші напрямки діяльності',
      subtitle: 'Комплексний підхід: Аналіз • Коментування • Розробка',
      items: [
        {
          title: 'Стійка відбудова України',
          desc: 'Аналіз планів відновлення, моніторинг ефективності та розробка стратегій розвитку громад.'
        },
        {
          title: 'Безпековий напрямок',
          desc: 'Економічна, соціальна та правова безпека. Протидія загрозам та аналіз ризиків.'
        },
        {
          title: 'ESG та Сталий розвиток',
          desc: 'Екологічне, соціальне та корпоративне управління. Впровадження європейських стандартів.'
        },
        {
          title: 'Правова експертиза',
          desc: 'Аналіз законодавства, коментування законопроєктів та розробка нормативних актів.'
        }
      ]
    },
    // Новий розділ Проєкти (дані готові для майбутнього компонента)
    projects: {
      title: 'Наші Проєкти',
      donors: 'Підтримані донорами',
      probono: 'Pro Bono (Волонтерські)',
      items: [
        { title: 'Моніторинг відбудови', type: 'donor', desc: 'За підтримки міжнародних фондів.' },
        { title: 'Безкоштовна правова допомога', type: 'probono', desc: 'Консультації для ВПО.' }
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
      socials: {
        youtube: 'YouTube',
        facebook: 'Facebook',
        instagram: 'Instagram',
        linkedin: 'LinkedIn'
      },
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
      rights: '© 2024 Центр економіко-правової аналітики',
      privacy: 'Політика конфіденційності',
      terms: 'Умови використання'
    }
  },
  pl: {}, 
  en: {} 
};

// Тимчасове дублювання для інших мов, щоб не було помилок
TRANSLATIONS.pl = { ...TRANSLATIONS.uk };
TRANSLATIONS.en = { ...TRANSLATIONS.uk };

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('uk');
  
  t = computed(() => TRANSLATIONS[this.currentLang()]);

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    document.documentElement.lang =