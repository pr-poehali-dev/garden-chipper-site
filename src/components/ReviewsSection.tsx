import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  REVIEWS,
  WARRANTY_ITEMS,
  NAV_ITEMS,
  StarRating,
  SectionLabel,
  SectionTitle,
  ContactForm,
  LOGO_URL,
  LOGO_FILTER,
} from "@/components/shared";

interface ReviewsSectionProps {
  scrollTo: (id: string) => void;
}

function ReviewCard({ r }: { r: typeof REVIEWS[0] }) {
  const images = r.images || [];
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <div className="bg-coal border border-border hover:border-warning/30 transition-colors flex flex-col">
      {images.length > 0 && (
        <div className="relative h-44 overflow-hidden bg-steel/10">
          <img src={images[imgIdx]} alt="фото отзыва" className="absolute inset-0 w-full h-full object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-6 h-6 flex items-center justify-center">
                <Icon name="ChevronLeft" size={14} />
              </button>
              <button onClick={() => setImgIdx((imgIdx + 1) % images.length)} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-6 h-6 flex items-center justify-center">
                <Icon name="ChevronRight" size={14} />
              </button>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? "bg-warning" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-steel flex items-center justify-center font-oswald font-bold text-warning text-lg">
              {r.author[0]}
            </div>
            <div>
              <div className="font-oswald font-bold text-sm text-foreground">{r.author}</div>
              <div className="text-xs text-muted-foreground font-mono">{r.company}</div>
            </div>
          </div>
          <StarRating rating={r.rating} />
        </div>
        <p className="text-muted-foreground text-sm font-plex leading-relaxed mb-4 flex-1">"{r.text}"</p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground/60">{r.date}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="ThumbsUp" size={11} />
            Полезно
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ scrollTo }: ReviewsSectionProps) {
  const [activeReviewFilter, setActiveReviewFilter] = useState(0);

  return (
    <>
      {/* REVIEWS */}
      <section className="py-24 bg-iron steel-texture">
        <div className="max-w-7xl mx-auto px-4">
          <SectionLabel>Реальные покупатели</SectionLabel>
          <SectionTitle>Отзывы<br />и рейтинг</SectionTitle>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 bg-coal border border-border p-6">
            <div className="text-center px-6">
              <div className="font-oswald text-7xl font-bold text-warning leading-none">4.9</div>
              <StarRating rating={5} />
              <div className="text-xs text-muted-foreground font-mono mt-2 tracking-wider">из 5.0</div>
            </div>
            <div className="w-px h-16 bg-border hidden md:block" />
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const counts = [142, 18, 4, 1, 0];
                const total = counts.reduce((a, b) => a + b, 0);
                const count = counts[5 - star];
                return (
                  <div key={star} className="flex items-center gap-3 mb-1.5">
                    <span className="text-warning text-xs w-3">{star}★</span>
                    <div className="flex-1 h-1.5 bg-steel/50">
                      <div className="h-full bg-warning transition-all duration-500" style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground w-6">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-center px-4">
              <div className="font-oswald text-3xl font-bold text-foreground">165</div>
              <div className="text-xs text-muted-foreground font-mono mt-1 tracking-wider">ОТЗЫВОВ</div>
              <button className="mt-4 bg-warning text-black px-4 py-2 text-xs font-oswald font-bold tracking-wider uppercase hover:bg-amber-400 transition-colors">
                Оставить отзыв
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {["Все", "5 звёзд", "4 звезды", "Видео-отзывы"].map((f, i) => (
              <button
                key={f}
                onClick={() => setActiveReviewFilter(i)}
                className={`px-4 py-2 text-xs font-oswald font-bold tracking-wider uppercase transition-colors ${
                  activeReviewFilter === i ? "bg-warning text-black" : "border border-border text-muted-foreground hover:border-warning/40 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.author} r={r} />
            ))}
          </div>
        </div>
      </section>

      {/* WARRANTY */}
      <section id="warranty" className="py-24 bg-coal">
        <div className="max-w-7xl mx-auto px-4">
          <SectionLabel>Надёжность</SectionLabel>
          <SectionTitle>Гарантия<br />и сервис</SectionTitle>
          <div className="grid md:grid-cols-4 gap-5 mb-12">
            {WARRANTY_ITEMS.map((w) => (
              <div key={w.label} className="bg-iron border border-border p-6 text-center group hover:border-warning/40 transition-colors">
                <div className="w-12 h-12 border border-warning/30 flex items-center justify-center mx-auto mb-4 group-hover:border-warning transition-colors">
                  <Icon name={w.icon} size={22} className="text-warning" fallback="Shield" />
                </div>
                <div className="font-oswald text-4xl font-bold text-warning mb-2">{w.period}</div>
                <div className="text-xs text-muted-foreground font-plex leading-tight">{w.label}</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-iron border border-border p-8">
              <h3 className="font-oswald text-xl font-bold text-foreground uppercase tracking-wide mb-5">Условия гарантии</h3>
              <ul className="space-y-3">
                {[
                  "Бесплатная замена дефектных узлов в течение гарантийного срока",
                  "Выезд сервисного инженера в течение 48 часов",
                  "Гарантия сохраняется при использовании оригинальных расходников",
                  "Восстановление работоспособности в срок до 5 рабочих дней",
                  "Подменный фонд ключевых агрегатов для срочных случаев",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground font-plex">
                    <Icon name="CheckCircle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-iron border border-border p-8">
              <h3 className="font-oswald text-xl font-bold text-foreground uppercase tracking-wide mb-5">Сервисная сеть</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { city: "Москва", type: "Сервисный центр" },
                  { city: "СПб", type: "Партнёрский СЦ" },
                  { city: "Екатеринбург", type: "Сервисный центр" },
                  { city: "Новосибирск", type: "Выездной сервис" },
                  { city: "Краснодар", type: "Партнёрский СЦ" },
                  { city: "Казань", type: "Выездной сервис" },
                ].map((c) => (
                  <div key={c.city} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-warning flex-shrink-0" />
                    <div>
                      <div className="font-oswald text-sm font-bold text-foreground">{c.city}</div>
                      <div className="text-xs text-muted-foreground font-mono">{c.type}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollTo("contacts")} className="w-full border border-warning/40 text-warning py-3 font-oswald font-bold tracking-wider uppercase text-sm hover:bg-warning/10 transition-colors">
                Вызвать сервисного инженера
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-iron steel-texture">
        <div className="max-w-7xl mx-auto px-4">
          <SectionLabel>Связь</SectionLabel>
          <SectionTitle>Контакты</SectionTitle>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              {[
                { icon: "Phone", label: "Телефон отдела продаж", val: "+7 (912) 333-32-25", sub: "Бесплатно по России, Пн–Пт 8–18" },
                { icon: "Mail", label: "Email", val: "vyatkalux@yandex.ru", sub: "Ответ в течение 2 часов" },
                { icon: "MapPin", label: "Офис и производство", val: "г. Киров (обл), п. Торфяной, ул. Транспортная, 13б", sub: "Заезд по предварительной договорённости", link: "https://yandex.ru/maps/?text=Киров+область+п.+Торфяной+ул.+Транспортная+13б" },
                { icon: "MessageCircle", label: "WhatsApp / Telegram", val: "+7 (912) 333-32-25", sub: "Быстрые ответы в мессенджерах" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-warning/30 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} size={16} className="text-warning" fallback="Phone" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono tracking-wider mb-1">{c.label}</div>
                    {'link' in c && c.link ? (
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="font-oswald font-bold text-lg text-foreground hover:text-warning transition-colors underline-offset-2 hover:underline">
                        {c.val}
                      </a>
                    ) : (
                      <div className="font-oswald font-bold text-lg text-foreground">{c.val}</div>
                    )}
                    <div className="text-xs text-muted-foreground font-plex mt-0.5">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="py-24 bg-coal">
        <div className="max-w-7xl mx-auto px-4">
          <SectionLabel>Полезные материалы</SectionLabel>
          <SectionTitle>Статьи</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "BookOpen", title: "Как выбрать измельчитель веток", desc: "Разбираемся, на что обратить внимание при выборе садового измельчителя: мощность, диаметр веток, тип ножей и производительность." },
              { icon: "Wrench", title: "Обслуживание и уход за измельчителем", desc: "Простые правила ухода, которые продлят срок службы оборудования и сохранят его в идеальном состоянии на долгие годы." },
              { icon: "Leaf", title: "Применение щепы в саду и огороде", desc: "Щепа после измельчения — ценный материал для мульчирования, компоста и украшения участка. Узнайте, как её использовать." },
            ].map((article) => (
              <div key={article.title} className="bg-iron border border-border hover:border-warning/40 transition-all p-6 flex flex-col gap-4">
                <div className="w-10 h-10 border border-warning/30 flex items-center justify-center">
                  <Icon name={article.icon} size={18} className="text-warning" fallback="BookOpen" />
                </div>
                <h3 className="font-oswald text-lg font-bold text-foreground uppercase tracking-wide leading-tight">{article.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-plex flex-1">{article.desc}</p>
                <div className="text-xs text-warning/60 font-mono tracking-wider uppercase">Скоро →</div>
              </div>
            ))}
          </div>
          <div className="mt-12 border border-border border-dashed p-8 text-center">
            <Icon name="PenLine" size={32} className="text-muted-foreground/40 mx-auto mb-3" />
            <div className="font-oswald text-lg text-muted-foreground uppercase tracking-wider mb-1">Раздел в разработке</div>
            <p className="text-sm text-muted-foreground/60 font-plex">Здесь появятся полезные статьи, инструкции и советы по работе с оборудованием.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-coal border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Rubitel" className="w-8 h-8 object-contain" style={{ filter: LOGO_FILTER }} />
              <div>
                <div className="font-oswald text-base font-bold text-foreground tracking-wider">RUBITEL</div>
                <div className="text-[10px] text-muted-foreground font-mono tracking-[0.2em]">INDUSTRIAL EQUIPMENT</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-xs text-muted-foreground hover:text-warning font-oswald tracking-wider uppercase transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://rutube.ru/channel/27535132/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-warning font-oswald tracking-wider uppercase transition-colors"
              >
                <Icon name="Play" size={12} />
                Rutube
              </a>
              <a
                href="https://youtube.com/@vyatkalux"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-warning font-oswald tracking-wider uppercase transition-colors"
              >
                <Icon name="Youtube" size={12} />
                YouTube
              </a>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground/60 font-mono">© 2009–2026 RUBITEL. Все права защищены.</div>
            <div className="flex gap-6 text-xs text-muted-foreground/60 font-mono">
              <span className="cursor-pointer hover:text-warning transition-colors">Политика конфиденциальности</span>
              <span className="cursor-pointer hover:text-warning transition-colors">Оферта</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}