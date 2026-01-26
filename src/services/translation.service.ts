import { Injectable, signal, computed } from '@angular/core';

export type Language = 'ua' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('ua');

  private translations = {
    ua: {
      nav: {
        about: 'Про Центр',
        services: 'Послуги',
        projects: 'Проєкти',
        publications: 'Публікації',
        team: 'Команда',
        contact: 'Контакти',
        support: 'Підтримати'
      },
      hero: {
        badge: 'Експертний погляд на майбутнє',
        titleStart: 'Центр економіко-правової',
        titleEnd: 'аналітики',
        description: 'Незалежний аналітичний центр (think tank). Сприяємо стійкій відбудові, національній безпеці та сталому розвитку України через якісну експертизу.',
        btnContact: "Зв'язатись з нами",
        btnMore: 'Ознайомитися з проєктами',
      },
      about: {
        title: 'Хто ми є',
        description: 'ЦЕПА — це незалежний think tank, що об’єднує провідних експертів у сферах права, економіки та безпеки для розробки та впровадження ефективних рішень щодо відновлення та розвитку України.',
        cards: {
          innovation: {
            title: 'Інновації',
            desc: 'Впровадження новітніх підходів та технологій у державне управління.'
          },
          justice: {
            title: 'Верховенство права',
            desc: 'Захист прав людини, утвердження справедливості та зміцнення правових інститутів.'
          },
          community: {
            title: 'Спільнота',
            desc: 'Об’єднання зусиль експертів, громадськості та бізнесу задля спільної мети.'
          },
          tagline: 'Об\'єднуємо експертизу заради змін'
        }
      },
      services: {
        title: 'Наші напрямки діяльності',
        subtitle: 'Комплексні рішення для державного сектору та бізнесу',
        items: [
          { title: 'Аналітика та Дослідження', desc: 'Глибокий аналіз законодавства, економічних процесів та оцінка ризиків.' },
          { title: 'Адвокація', desc: 'Просування системних змін на законодавчому та регуляторному рівнях.' },
          { title: 'Освіта та Розвиток', desc: 'Професійні тренінги, семінари та програми підвищення кваліфікації.' },
          { title: 'ESG Консалтинг', desc: 'Інтеграція екологічних, соціальних та управлінських стандартів у стратегії розвитку.' }
        ]
      },
      projects: {
        title: 'Наші проєкти',
        donors: 'Донорські проєкти',
        probono: 'Ініціативи Pro Bono',
        empty: 'Наразі активні проєкти відсутні. Слідкуйте за оновленнями.',
        details: 'Детальніше про проєкт'
      },
      publications: {
        title: 'Публікації та Аналітика',
        categories: {
          analytics: 'Аналітичні звіти',
          news: 'Новини',
          digests: 'Дайджести'
        },
        empty: 'У цій категорії поки немає матеріалів.'
      },
      team: {
        title: 'Наша команда',
        subtitle: 'Експерти, що творять зміни',
        members: [
          { name: 'Олександр Іваненко', role: 'Директор, к.ю.н.', desc: 'Експерт з конституційного та адміністративного права.' },
          { name: 'Марія Петренко', role: 'Головний економіст, Ph.D.', desc: 'Спеціаліст з макроекономічного аналізу та фіскальної політики.' },
          { name: 'Андрій Сидоренко', role: 'Старший юрист', desc: 'Фахівець з міжнародного права та захисту прав людини.' }
        ]
      },
      contact: {
        title: "Контакти",
        subtitle: 'Ми відкриті до співпраці та нових партнерств.', // Це поле ми використовуємо
        addressTitle: 'Адреса',
        addressValue: 'м. Київ, вул. Хрещатик, 1',
        emailTitle: 'Електронна пошта',
        phoneTitle: 'Телефон',
        formTitle: 'Форма зворотного зв\'язку',
        form: {
          namePlaceholder: "Ваше ім'я",
          emailPlaceholder: 'Ваш email',
          messagePlaceholder: 'Текст вашого повідомлення...',
          submit: 'Надіслати повідомлення',
          submitting: 'Відправка...', // Додано
          success: 'Дякуємо! Повідомлення надіслано.' // Додано
        }
      },
      footer: {
        description: 'Незалежний аналітичний центр (think tank), зосереджений на питаннях стійкої відбудови України, національної безпеки та впровадженні стандартів ESG.',
        rights: '© 2026 Центр економіко-правової аналітики. Всі права захищено.',
        privacy: 'Політика конфіденційності',
        terms: 'Умови використання',
        navTitle: 'Навігація',
        actionTitle: 'Співпраця',
        actionDesc: 'Потрібна експертна консультація?',
        actionBtn: 'Написати нам'
      },
      notFound: {
        title: 'Сторінку не знайдено',
        description: 'Можливо, вона була видалена або переміщена.',
        btn: 'На головну'
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
        support: 'Support Us'
      },
      hero: {
        badge: 'Expert View on the Future',
        titleStart: 'Center for Economic and Legal',
        titleEnd: 'Analytics',
        description: 'An independent think tank. We contribute to Ukraine\'s resilient recovery, national security, and sustainable development through high-quality expertise.',
        btnContact: 'Contact Us',
        btnMore: 'Explore Our Projects',
      },
      about: {
        title: 'Who We Are',
        description: 'CELA is an independent think tank uniting leading experts in law, economics, and security to develop and implement effective solutions for Ukraine\'s recovery and development.',
        cards: {
          innovation: {
            title: 'Innovation',
            desc: 'Implementing cutting-edge approaches and technologies in public administration.'
          },
          justice: {
            title: 'Rule of Law',
            desc: 'Protecting human rights, upholding justice, and strengthening legal institutions.'
          },
          community: {
            title: 'Community',
            desc: 'Uniting the efforts of experts, civil society, and business for a common goal.'
          },
          tagline: 'Uniting Expertise for Change'
        }
      },
      services: {
        title: 'Our Areas of Activity',
        subtitle: 'Comprehensive solutions for the public sector and business',
        items: [
          { title: 'Analytics & Research', desc: 'In-depth analysis of legislation, economic processes, and risk assessment.' },
          { title: 'Advocacy', desc: 'Promoting systemic changes at the legislative and regulatory levels.' },
          { title: 'Education & Development', desc: 'Professional trainings, seminars, and capacity-building programs.' },
          { title: 'ESG Consulting', desc: 'Integrating environmental, social, and governance standards into development strategies.' }
        ]
      },
      projects: {
        title: 'Our Projects',
        donors: 'Donor Projects',
        probono: 'Pro Bono Initiatives',
        empty: 'There are currently no active projects. Stay tuned for updates.',
        details: 'Project Details'
      },
      publications: {
        title: 'Publications & Analytics',
        categories: {
          analytics: 'Analytical Reports',
          news: 'News',
          digests: 'Digests'
        },
        empty: 'There are no materials in this category yet.'
      },
      team: {
        title: 'Our Team',
        subtitle: 'Experts driving change',
        members: [
          { name: 'Oleksandr Ivanenko', role: 'Director, Ph.D. in Law', desc: 'Expert in Constitutional and Administrative Law.' },
          { name: 'Mariia Petrenko', role: 'Chief Economist, Ph.D.', desc: 'Specialist in Macroeconomic Analysis and Fiscal Policy.' },
          { name: 'Andrii Sydorenko', role: 'Senior Lawyer', desc: 'Specialist in International Law and Human Rights Protection.' }
        ]
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'We are open to cooperation and new partnerships.',
        addressTitle: 'Address',
        addressValue: 'Kyiv, Khreshchatyk St, 1',
        emailTitle: 'Email',
        phoneTitle: 'Phone',
        formTitle: 'Feedback Form',
        form: {
          namePlaceholder: 'Your Name',
          emailPlaceholder: 'Your Email',
          messagePlaceholder: 'Your Message...',
          submit: 'Send Message',
          submitting: 'Sending...', // Додано
          success: 'Thank you! Message sent.' // Додано
        }
      },
      footer: {
        description: 'An independent think tank focused on Ukraine\'s resilient recovery, national security issues, and the implementation of ESG standards.',
        rights: '© 2026 Center for Economic and Legal Analytics. All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Use',
        navTitle: 'Navigation',
        actionTitle: 'Cooperation',
        actionDesc: 'Need expert consultation?',
        actionBtn: 'Write to Us'
      },
       notFound: {
        title: 'Page Not Found',
        description: 'It might have been removed or relocated.',
        btn: 'Return Home'
      }
    }
  };

  t = computed(() => this.translations[this.currentLang()]);

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    document.documentElement.lang = lang;
  }
}