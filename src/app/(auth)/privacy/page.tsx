import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Link href="/signup" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Политика конфиденциальности (Privacy Policy)</h1>
      <p className="text-gray-500 mb-8">Последнее обновление: 29 мая 2026 года</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-8">
          <p className="text-blue-800">
            Настоящая Политика конфиденциальности разработана в соответствии с требованиями
            Регламента (ЕС) 2016/679 (General Data Protection Regulation, GDPR) и Федерального
            закона Российской Федерации от 27.07.2006 № 152-ФЗ «О персональных данных» (ФЗ-152).
          </p>
        </div>

        {/* 1. Оператор персональных данных */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Оператор персональных данных (Data Controller)</h2>

          <p className="mb-4">
            Оператором персональных данных, ответственным за сбор, обработку и защиту Ваших персональных
            данных при использовании сервиса ContractGen, является:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <p className="mb-2"><strong>Наименование:</strong> ContractGen Inc.</p>
            <p className="mb-2"><strong>Юридический адрес:</strong> 251 Little Falls Drive, Wilmington, Delaware 19808, USA</p>
            <p className="mb-2"><strong>Регистрационный номер:</strong> [Registration Number]</p>
            <p className="mb-2"><strong>Email:</strong> privacy@contractgen.io</p>
            <p className="mb-2"><strong>Веб-сайт:</strong> contractgen.io</p>
          </div>

          <p className="mb-3">
            <strong>1.1. Ответственный за защиту данных (Data Protection Officer / DPO).</strong>
            В соответствии с требованиями GDPR, мы назначили Ответственного за защиту данных,
            к которому Вы можете обратиться по всем вопросам, связанным с обработкой Ваших
            персональных данных и реализацией Ваших прав.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="mb-1"><strong>Контакт DPO:</strong></p>
            <p className="mb-1">Email: dpo@contractgen.io</p>
            <p>Тема письма: Data Protection Inquiry</p>
          </div>

          <p className="mb-3">
            <strong>1.2. Представитель в ЕС.</strong> Для субъектов данных, находящихся на территории
            Европейского Союза, мы назначили представителя в соответствии со статьёй 27 GDPR.
            Контактные данные представителя: eu-representative@contractgen.io.
          </p>

          <p className="mb-3">
            <strong>1.3. Представитель в России.</strong> Для субъектов персональных данных,
            находящихся на территории Российской Федерации, вопросы обработки персональных данных
            могут быть адресованы на: russia@contractgen.io.
          </p>
        </section>

        {/* 2. Какие данные мы собираем */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Какие данные мы собираем (Data We Collect)</h2>

          <p className="mb-4">
            Мы собираем и обрабатываем следующие категории персональных данных:
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-3">2.1. Данные, предоставляемые Вами напрямую (Data You Provide)</h3>

          <p className="mb-3">
            <strong>a) Регистрационные данные:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Адрес электронной почты (email address)</li>
            <li>Имя и фамилия (full name)</li>
            <li>Название организации (company name) — при наличии</li>
            <li>Пароль (в зашифрованном виде)</li>
            <li>Фотография профиля — при загрузке</li>
          </ul>

          <p className="mb-3">
            <strong>b) Контент договоров (Contract Content):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Имена сторон договора (инфлюенсеры, бренды, агентства)</li>
            <li>Контактные данные сторон (email, телефон, адрес)</li>
            <li>Финансовые условия (суммы вознаграждения, графики оплаты)</li>
            <li>Условия сотрудничества (сроки, обязательства, ограничения)</li>
            <li>Параметры контента (платформы, форматы, требования)</li>
            <li>Иные данные, вводимые в формы генерации договоров</li>
          </ul>

          <p className="mb-3">
            <strong>c) Платёжные данные (Payment Data):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Данные банковской карты (обрабатываются исключительно через Stripe)</li>
            <li>Платёжный адрес (billing address)</li>
            <li>История транзакций</li>
            <li>Налоговый идентификационный номер (при необходимости выставления счетов)</li>
          </ul>

          <p className="mb-3">
            <strong>d) Коммуникационные данные:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Содержание обращений в службу поддержки</li>
            <li>Переписка по электронной почте</li>
            <li>Отзывы и комментарии</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-3">2.2. Данные, собираемые автоматически (Automatically Collected Data)</h3>

          <p className="mb-3">
            <strong>a) Технические данные:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>IP-адрес (IP address)</li>
            <li>Тип и версия браузера (browser type and version)</li>
            <li>Операционная система (operating system)</li>
            <li>Тип устройства (desktop, mobile, tablet)</li>
            <li>Разрешение экрана</li>
            <li>Языковые настройки</li>
            <li>Часовой пояс</li>
          </ul>

          <p className="mb-3">
            <strong>b) Данные об использовании (Usage Data):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Дата и время посещения</li>
            <li>Просмотренные страницы и время на странице</li>
            <li>Последовательность действий (clickstream data)</li>
            <li>Источник перехода (referrer URL)</li>
            <li>Количество сгенерированных договоров</li>
            <li>Используемые функции и шаблоны</li>
            <li>Ошибки и сбои при использовании</li>
          </ul>

          <p className="mb-3">
            <strong>c) Данные cookies и схожих технологий:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Идентификаторы сессии</li>
            <li>Предпочтения пользователя</li>
            <li>Аутентификационные токены</li>
            <li>Аналитические идентификаторы</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-3">2.3. Данные из сторонних источников (Third-Party Data)</h3>

          <p className="mb-3">
            При авторизации через сторонние сервисы (OAuth) мы можем получать:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Google: email, имя, фото профиля, идентификатор Google</li>
            <li>GitHub: email, имя, фото профиля, идентификатор GitHub</li>
          </ul>
        </section>

        {/* 3. Правовые основания обработки */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Правовые основания обработки (Legal Basis for Processing)</h2>

          <p className="mb-4">
            В соответствии с GDPR (статья 6) и ФЗ-152 (статья 6), мы обрабатываем персональные
            данные на следующих правовых основаниях:
          </p>

          <p className="mb-3">
            <strong>3.1. Исполнение договора (Contract Performance) — Статья 6(1)(b) GDPR.</strong>
            Обработка необходима для исполнения договора, стороной которого Вы являетесь
            (Пользовательское соглашение), или для принятия мер по Вашему запросу до заключения договора.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Создание и управление Учётной записью</li>
            <li>Предоставление услуг генерации договоров</li>
            <li>Обработка платежей</li>
            <li>Обеспечение технической поддержки</li>
          </ul>

          <p className="mb-3">
            <strong>3.2. Согласие (Consent) — Статья 6(1)(a) GDPR.</strong>
            Вы дали согласие на обработку персональных данных для одной или нескольких конкретных целей.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Маркетинговые рассылки и новостные письма</li>
            <li>Использование необязательных cookies (аналитических, маркетинговых)</li>
            <li>Персонализированная реклама</li>
            <li>Участие в исследованиях и опросах</li>
          </ul>

          <p className="mb-3">
            <strong>3.3. Законные интересы (Legitimate Interests) — Статья 6(1)(f) GDPR.</strong>
            Обработка необходима для реализации законных интересов Оператора или третьей стороны,
            за исключением случаев, когда такие интересы перевешиваются интересами или правами
            субъекта данных.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Улучшение и развитие Сервиса</li>
            <li>Анализ использования для оптимизации</li>
            <li>Обеспечение безопасности и предотвращение мошенничества</li>
            <li>Защита прав и законных интересов Оператора</li>
            <li>Коммуникация по сервисным вопросам</li>
          </ul>

          <p className="mb-3">
            <strong>3.4. Юридические обязательства (Legal Obligation) — Статья 6(1)(c) GDPR.</strong>
            Обработка необходима для выполнения юридических обязательств Оператора.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Ведение бухгалтерского и налогового учёта</li>
            <li>Предоставление информации по запросам государственных органов</li>
            <li>Соблюдение требований о противодействии отмыванию денег (AML)</li>
          </ul>
        </section>

        {/* 4. Цели обработки данных */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Цели обработки данных (How We Use Your Data)</h2>

          <p className="mb-4">
            Мы используем собранные персональные данные для следующих целей:
          </p>

          <p className="mb-3">
            <strong>4.1. Предоставление основных услуг:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Регистрация и аутентификация пользователей</li>
            <li>Генерация договоров на основе введённых данных</li>
            <li>Хранение и управление сгенерированными документами</li>
            <li>Обеспечение доступа к функционалу согласно тарифному плану</li>
          </ul>

          <p className="mb-3">
            <strong>4.2. Обработка платежей:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Проведение платежных транзакций</li>
            <li>Управление подписками и выставление счетов</li>
            <li>Возврат средств при необходимости</li>
            <li>Предотвращение мошеннических транзакций</li>
          </ul>

          <p className="mb-3">
            <strong>4.3. Коммуникация:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Отправка сервисных уведомлений (подтверждение регистрации, изменение пароля)</li>
            <li>Информирование об изменениях в условиях обслуживания</li>
            <li>Ответы на обращения в службу поддержки</li>
            <li>Маркетинговые коммуникации (при наличии согласия)</li>
          </ul>

          <p className="mb-3">
            <strong>4.4. Улучшение сервиса:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Анализ использования для выявления проблем</li>
            <li>Разработка новых функций на основе обратной связи</li>
            <li>Оптимизация производительности</li>
            <li>Персонализация пользовательского опыта</li>
          </ul>

          <p className="mb-3">
            <strong>4.5. Обеспечение безопасности:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Обнаружение и предотвращение несанкционированного доступа</li>
            <li>Мониторинг подозрительной активности</li>
            <li>Защита от DDoS-атак и других угроз</li>
            <li>Аудит и ведение журналов безопасности</li>
          </ul>

          <p className="mb-3">
            <strong>4.6. Соблюдение правовых требований:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Выполнение требований законодательства</li>
            <li>Ответы на запросы государственных органов</li>
            <li>Защита прав в судебных разбирательствах</li>
          </ul>
        </section>

        {/* 5. Передача данных третьим лицам */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Передача данных третьим лицам (Data Sharing)</h2>

          <p className="mb-4">
            Мы можем передавать Ваши персональные данные следующим категориям получателей:
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-3">5.1. Поставщики услуг (Service Providers)</h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">Поставщик</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Цель</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Данные</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Юрисдикция</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2"><strong>Supabase</strong></td>
                  <td className="border border-gray-200 px-4 py-2">Хостинг базы данных, аутентификация</td>
                  <td className="border border-gray-200 px-4 py-2">Все данные аккаунта, контент договоров</td>
                  <td className="border border-gray-200 px-4 py-2">США</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2"><strong>Stripe</strong></td>
                  <td className="border border-gray-200 px-4 py-2">Обработка платежей</td>
                  <td className="border border-gray-200 px-4 py-2">Платёжные данные, email, имя</td>
                  <td className="border border-gray-200 px-4 py-2">США</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2"><strong>OpenAI</strong></td>
                  <td className="border border-gray-200 px-4 py-2">AI-генерация договоров</td>
                  <td className="border border-gray-200 px-4 py-2">Данные из форм генерации (анонимизированные)</td>
                  <td className="border border-gray-200 px-4 py-2">США</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2"><strong>Anthropic</strong></td>
                  <td className="border border-gray-200 px-4 py-2">AI-генерация договоров (альтернативный провайдер)</td>
                  <td className="border border-gray-200 px-4 py-2">Данные из форм генерации (анонимизированные)</td>
                  <td className="border border-gray-200 px-4 py-2">США</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2"><strong>Resend</strong></td>
                  <td className="border border-gray-200 px-4 py-2">Отправка email-уведомлений</td>
                  <td className="border border-gray-200 px-4 py-2">Email, имя</td>
                  <td className="border border-gray-200 px-4 py-2">США</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2"><strong>Vercel</strong></td>
                  <td className="border border-gray-200 px-4 py-2">Хостинг веб-приложения</td>
                  <td className="border border-gray-200 px-4 py-2">IP-адрес, технические данные</td>
                  <td className="border border-gray-200 px-4 py-2">США</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-medium text-gray-900 mb-3">5.2. Аналитические сервисы</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Google Analytics:</strong> анализ трафика и поведения пользователей (при наличии согласия)</li>
            <li><strong>Mixpanel:</strong> продуктовая аналитика (при наличии согласия)</li>
            <li><strong>Sentry:</strong> мониторинг ошибок и производительности</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-3">5.3. Иные случаи передачи</h3>
          <p className="mb-3">
            <strong>a) Юридические требования:</strong> Мы можем раскрыть данные, если это требуется
            законом, судебным решением или запросом государственного органа.
          </p>
          <p className="mb-3">
            <strong>b) Защита прав:</strong> Для защиты наших прав, собственности или безопасности,
            а также прав, собственности или безопасности наших пользователей или третьих лиц.
          </p>
          <p className="mb-3">
            <strong>c) Реорганизация бизнеса:</strong> В случае слияния, поглощения, продажи активов
            или банкротства персональные данные могут быть переданы правопреемнику.
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-3">5.4. Гарантии при передаче</h3>
          <p className="mb-3">
            Все поставщики услуг связаны договорными обязательствами по защите данных (Data Processing
            Agreements), соответствующими требованиям GDPR и ФЗ-152. Мы проводим проверку (due diligence)
            поставщиков на соответствие стандартам безопасности.
          </p>
        </section>

        {/* 6. Международная передача данных */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Международная передача данных (International Data Transfers)</h2>

          <p className="mb-3">
            <strong>6.1. Передача в США и третьи страны.</strong> Наши серверы и большинство
            поставщиков услуг расположены в Соединённых Штатах Америки. При передаче данных
            из ЕС или России в США и другие страны, не обеспечивающие адекватный уровень
            защиты данных, мы применяем следующие механизмы защиты:
          </p>

          <p className="mb-3">
            <strong>6.2. Стандартные договорные положения (Standard Contractual Clauses, SCC).</strong>
            Мы заключаем с поставщиками услуг Стандартные договорные положения, утверждённые
            Европейской комиссией (Решение 2021/914), обеспечивающие адекватный уровень защиты
            данных при трансграничной передаче.
          </p>

          <p className="mb-3">
            <strong>6.3. Data Privacy Framework.</strong> Где применимо, мы работаем с компаниями,
            сертифицированными в рамках EU-U.S. Data Privacy Framework, Swiss-U.S. Data Privacy
            Framework и UK Extension.
          </p>

          <p className="mb-3">
            <strong>6.4. Дополнительные меры защиты.</strong> Помимо договорных механизмов,
            мы применяем технические и организационные меры защиты, включая шифрование данных
            при передаче (TLS 1.3) и хранении, псевдонимизацию и минимизацию данных.
          </p>

          <p className="mb-3">
            <strong>6.5. Особенности для России.</strong> В соответствии с требованиями ФЗ-152
            (пункт 5 статьи 18), при сборе персональных данных граждан Российской Федерации
            через сеть Интернет обеспечивается запись, систематизация, накопление, хранение
            персональных данных граждан РФ с использованием баз данных, находящихся на
            территории Российской Федерации, за исключением случаев, предусмотренных
            законодательством.
          </p>
        </section>

        {/* 7. Сроки хранения данных */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Сроки хранения данных (Data Retention)</h2>

          <p className="mb-4">
            Мы храним персональные данные в течение периода, необходимого для достижения целей
            обработки или в соответствии с требованиями законодательства:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">Категория данных</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Срок хранения</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Основание</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Данные Учётной записи</td>
                  <td className="border border-gray-200 px-4 py-2">До удаления аккаунта + 30 дней</td>
                  <td className="border border-gray-200 px-4 py-2">Исполнение договора</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Сгенерированные договоры</td>
                  <td className="border border-gray-200 px-4 py-2">До удаления аккаунта + 30 дней</td>
                  <td className="border border-gray-200 px-4 py-2">Исполнение договора</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Платёжные данные</td>
                  <td className="border border-gray-200 px-4 py-2">7 лет с момента транзакции</td>
                  <td className="border border-gray-200 px-4 py-2">Налоговое законодательство</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Счета и инвойсы</td>
                  <td className="border border-gray-200 px-4 py-2">7 лет</td>
                  <td className="border border-gray-200 px-4 py-2">Бухгалтерский учёт</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Журналы безопасности</td>
                  <td className="border border-gray-200 px-4 py-2">1 год</td>
                  <td className="border border-gray-200 px-4 py-2">Законные интересы</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Данные об использовании</td>
                  <td className="border border-gray-200 px-4 py-2">2 года</td>
                  <td className="border border-gray-200 px-4 py-2">Законные интересы</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Cookies (аналитические)</td>
                  <td className="border border-gray-200 px-4 py-2">13 месяцев</td>
                  <td className="border border-gray-200 px-4 py-2">Согласие</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Обращения в поддержку</td>
                  <td className="border border-gray-200 px-4 py-2">3 года с момента закрытия тикета</td>
                  <td className="border border-gray-200 px-4 py-2">Законные интересы</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Маркетинговые согласия</td>
                  <td className="border border-gray-200 px-4 py-2">До отзыва + 3 года</td>
                  <td className="border border-gray-200 px-4 py-2">Юридические обязательства</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-3">
            <strong>7.1. Удаление данных.</strong> По истечении срока хранения данные удаляются
            или анонимизируются. Резервные копии могут сохраняться до 90 дней после удаления
            из основной базы данных.
          </p>

          <p className="mb-3">
            <strong>7.2. Данные в спящих аккаунтах.</strong> Если Учётная запись неактивна
            в течение 24 месяцев, мы можем направить уведомление о предстоящем удалении.
            При отсутствии ответа в течение 30 дней аккаунт и связанные данные будут удалены.
          </p>
        </section>

        {/* 8. Ваши права по GDPR */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">8. Ваши права по GDPR (Your Rights Under GDPR)</h2>

          <p className="mb-4 text-green-800">
            Если Вы находитесь на территории Европейского Союза или Европейской экономической зоны,
            Вы имеете следующие права в отношении Ваших персональных данных:
          </p>

          <p className="mb-3">
            <strong>8.1. Право на доступ (Right of Access) — Статья 15 GDPR.</strong>
            Вы имеете право получить подтверждение того, обрабатываем ли мы Ваши персональные
            данные, и получить доступ к этим данным, а также к информации о целях обработки,
            категориях данных, получателях и сроках хранения.
          </p>

          <p className="mb-3">
            <strong>8.2. Право на исправление (Right to Rectification) — Статья 16 GDPR.</strong>
            Вы имеете право потребовать исправления неточных персональных данных или дополнения
            неполных данных.
          </p>

          <p className="mb-3">
            <strong>8.3. Право на удаление (Right to Erasure / Right to be Forgotten) — Статья 17 GDPR.</strong>
            Вы имеете право потребовать удаления Ваших персональных данных в следующих случаях:
            (a) данные больше не нужны для целей, для которых они были собраны;
            (b) Вы отзываете согласие и иные правовые основания отсутствуют;
            (c) Вы возражаете против обработки; (d) данные обрабатываются незаконно.
          </p>

          <p className="mb-3">
            <strong>8.4. Право на переносимость данных (Right to Data Portability) — Статья 20 GDPR.</strong>
            Вы имеете право получить Ваши персональные данные в структурированном, машиночитаемом
            формате (JSON, CSV) и передать их другому оператору.
          </p>

          <p className="mb-3">
            <strong>8.5. Право на ограничение обработки (Right to Restriction of Processing) — Статья 18 GDPR.</strong>
            Вы имеете право потребовать ограничения обработки Ваших данных, например, пока
            проверяется их точность или законность обработки.
          </p>

          <p className="mb-3">
            <strong>8.6. Право на возражение (Right to Object) — Статья 21 GDPR.</strong>
            Вы имеете право возразить против обработки Ваших данных на основании законных интересов
            или для целей прямого маркетинга.
          </p>

          <p className="mb-3">
            <strong>8.7. Право на отзыв согласия (Right to Withdraw Consent) — Статья 7(3) GDPR.</strong>
            Если обработка основана на согласии, Вы имеете право отозвать согласие в любое время.
            Отзыв согласия не влияет на законность обработки, осуществлённой до отзыва.
          </p>

          <p className="mb-3">
            <strong>8.8. Право на подачу жалобы (Right to Lodge a Complaint).</strong>
            Вы имеете право подать жалобу в надзорный орган по защите данных в Вашей стране.
            Для Германии это Bundesbeauftragter für den Datenschutz und die Informationsfreiheit (BfDI),
            для Франции — Commission Nationale de l'Informatique et des Libertés (CNIL) и т.д.
          </p>

          <p className="mb-3">
            <strong>8.9. Автоматизированное принятие решений.</strong>
            Мы не принимаем решений, основанных исключительно на автоматизированной обработке,
            включая профилирование, которые имели бы юридические последствия для Вас.
          </p>

          <div className="bg-white p-4 rounded mt-4">
            <p className="font-medium mb-2">Для реализации Ваших прав:</p>
            <p>Email: privacy@contractgen.io</p>
            <p>Тема письма: GDPR Rights Request</p>
            <p className="mt-2 text-sm text-gray-600">Срок ответа: 30 дней (может быть продлён на 2 месяца при сложности запроса)</p>
          </div>
        </section>

        {/* 9. Ваши права по ФЗ-152 */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">9. Ваши права по ФЗ-152 (Your Rights Under Russian Law)</h2>

          <p className="mb-4 text-blue-800">
            Если Вы являетесь субъектом персональных данных на территории Российской Федерации,
            Вы имеете следующие права в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ
            «О персональных данных»:
          </p>

          <p className="mb-3">
            <strong>9.1. Право на получение информации (Статья 14 ФЗ-152).</strong>
            Вы имеете право на получение информации, касающейся обработки Ваших персональных
            данных, включая: (а) подтверждение факта обработки; (б) правовые основания и цели
            обработки; (в) цели и применяемые способы обработки; (г) наименование и место
            нахождения оператора; (д) лица, имеющие доступ к данным; (е) перечень обрабатываемых
            данных; (ж) сроки обработки и хранения; (з) порядок осуществления прав.
          </p>

          <p className="mb-3">
            <strong>9.2. Право на уточнение (Статья 14 ФЗ-152).</strong>
            Вы имеете право требовать от оператора уточнения Ваших персональных данных,
            их блокирования или уничтожения в случае, если данные являются неполными,
            устаревшими, неточными, незаконно полученными или не являются необходимыми
            для заявленной цели обработки.
          </p>

          <p className="mb-3">
            <strong>9.3. Право на отзыв согласия (Статья 9 ФЗ-152).</strong>
            Вы имеете право отозвать согласие на обработку персональных данных путём
            направления соответствующего уведомления оператору. Отзыв согласия должен
            быть в письменной форме или в форме электронного документа, подписанного
            в соответствии с законодательством.
          </p>

          <p className="mb-3">
            <strong>9.4. Право на прекращение обработки для целей продвижения (Статья 15 ФЗ-152).</strong>
            Вы имеете право требовать прекращения обработки персональных данных в целях
            продвижения товаров, работ, услуг путём осуществления прямых контактов с Вами.
          </p>

          <p className="mb-3">
            <strong>9.5. Право на обжалование (Статья 17 ФЗ-152).</strong>
            Если Вы считаете, что оператор осуществляет обработку Ваших персональных данных
            с нарушением требований ФЗ-152 или иным образом нарушает Ваши права и свободы,
            Вы вправе обжаловать действия или бездействие оператора в Федеральную службу
            по надзору в сфере связи, информационных технологий и массовых коммуникаций
            (Роскомнадзор) или в судебном порядке.
          </p>

          <div className="bg-white p-4 rounded mt-4">
            <p className="font-medium mb-2">Контакты для запросов по ФЗ-152:</p>
            <p>Email: privacy@contractgen.io</p>
            <p>Тема письма: Запрос субъекта ПДн</p>
            <p className="mt-2 text-sm text-gray-600">Срок ответа: 30 дней с момента получения запроса</p>
          </div>
        </section>

        {/* 10. Политика в отношении cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Политика в отношении cookies (Cookie Policy)</h2>

          <p className="mb-4">
            Мы используем файлы cookies и аналогичные технологии для обеспечения функционирования
            Сервиса и улучшения пользовательского опыта.
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-3">10.1. Типы используемых cookies</h3>

          <p className="mb-3">
            <strong>a) Строго необходимые cookies (Strictly Necessary):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Аутентификационные cookies (идентификация сессии пользователя)</li>
            <li>Cookies безопасности (CSRF-токены, защита от атак)</li>
            <li>Cookies балансировки нагрузки</li>
            <li>Cookies согласия на использование cookies</li>
          </ul>
          <p className="mb-4 text-sm text-gray-500">
            Правовое основание: необходимы для предоставления услуги. Согласие не требуется.
          </p>

          <p className="mb-3">
            <strong>b) Функциональные cookies (Functional):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Языковые предпочтения</li>
            <li>Настройки отображения (тема, размер шрифта)</li>
            <li>Запоминание выбора пользователя</li>
          </ul>
          <p className="mb-4 text-sm text-gray-500">
            Правовое основание: законные интересы / согласие.
          </p>

          <p className="mb-3">
            <strong>c) Аналитические cookies (Analytics):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Google Analytics (_ga, _gid, _gat)</li>
            <li>Mixpanel (mp_*)</li>
            <li>Hotjar (для анализа поведения)</li>
          </ul>
          <p className="mb-4 text-sm text-gray-500">
            Правовое основание: согласие. Устанавливаются только после получения согласия.
          </p>

          <p className="mb-3">
            <strong>d) Маркетинговые cookies (Marketing):</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Google Ads (для ремаркетинга)</li>
            <li>Facebook Pixel (для отслеживания конверсий)</li>
            <li>LinkedIn Insight Tag</li>
          </ul>
          <p className="mb-4 text-sm text-gray-500">
            Правовое основание: согласие. Устанавливаются только после получения согласия.
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-3">10.2. Управление cookies</h3>

          <p className="mb-3">
            Вы можете управлять настройками cookies следующими способами:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Баннер согласия:</strong> при первом посещении сайта Вы можете выбрать,
            какие категории cookies разрешить.</li>
            <li><strong>Настройки браузера:</strong> Вы можете отключить или удалить cookies
            через настройки Вашего браузера.</li>
            <li><strong>Отказ от отслеживания:</strong> Вы можете использовать инструменты
            opt-out от Google Analytics (tools.google.com/dlpage/gaoptout) и других сервисов.</li>
          </ul>

          <p className="mb-3">
            <strong>Обратите внимание:</strong> отключение строго необходимых cookies может
            нарушить работу Сервиса.
          </p>
        </section>

        {/* 11. Конфиденциальность детей */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Конфиденциальность детей (Children's Privacy)</h2>

          <p className="mb-3">
            <strong>11.1. Возрастное ограничение.</strong> Сервис ContractGen предназначен
            исключительно для лиц, достигших возраста 18 (восемнадцати) лет. Мы не осуществляем
            сознательного сбора персональных данных лиц младше 18 лет.
          </p>

          <p className="mb-3">
            <strong>11.2. Обнаружение данных несовершеннолетних.</strong> Если нам станет известно,
            что мы собрали персональные данные лица младше 18 лет без надлежащего согласия
            родителя или законного представителя, мы примем меры для незамедлительного
            удаления таких данных.
          </p>

          <p className="mb-3">
            <strong>11.3. Уведомление о несовершеннолетних.</strong> Если Вы являетесь родителем
            или законным представителем и считаете, что Ваш ребёнок предоставил нам персональные
            данные, пожалуйста, свяжитесь с нами по адресу privacy@contractgen.io для удаления
            таких данных.
          </p>

          <p className="mb-3">
            <strong>11.4. Соответствие COPPA.</strong> Мы соблюдаем требования Children's Online
            Privacy Protection Act (COPPA) США, запрещающего сбор данных детей младше 13 лет.
          </p>
        </section>

        {/* 12. Меры безопасности */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Меры безопасности (Security Measures)</h2>

          <p className="mb-4">
            Мы применяем комплекс технических и организационных мер для защиты Ваших
            персональных данных от несанкционированного доступа, изменения, раскрытия
            или уничтожения:
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-3">12.1. Технические меры</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Шифрование при передаче:</strong> все данные передаются по защищённому
            протоколу TLS 1.3 (HTTPS).</li>
            <li><strong>Шифрование при хранении:</strong> персональные данные и сгенерированные
            договоры шифруются с использованием алгоритма AES-256.</li>
            <li><strong>Хеширование паролей:</strong> пароли хранятся в виде хешей с использованием
            bcrypt с солью.</li>
            <li><strong>Двухфакторная аутентификация (2FA):</strong> доступна для дополнительной
            защиты аккаунтов.</li>
            <li><strong>Брандмауэр веб-приложений (WAF):</strong> защита от распространённых атак
            (SQL-инъекции, XSS, CSRF).</li>
            <li><strong>Мониторинг и оповещения:</strong> системы обнаружения вторжений (IDS)
            и мониторинг аномалий.</li>
            <li><strong>Регулярные обновления:</strong> своевременное применение патчей безопасности.</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-3">12.2. Организационные меры</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Принцип минимальных привилегий:</strong> доступ к данным предоставляется
            только тем сотрудникам, которым он необходим для выполнения служебных обязанностей.</li>
            <li><strong>Обучение персонала:</strong> регулярное обучение сотрудников по вопросам
            защиты данных и информационной безопасности.</li>
            <li><strong>Политики и процедуры:</strong> внутренние политики обработки данных,
            реагирования на инциденты, резервного копирования.</li>
            <li><strong>Аудиты безопасности:</strong> периодические внутренние и внешние аудиты
            безопасности.</li>
            <li><strong>Проверка поставщиков:</strong> due diligence поставщиков услуг на соответствие
            стандартам безопасности.</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-3">12.3. Уведомление об инцидентах</h3>
          <p className="mb-3">
            В случае нарушения безопасности персональных данных (data breach) мы уведомим
            надзорный орган в течение 72 часов (в соответствии со статьёй 33 GDPR) и затронутых
            субъектов данных без неоправданной задержки (если нарушение создаёт высокий риск
            для их прав и свобод).
          </p>
        </section>

        {/* 13. Изменения политики */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Изменения политики (Changes to Policy)</h2>

          <p className="mb-3">
            <strong>13.1. Право на изменение.</strong> Мы оставляем за собой право изменять
            настоящую Политику конфиденциальности в любое время. Изменения вступают в силу
            с момента публикации обновлённой версии на Сервисе.
          </p>

          <p className="mb-3">
            <strong>13.2. Уведомление об изменениях.</strong> О существенных изменениях в Политике
            конфиденциальности мы уведомим Вас путём:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Размещения уведомления на главной странице Сервиса</li>
            <li>Отправки электронного письма на адрес, связанный с Вашей Учётной записью</li>
            <li>Отображения баннера при входе в Сервис</li>
          </ul>

          <p className="mb-3">
            <strong>13.3. Повторное согласие.</strong> Если изменения затрагивают обработку
            данных, основанную на Вашем согласии, мы запросим повторное согласие до применения
            таких изменений.
          </p>

          <p className="mb-3">
            <strong>13.4. Версионирование.</strong> Дата последнего обновления указывается
            в начале Политики. Мы храним архив предыдущих версий Политики, доступный по запросу.
          </p>

          <p className="mb-3">
            <strong>13.5. Ваши действия.</strong> Продолжение использования Сервиса после
            вступления в силу изменений означает Ваше согласие с обновлённой Политикой.
            Если Вы не согласны с изменениями, Вы должны прекратить использование Сервиса
            и удалить свою Учётную запись.
          </p>
        </section>

        {/* 14. Контактная информация */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Контактная информация (Contact Us)</h2>

          <p className="mb-4">
            По вопросам, связанным с обработкой персональных данных и настоящей Политикой
            конфиденциальности, Вы можете связаться с нами:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div>
              <p className="font-medium mb-2">Общие вопросы по конфиденциальности:</p>
              <p>Email: privacy@contractgen.io</p>
            </div>

            <div>
              <p className="font-medium mb-2">Ответственный за защиту данных (DPO):</p>
              <p>Email: dpo@contractgen.io</p>
              <p>Тема письма: DPO Inquiry</p>
            </div>

            <div>
              <p className="font-medium mb-2">Запросы на реализацию прав субъектов данных:</p>
              <p>Email: privacy@contractgen.io</p>
              <p>Тема письма: Data Subject Request / Запрос субъекта ПДн</p>
            </div>

            <div>
              <p className="font-medium mb-2">Уведомление об инцидентах безопасности:</p>
              <p>Email: security@contractgen.io</p>
            </div>

            <div>
              <p className="font-medium mb-2">Почтовый адрес:</p>
              <p>ContractGen Inc.</p>
              <p>251 Little Falls Drive</p>
              <p>Wilmington, Delaware 19808, USA</p>
            </div>
          </div>

          <p className="mt-6 text-gray-600">
            <strong>Время ответа:</strong> Мы стремимся отвечать на все запросы в течение
            30 дней. В случае сложных запросов срок может быть продлён до 60 дней с уведомлением.
          </p>
        </section>

        {/* 15. Применимое законодательство */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Применимое законодательство (Governing Law)</h2>

          <p className="mb-3">
            <strong>15.1. Общее правило.</strong> Настоящая Политика конфиденциальности
            регулируется и толкуется в соответствии с законодательством штата Делавэр, США,
            без учёта коллизионных норм.
          </p>

          <p className="mb-3">
            <strong>15.2. Для субъектов данных из ЕС.</strong> Для субъектов данных, находящихся
            на территории Европейского Союза или Европейской экономической зоны, применяются
            положения Регламента (ЕС) 2016/679 (GDPR) и применимое национальное законодательство
            о защите данных.
          </p>

          <p className="mb-3">
            <strong>15.3. Для субъектов персональных данных из России.</strong> Для субъектов
            персональных данных, находящихся на территории Российской Федерации, применяются
            положения Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»
            и иные применимые нормативные правовые акты Российской Федерации.
          </p>

          <p className="mb-3">
            <strong>15.4. Приоритет.</strong> В случае противоречия между настоящей Политикой
            и императивными нормами GDPR или ФЗ-152, применяются соответствующие императивные нормы.
          </p>
        </section>

        {/* Заключение */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-gray-500 text-sm mb-4">
            Настоящая Политика конфиденциальности является неотъемлемой частью Пользовательского
            соглашения (Terms of Service) ContractGen.
          </p>
          <p className="text-gray-500 text-sm">
            ContractGen. Все права защищены. Защита Ваших персональных данных — наш приоритет.
          </p>
        </div>

      </div>
    </div>
  )
}
