import { Injectable, signal, computed } from '@angular/core';

export type Language = 'ua' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('ua'); // Використовуємо цей тип тут

  private translations = {
    ua: {
      nav: {
        about: 'Про нас',
        services: 'Послуги',
        projects: 'Проєкти',
        publications: 'Публікації',
        team: 'Команда',
        contact: 'Контакти',
        consultation: 'Консультація',
        support: 'Підтримати'
      },
      hero: {
        badge: 'Експертний погляд на майбутнє',
        titleStart: 'Центр економіко-правової',
        titleEnd: 'аналітики',
        description: 'Незалежний аналітичний центр. Стійка відбудова, безпека та сталий розвиток України.',
        btnContact: "Зв'язатись з нами",
        btnMore: 'Наші проєкти',
        btnSupport: 'Підтримати'
      },
      about: {
        title: 'Хто ми є',
        description: 'ЦЕПА — це незалежний аналітичний центр, що об’єднує експертів з права, економіки та безпеки для розробки ефективних рішень для відновлення України.',
        cards: {
          innovation: {
            title: 'Інновації',
            desc: 'Впровадження новітніх підходів у державне управління.'
          },
          justice: {
            title: 'Справедливість',
            desc: 'Захист прав людини та верховенства права.'
          },
          community: {
            title: 'Спільнота',
            desc: 'Об’єднання зусиль для спільної мети.'
          }
        }
      },
      services: {
        title: 'Наші напрямки',
        subtitle: 'Комплексні рішення для держави та бізнесу',
        items: [
          { title: 'Аналітика', desc: 'Глибокий аналіз законодавства та економічних процесів.' },
          { title: 'Адвокація', desc: 'Просування змін на законодавчому рівні.' },
          { title: 'Освіта', desc: 'Тренінги та семінари для підвищення кваліфікації.' },
          { title: 'ESG Консалтинг', desc: 'Впровадження екологічних та соціальних стандартів.' }
        ]
      },
      projects: {
        title: 'Наші проєкти',
        donors: 'Донорські проєкти',
        probono: 'Pro Bono ініціативи'
      },
      publications: {
        title: 'Публікації'
      },
      team: {
        title: 'Наша команда',
        subtitle: 'Експерти, що творять зміни',
        members: [
          { name: 'Олександр Іваненко', role: 'Директор', desc: 'Експерт з конституційного права.' },
          { name: 'Марія Петренко', role: 'Головний економіст', desc: 'Спеціаліст з макроекономіки.' },
          { name: 'Андрій Сидоренко', role: 'Юрист', desc: 'Фахівець з міжнародного права.' }
        ]
      },
      contact: {
        title: "Зв'яжіться з нами",
        description: 'Ми завжди відкриті до співпраці та нових ідей.',
        addressTitle: 'Адреса',
        addressValue: 'м. Київ, вул. Хрещатик, 1',
        emailTitle: 'Email',
        phoneTitle: 'Телефон',
        formTitle: 'Написати нам',
        form: {
          name: "Ім'я",
          namePlaceholder: 'Ваше ім\'я',
          email: 'Email',
          emailPlaceholder: 'Ваш email',
          message: 'Повідомлення',
          messagePlaceholder: 'Опишіть ваше запитання...',
          submit: 'Відправити',
          submitting: 'Відправка...',
          success: 'Дякуємо! Ми отримали ваше повідомлення.'
        }
      },
      footer: {
        rights: '© 2026 Центр економіко-правової аналітики',
        privacy: 'Політика конфіденційності',
        terms: 'Умови використання'
      }
    },
    en: {
      nav: {
        about: 'About Us',
        services: 'Services',
        projects: 'Projects',
        publications: 'Publications',
        team: 'Team',
        contact: 'Contact',
        consultation: 'Consultation',
        support: 'Support'
      },
      hero: {
        badge: 'Expert view on the future',
        titleStart: 'Center for Economic and Legal',
        titleEnd: 'Analytics',
        description: 'Independent think tank. Resilient recovery, security, and sustainable development of Ukraine.',
        btnContact: 'Contact Us',
        btnMore: 'Our Projects',
        btnSupport: 'Support Us'
      },
      about: {
        title: 'Who We Are',
        description: 'CELA is an independent think tank uniting experts in law, economics, and security to develop effective solutions for Ukraine\'s recovery.',
        cards: {
          innovation: {
            title: 'Innovation',
            desc: 'Implementing modern approaches in public administration.'
          },
          justice: {
            title: 'Justice',
            desc: 'Protecting human rights and the rule of law.'
          },
          community: {
            title: 'Community',
            desc: 'Uniting efforts for a common goal.'
          }
        }
      },
      services: {
        title: 'Our Areas',
        subtitle: 'Comprehensive solutions for government and business',
        items: [
          { title: 'Analytics', desc: 'In-depth analysis of legislation and economic processes.' },
          { title: 'Advocacy', desc: 'Promoting changes at the legislative level.' },
          { title: 'Education', desc: 'Trainings and seminars for professional development.' },
          { title: 'ESG Consulting', desc: 'Implementing environmental and social standards.' }
        ]
      },
      projects: {
        title: 'Our Projects',
        donors: 'Donor Projects',
        probono: 'Pro Bono Initiatives'
      },
      publications: {
        title: 'Publications'
      },
      team: {
        title: 'Our Team',
        subtitle: 'Experts creating change',
        members: [
          { name: 'Oleksandr Ivanenko', role: 'Director', desc: 'Expert in Constitutional Law.' },
          { name: 'Mariia Petrenko', role: 'Chief Economist', desc: 'Specialist in Macroeconomics.' },
          { name: 'Andrii Sydorenko', role: 'Lawyer', desc: 'Specialist in International Law.' }
        ]
      },
      contact: {
        title: 'Contact Us',
        description: 'We are always open to cooperation and new ideas.',
        addressTitle: 'Address',
        addressValue: 'Kyiv, Khreshchatyk St, 1',
        emailTitle: 'Email',
        phoneTitle: 'Phone',
        formTitle: 'Write to Us',
        form: {
          name: 'Name',
          namePlaceholder: 'Your name',
          email: 'Email',
          emailPlaceholder: 'Your email',
          message: 'Message',
          messagePlaceholder: 'Describe your question...',
          submit: 'Send',
          submitting: 'Sending...',
          success: 'Thank you! We received your message.'
        }
      },
      footer: {
        rights: '© 2026 Center for Economic and Legal Analytics',
        privacy: 'Privacy Policy',
        terms: 'Terms of Use'
      }
    }
  };

  t = computed(() => this.translations[this.currentLang()]);

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    document.documentElement.lang = lang;
  }
}