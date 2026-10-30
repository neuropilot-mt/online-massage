<?php

namespace Database\Seeders;

use App\Enums\LeadStatus;
use App\Enums\Role;
use App\Models\Banner;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\FaqItem;
use App\Models\IssuedCertificate;
use App\Models\Lead;
use App\Models\LessonProgress;
use App\Models\Program;
use App\Models\ScheduleEvent;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->create([
            'name' => 'Анна Соколова',
            'email' => 'admin@soma.academy',
            'phone' => '+375 (29) 111-11-11',
            'password' => Hash::make('password'),
            'role' => Role::Admin,
        ]);

        $teacher = User::query()->create([
            'name' => 'Дмитрий Волков',
            'email' => 'teacher@soma.academy',
            'phone' => '+375 (29) 222-22-22',
            'password' => Hash::make('password'),
            'role' => Role::Teacher,
        ]);

        User::query()->create([
            'name' => 'Елена Кравченко',
            'email' => 'moderator@soma.academy',
            'phone' => '+375 (29) 333-33-33',
            'password' => Hash::make('password'),
            'role' => Role::Moderator,
        ]);

        $student = User::query()->create([
            'name' => 'Мария Иванова',
            'email' => 'student@soma.academy',
            'phone' => '+375 (29) 444-44-44',
            'password' => Hash::make('password'),
            'role' => Role::Student,
        ]);

        SiteSetting::query()->create([
            'id' => 'default',
            'phone' => '+375 (29) 000-00-00',
            'email' => 'hello@soma.academy',
            'address' => 'Минск, ул. Немига, 5',
            'telegram' => 'https://t.me/soma_academy',
            'instagram' => 'https://instagram.com/soma.academy',
            'hero_title' => 'Профессия массажиста — онлайн и на практике',
            'hero_subtitle' => 'Академия SOMA: современные курсы массажа с кабинетом ученика, прогрессом и живыми группами в Минске.',
            'about' => "Академия массажа SOMA — это онлайн-школа и очная практика в одном месте.\n\nМы собрали программы так, чтобы новичок мог освоить профессию с нуля, а практикующий специалист — быстро добавить новую технику в прайс. Теория доступна в кабинете 24/7: тексты, схемы и видео. Отработка — в мини-группах по расписанию.\n\nПреподаватели с клиническим и SPA-опытом. После курса вы получаете доступ к материалам и поддержку куратора.",
        ]);

        $program = Program::query()->create([
            'title' => 'Массажист с нуля',
            'slug' => 'massagist-from-scratch',
            'description' => 'Полный путь в профессию: классический массаж, моделирование тела и этика работы с клиентом.',
            'cover_url' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80',
            'published' => true,
            'sort_order' => 1,
        ]);

        $classic = Course::query()->create([
            'program_id' => $program->id,
            'title' => 'Классический массаж тела',
            'slug' => 'classic-body-massage',
            'excerpt' => 'Базовый курс для старта в профессии: анатомия, приёмы, полный комплекс на спину и конечности.',
            'description' => "Курс для тех, кто хочет работать руками уверенно — в кабинете, SPA или на выезде.\n\nВы разберёте показания и противопоказания, выстроите гигиену кабинета и освоите последовательность классического сеанса. Онлайн-модули можно проходить в своём темпе. Очная группа — чтобы поставить руки и получить обратную связь преподавателя.",
            'cover_url' => 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80',
            'price' => 890,
            'duration_hours' => 72,
            'format' => 'Онлайн + практика в Минске',
            'level' => 'С нуля',
            'published' => true,
            'featured' => true,
            'sort_order' => 1,
        ]);

        $anticell = Course::query()->create([
            'program_id' => $program->id,
            'title' => 'Антицеллюлитный массаж и моделирование',
            'slug' => 'anticellulite-modeling',
            'excerpt' => 'Работа с тканями, лимфодренаж и протоколы для бедер, живота и рук.',
            'description' => 'Практический курс повышения квалификации. Разбираем работу с отёком, фиброзом и тонусом тканей. Подходит косметологам, массажистам и фитнес-специалистам.',
            'cover_url' => 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80',
            'price' => 640,
            'duration_hours' => 36,
            'format' => 'Онлайн + 4 очных занятия',
            'level' => 'Повышение квалификации',
            'published' => true,
            'featured' => true,
            'sort_order' => 2,
        ]);

        $kids = Course::query()->create([
            'title' => 'Детский массаж',
            'slug' => 'pediatric-massage',
            'excerpt' => 'Безопасные техники для младенцев и дошкольников: нормы, возрастные особенности, работа с родителями.',
            'description' => 'Курс учит бережному массажу детей: как читать сигналы ребёнка, какие приёмы уместны в каждом возрасте и как выстраивать сеанс вместе с родителем.',
            'cover_url' => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80',
            'price' => 720,
            'duration_hours' => 48,
            'format' => 'Онлайн + практика',
            'level' => 'С нуля / медработникам',
            'published' => true,
            'featured' => false,
            'sort_order' => 3,
        ]);

        $this->seedClassicCourse($classic);
        $this->seedShortCourse($anticell, 'Моделирование');
        $this->seedShortCourse($kids, 'Детский массаж');

        Enrollment::query()->create([
            'user_id' => $student->id,
            'course_id' => $classic->id,
            'granted_by' => $admin->id,
        ]);

        $firstLesson = $classic->modules()->first()->lessons()->first();
        LessonProgress::query()->create([
            'user_id' => $student->id,
            'lesson_id' => $firstLesson->id,
            'completed_at' => now()->subDay(),
        ]);

        Banner::query()->create([
            'title' => 'Старт группы 23 сентября',
            'subtitle' => 'Классический массаж: осталось 4 места в мини-группе.',
            'badge' => 'Набор открыт',
            'image_url' => 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1600&q=80',
            'cta_label' => 'Записаться',
            'cta_href' => '/courses/classic-body-massage',
            'active' => true,
            'sort_order' => 1,
        ]);

        Banner::query()->create([
            'title' => '−20% на второй курс',
            'subtitle' => 'Если уже учитесь в SOMA — моделирование тела со скидкой до 13 октября.',
            'badge' => 'Акция',
            'image_url' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
            'cta_label' => 'Смотреть курс',
            'cta_href' => '/courses/anticellulite-modeling',
            'active' => true,
            'sort_order' => 2,
        ]);

        ScheduleEvent::query()->create([
            'title' => 'Классический массаж · дневная группа',
            'course_id' => $classic->id,
            'city' => 'Минск',
            'starts_at' => now()->addDays(13)->setTime(10, 0),
            'hours' => 72,
            'spots' => 4,
            'published' => true,
        ]);

        ScheduleEvent::query()->create([
            'title' => 'Детский массаж · вечерняя группа',
            'course_id' => $kids->id,
            'city' => 'Минск',
            'starts_at' => now()->addDays(26)->setTime(18, 30),
            'hours' => 48,
            'spots' => 6,
            'published' => true,
        ]);

        ScheduleEvent::query()->create([
            'title' => 'Моделирование тела · интенсивы выходного дня',
            'course_id' => $anticell->id,
            'city' => 'Минск',
            'starts_at' => now()->addDays(20)->setTime(11, 0),
            'hours' => 36,
            'spots' => 5,
            'published' => true,
        ]);

        foreach ([
            ['Марина К.', 'Выпускница, 2025', 'После курса сразу взяла первых клиентов. Онлайн-уроки можно пересматривать, а на практике преподаватель ставит руку, а не читает лекцию.'],
            ['Олег С.', 'Массажист SPA', 'Брал моделирование как повышение. Протоколы рабочие, без воды. Кабинет удобный — смотрю модули между сменами.'],
            ['Ирина П.', 'Медсестра', 'Долго боялась уходить в массаж. Здесь спокойно объясняют анатомию и не давят. Заявку обработали в тот же день.'],
        ] as $i => [$name, $role, $text]) {
            Testimonial::query()->create([
                'name' => $name,
                'role' => $role,
                'text' => $text,
                'published' => true,
                'sort_order' => $i + 1,
            ]);
        }

        foreach ([
            ['Как попасть на курс?', 'Оставляете заявку на сайте. Администратор связывается, подбирает формат и после оплаты преподаватель открывает доступ в кабинет к нужному курсу.'],
            ['Можно учиться полностью онлайн?', 'Теорию и видео — да. Для постановки рук рекомендуем очные занятия по расписанию. В MVP запись на группу идёт через заявку, без онлайн-кассы.'],
            ['Кому доступен кабинет ученика?', 'Только тем, кому выдали доступ к конкретному курсу. Чужие программы в кабинете не видны.'],
            ['Как оплатить обучение?', 'Пока принимаем оплату через менеджера (ЕРИП / перевод). Онлайн-оплата появится в следующей версии.'],
            ['Какой документ выдаёте?', 'После обучения выдаём сертификат академии. По программам профессиональной подготовки — свидетельство государственного образца. Документ появляется в кабинете, когда преподаватель его оформит.'],
        ] as $i => [$q, $a]) {
            FaqItem::query()->create([
                'question' => $q,
                'answer' => $a,
                'published' => true,
                'sort_order' => $i + 1,
            ]);
        }

        Lead::query()->create([
            'name' => 'Катя Новикова',
            'phone' => '+375291234567',
            'email' => 'katya@example.com',
            'course_id' => $classic->id,
            'message' => 'Хочу с нуля, можно в вечернюю группу.',
            'status' => LeadStatus::New,
        ]);

        Lead::query()->create([
            'name' => 'Павел Руденко',
            'phone' => '+375447776655',
            'course_id' => $anticell->id,
            'message' => 'Уже работаю массажистом, интересует скидка на второй курс.',
            'status' => LeadStatus::Contacted,
        ]);

        $stateCert = Certificate::query()->create([
            'title' => 'Свидетельство государственного образца',
            'subtitle' => 'По программам профессиональной подготовки и переподготовки',
            'description' => 'Официальный документ установленного образца. Подтверждает квалификацию и принимается работодателями и учебными центрами.',
            'image_url' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
            'is_state_sample' => true,
            'published' => true,
            'sort_order' => 1,
        ]);

        Certificate::query()->create([
            'title' => 'Сертификат академии SOMA',
            'subtitle' => 'По коротким курсам и повышению квалификации',
            'description' => 'Внутренний сертификат школы: программа, часы и ФИО выпускника. Удобно прикрепить к портфолио и вакансии.',
            'image_url' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
            'is_state_sample' => false,
            'published' => true,
            'sort_order' => 2,
        ]);

        IssuedCertificate::query()->create([
            'certificate_id' => $stateCert->id,
            'user_id' => $student->id,
            'course_id' => $classic->id,
            'number' => 'SOMA-2026-014',
            'issued_on' => now()->subDays(12)->toDateString(),
        ]);
    }

    private function seedClassicCourse(Course $course): void
    {
        $modules = [
            [
                'title' => 'Введение в профессию',
                'description' => 'Роль массажиста, этика, гигиена кабинета.',
                'lessons' => [
                    [
                        'title' => 'Кто такой массажист сегодня',
                        'duration_min' => 12,
                        'video_url' => 'https://www.youtube.com/watch?v=8jPQjjsBbIc',
                        'content' => "Массаж — это не «просто размять спину». Это работа с тканями, нервной системой и доверием человека.\n\nНа уроке: чем отличается оздоровительный массаж от лечебного, какие запросы приходят чаще всего и как говорить с клиентом о границах.\n\nДомашнее задание: опишите свой идеальный первый сеанс в 5 пунктах.",
                    ],
                    [
                        'title' => 'Кабинет, гигиена, масла',
                        'duration_min' => 15,
                        'image_url' => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80',
                        'content' => "Рабочее место должно быть тихим, тёплым и предсказуемым. Клиент расслабляется, когда видит порядок.\n\nЧек-лист: стол, простыни, масло/крем, антисептик, смена белья, проветривание.\n\nНе используйте эфирные масла без спроса — это частая причина аллергии и претензий.",
                    ],
                ],
            ],
            [
                'title' => 'Анатомия для рук',
                'description' => 'Ориентиры, мышцы спины и противопоказания.',
                'lessons' => [
                    [
                        'title' => 'Ориентиры тела',
                        'duration_min' => 18,
                        'video_url' => 'https://www.youtube.com/watch?v=iGsi_xQdY7I',
                        'content' => "Перед тем как ставить приём, нужно «видеть» под кожей: остистые отростки, лопатку, гребень подвздошной кости, крестец.\n\nМы не учим вас наизусть весь атлас — только то, без чего опасно работать.",
                    ],
                    [
                        'title' => 'Противопоказания',
                        'duration_min' => 14,
                        'content' => "Абсолютные: лихорадка, острые инфекции, тромбоз, онкология без допуска врача, свежие травмы кожи.\n\nОтносительные: беременность, гипертония, варикоз — работаем по протоколу и не обещаем чудес.\n\nПравило школы: сомневаетесь — не массируете и направляете к врачу.",
                    ],
                ],
            ],
            [
                'title' => 'Базовые приёмы',
                'description' => 'Поглаживание, растирание, разминание, вибрация.',
                'lessons' => [
                    [
                        'title' => 'Четыре приёма классики',
                        'duration_min' => 22,
                        'video_url' => 'https://www.youtube.com/watch?v=YQK-GaCjV7A',
                        'image_url' => 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=80',
                        'content' => "1. Поглаживание — вход в контакт и лимфоток.\n2. Растирание — разогрев фасций.\n3. Разминание — работа с мышцей.\n4. Вибрация и поколачивание — тонус, завершение.\n\nСмотрите видео, затем повторите на валике или подушке: ритм важнее силы.",
                    ],
                    [
                        'title' => 'Положение рук и спина специалиста',
                        'duration_min' => 10,
                        'content' => "Если болит поясница у вас — техника неверная. Вес тела идёт от ног, стол на правильной высоте, запястье не ломается.\n\nЭто урок, который экономит карьеру.",
                    ],
                ],
            ],
            [
                'title' => 'Комплекс на спину',
                'description' => 'Полный сеанс 40–50 минут.',
                'lessons' => [
                    [
                        'title' => 'Протокол сеанса на спину',
                        'duration_min' => 28,
                        'video_url' => 'https://www.youtube.com/watch?v=8pDqJ0p3fQ4',
                        'content' => "Последовательность: контакт → поверхностные слои → паравертебральные мышцы → широчайшая → поясница → выход.\n\nНе прыгайте с зоны на зону. Клиент должен чувствовать историю, а не набор трюков.",
                    ],
                ],
            ],
        ];

        $this->createModules($course, $modules);
    }

    private function seedShortCourse(Course $course, string $prefix): void
    {
        $this->createModules($course, [
            [
                'title' => $prefix.': старт',
                'description' => 'Цели курса и безопасность.',
                'lessons' => [
                    [
                        'title' => 'Цели и ограничения метода',
                        'duration_min' => 16,
                        'video_url' => 'https://www.youtube.com/watch?v=8jPQjjsBbIc',
                        'content' => "Короткий модуль, чтобы вы сразу поняли, кому метод подходит, а кому — нет.\n\nДальше в кабинете появятся протоколы и разборы ошибок. Сейчас важно запомнить: сила не заменяет точность.",
                    ],
                    [
                        'title' => 'Базовый протокол',
                        'duration_min' => 20,
                        'image_url' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=80',
                        'content' => "Разберите протокол по минутам. На очном занятии вы повторите его на модели под присмотром преподавателя.",
                    ],
                ],
            ],
            [
                'title' => $prefix.': практика',
                'description' => 'Разбор зон и домашние задания.',
                'lessons' => [
                    [
                        'title' => 'Работа по зонам',
                        'duration_min' => 18,
                        'content' => "Каждая зона — свой вектор и своя интенсивность. Не копируйте «салонный» жёсткий стиль без диагностики тканей.",
                    ],
                ],
            ],
        ]);
    }

    private function createModules(Course $course, array $modules): void
    {
        foreach ($modules as $i => $moduleData) {
            $module = $course->modules()->create([
                'title' => $moduleData['title'],
                'description' => $moduleData['description'],
                'sort_order' => $i + 1,
            ]);

            foreach ($moduleData['lessons'] as $j => $lesson) {
                $module->lessons()->create([
                    ...$lesson,
                    'sort_order' => $j + 1,
                ]);
            }
        }
    }
}
