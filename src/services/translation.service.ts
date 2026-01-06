import { Injectable, signal, computed } from '@angular/core';

export type Language = 'uk' | 'pl' | 'en';

const TRANSLATIONS = {
  uk: {
    nav: {
      about: 'Про нас',
      services: 'Діяльність',
      team: 'Команда',
      contact: 'Контакти',
      support: 'Підтримати нас'
    },
    hero: {
      badge: 'Експертний погляд на майбутнє',
      titleStart: 'Центр економіко-правової',
      titleEnd: 'аналітики',
      description: 'Ми об\'єднуємо глибоку економічну експертизу та правовий аналіз для створення стійких рішень у громадському та приватному секторах.',
      btnContact: 'Зв\'язатись з нами',
      btnMore: 'Дізнатись більше',
      btnSupport: 'Підтримати'
    },
    about: {
      title: 'Хто ми є',
      description: 'Наша організація — це незалежний аналітичний центр, що працює на перетині економіки та права. Ми прагнемо розбудови правової держави через якісну аналітику.',
      cards: {
        innovation: {
          title: 'Інновації',
          desc: 'Ми використовуємо сучасні методи аналізу даних для пошуку нестандартних рішень складних економічних проблем.'
        },
        justice: {
          title: 'Справедливість',
          desc: 'Наші правові дослідження спрямовані на захист інтересів суспільства та забезпечення рівних можливостей.'
        },
        community: {
          title: 'Спільнота',
          desc: 'Ми об\'єднуємо експертів, активістів та бізнес для діалогу та спільного вирішення нагальних питань.'
        }
      }
    },
    services: {
      title: 'Наші напрямки діяльності',
      subtitle: 'Комплексний підхід до змін',
      items: [
        {
          title: 'Економічний аналіз',
          desc: 'Дослідження ринків, макроекономічне прогнозування та оцінка інвестиційного клімату.'
        },
        {
          title: 'Правова експертиза',
          desc: 'Аналіз законопроектів, розробка регуляторних актів та правовий аудит.'
        },
        {
          title: 'Громадський контроль',
          desc: 'Моніторинг діяльності влади та використання публічних фінансів.'
        },
        {
          title: 'Освітні проекти',
          desc: 'Проведення тренінгів, семінарів та конференцій для підвищення правової культури.'
        }
      ]
    },
    team: {
      title: 'Наша Команда',
      subtitle: 'Професіонали, що творять зміни.',
      members: [
        { name: 'Олександр Петренко', role: 'Директор, Економіст' },
        { name: 'Марія Коваль', role: 'Головний Юрист' },
        { name: 'Іван Бойко', role: 'Аналітик даних' }
      ]
    },
    contact: {
      title: 'Зв\'яжіться з нами',
      description: 'Маєте ідеї для співпраці або запитання щодо нашої діяльності? Ми завжди відкриті до діалогу. Заповніть форму, і ми відповімо найближчим часом.',
      addressTitle: 'Адреса',
      addressValue: 'вул. Інститутська, 1, м. Київ, 01001',
      emailTitle: 'Email',
      phoneTitle: 'Телефон',
      formTitle: 'Напишіть нам',
      form: {
        name: 'Ім\'я',
        namePlaceholder: 'Ваше ім\'я',
        email: 'Email',
        emailPlaceholder: 'example@mail.com',
        message: 'Повідомлення',
        messagePlaceholder: 'Текст вашого повідомлення...',
        submit: 'Відправити',
        submitting: 'Відправка...',
        success: 'Повідомлення успішно відправлено!'
      }
    },
    footer: {
      rights: '© 2024 Центр економіко-правової аналітики',
      privacy: 'Політика конфіденційності',
      terms: 'Умови використання'
    }
  },
  pl: {
    nav: {
      about: 'O nas',
      services: 'Działalność',
      team: 'Zespół',
      contact: 'Kontakt',
      support: 'Wesprzyj nas'
    },
    hero: {
      badge: 'Eksperckie spojrzenie w przyszłość',
      titleStart: 'Centrum Analityki',
      titleEnd: 'Ekonomiczno-Prawnej',
      description: 'Łączymy głęboką wiedzę ekonomiczną i analizę prawną, aby tworzyć trwałe rozwiązania w sektorze publicznym i prywatnym.',
      btnContact: 'Skontaktuj się z nami',
      btnMore: 'Dowiedz się więcej',
      btnSupport: 'Wesprzyj'
    },
    about: {
      title: 'Kim jesteśmy',
      description: 'Nasza organizacja to niezależny think tank działający na styku ekonomii i prawa. Dążymy do budowy państwa prawa poprzez wysokiej jakości analitykę.',
      cards: {
        innovation: {
          title: 'Innowacje',
          desc: 'Wykorzystujemy nowoczesne metody analizy danych do znajdowania niestandardowych rozwiązań złożonych problemów ekonomicznych.'
        },
        justice: {
          title: 'Sprawiedliwość',
          desc: 'Nasze badania prawne mają na celu ochronę interesów społeczeństwa i zapewnienie równych szans.'
        },
        community: {
          title: 'Społeczność',
          desc: 'Łączymy ekspertów, aktywistów i biznes w celu dialogu i wspólnego rozwiązywania pilnych problemów.'
        }
      }
    },
    services: {
      title: 'Nasze obszary działania',
      subtitle: 'Kompleksowe podejście do zmian',
      items: [
        {
          title: 'Analiza ekonomiczna',
          desc: 'Badania rynku, prognozowanie makroekonomiczne i ocena klimatu inwestycyjnego.'
        },
        {
          title: 'Ekspertyza prawna',
          desc: 'Analiza projektów ustaw, opracowywanie aktów regulacyjnych i audyt prawny.'
        },
        {
          title: 'Kontrola społeczna',
          desc: 'Monitorowanie działań władz i wykorzystania finansów publicznych.'
        },
        {
          title: 'Projekty edukacyjne',
          desc: 'Prowadzenie szkoleń, seminariów i konferencji w celu podnoszenia kultury prawnej.'
        }
      ]
    },
    team: {
      title: 'Nasz Zespół',
      subtitle: 'Profesjonaliści tworzący zmiany.',
      members: [
        { name: 'Oleksandr Petrenko', role: 'Dyrektor, Ekonomista' },
        { name: 'Maria Koval', role: 'Główny Prawnik' },
        { name: 'Ivan Boyko', role: 'Analityk Danych' }
      ]
    },
    contact: {
      title: 'Skontaktuj się z nami',
      description: 'Masz pomysły na współpracę lub pytania dotyczące naszej działalności? Jesteśmy zawsze otwarci na dialog. Wypełnij formularz, a odpowiemy wkrótce.',
      addressTitle: 'Adres',
      addressValue: 'ul. Instytutska 1, Kijów, 01001',
      emailTitle: 'Email',
      phoneTitle: 'Telefon',
      formTitle: 'Napisz do nas',
      form: {
        name: 'Imię',
        namePlaceholder: 'Twoje imię',
        email: 'Email',
        emailPlaceholder: 'example@mail.com',
        message: 'Wiadomość',
        messagePlaceholder: 'Treść twojej wiadomości...',
        submit: 'Wyślij',
        submitting: 'Wysyłanie...',
        success: 'Wiadomość została pomyślnie wysłana!'
      }
    },
    footer: {
      rights: '© 2024 Centrum Analityki Ekonomiczno-Prawnej',
      privacy: 'Polityka prywatności',
      terms: 'Warunki korzystania'
    }
  },
  en: {
    nav: {
      about: 'About Us',
      services: 'Activities',
      team: 'Team',
      contact: 'Contact',
      support: 'Support Us'
    },
    hero: {
      badge: 'Expert view on the future',
      titleStart: 'Center for Economic and Legal',
      titleEnd: 'Analytics',
      description: 'We combine deep economic expertise and legal analysis to create sustainable solutions in the public and private sectors.',
      btnContact: 'Contact Us',
      btnMore: 'Learn More',
      btnSupport: 'Support'
    },
    about: {
      title: 'Who We Are',
      description: 'Our organization is an independent think tank working at the intersection of economics and law. We strive to build the rule of law through quality analytics.',
      cards: {
        innovation: {
          title: 'Innovation',
          desc: 'We use modern data analysis methods to find non-standard solutions to complex economic problems.'
        },
        justice: {
          title: 'Justice',
          desc: 'Our legal research aims to protect the interests of society and ensure equal opportunities.'
        },
        community: {
          title: 'Community',
          desc: 'We bring together experts, activists, and business for dialogue and joint resolution of urgent issues.'
        }
      }
    },
    services: {
      title: 'Our Activities',
      subtitle: 'Comprehensive approach to change',
      items: [
        {
          title: 'Economic Analysis',
          desc: 'Market research, macroeconomic forecasting, and investment climate assessment.'
        },
        {
          title: 'Legal Expertise',
          desc: 'Analysis of draft laws, development of regulatory acts, and legal audit.'
        },
        {
          title: 'Public Control',
          desc: 'Monitoring of government activities and use of public finances.'
        },
        {
          title: 'Educational Projects',
          desc: 'Conducting trainings, seminars, and conferences to improve legal culture.'
        }
      ]
    },
    team: {
      title: 'Our Team',
      subtitle: 'Professionals creating change.',
      members: [
        { name: 'Oleksandr Petrenko', role: 'Director, Economist' },
        { name: 'Maria Koval', role: 'Chief Lawyer' },
        { name: 'Ivan Boyko', role: 'Data Analyst' }
      ]
    },
    contact: {
      title: 'Contact Us',
      description: 'Have ideas for cooperation or questions about our activities? We are always open to dialogue. Fill out the form, and we will reply shortly.',
      addressTitle: 'Address',
      addressValue: '1 Instytutska St., Kyiv, 01001',
      emailTitle: 'Email',
      phoneTitle: 'Phone',
      formTitle: 'Write to Us',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'example@mail.com',
        message: 'Message',
        messagePlaceholder: 'Your message text...',
        submit: 'Send',
        submitting: 'Sending...',
        success: 'Message sent successfully!'
      }
    },
    footer: {
      rights: '© 2024 Center for Economic and Legal Analytics',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('uk');
  
  t = computed(() => TRANSLATIONS[this.currentLang()]);

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    document.documentElement.lang = lang;
  }
}