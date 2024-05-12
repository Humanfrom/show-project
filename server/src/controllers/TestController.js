const Tea = require("../models/Tea");
const User = require("../models/User");
const Box = require("../models/Box");

const {validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const TeaController = require("./TeaController");
const DeliveryService = require("../services/DeliveryService");
const YandexDeliveryService = require("../services/delivery/YandexDeliveryService");

class TestController {
    constructor(){
        
    }

    getReadyTeas (){
        const arr = [
           /* {
                name: "liu_shan_gun_mei",
                title: "Лиу Шань Гунь Мэй",
                description: "Этот улун из Уишаньских гор славится своим нежным вкусом и ароматом. Вкус фруктовый, цветочный, с нотками мёда и дымка. Аромат свежий, цветочный, с нотками орхидеи. Листья чая имеют форму изогнутых бровей, что и дало ему название Лиу шань гунь мэй (Брови красавицы с горы Лиу).",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "te_guanyin_bai_cha",
                title: "Те Гуаньинь Бай Чха",
                description: "Этот белый чай из Аньси обладает сладким, нежным вкусом с нотками персика и мёда. Аромат цветочный, с нотками жасмина и орхидеи. Белые ворсинки на листьях чая придают ему неповторимый вид и аромат.",
                storage: 800,
                limit: 0,
                class: 'white',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "gaba_uluon_alishan",
                title: "Габа улун, Алишань",
                description: "Этот улун с гор Алишань на Тайване имеет сливочный, ореховый вкус с нотками мёда и шоколада. Аромат свежий, травянистый, с нотками цветов. Благодаря технологии ГАБА, этот чай обладает расслабляющим эффектом.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "gaba_uluon_gui_fei",
                title: "Габа улун Гуй Фэй",
                description: "Еще один улун из Уишаньских гор, который отличается фруктовым, цветочным вкусом с нотками мёда и дымка. Аромат свежий, цветочный, с нотками орхидеи. Этот чай также обладает расслабляющим эффектом.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "liu_pao_gui_qing_yun",
                title: "Лиу Пао Гуй Цин Юнь",
                description: "Этот постферментированный чай из Хэцзяня имеет дымный, древесный вкус с нотками сухофруктов и шоколада. Аромат дымный, пряный, с нотками камфоры. Лиу Пао Гуй Цин Юнь - это крепкий чай, который хорошо подходит для согревания в холодную погоду.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "liu_pao_bin_lan_xiang",
                title: "Лиу Пао Бин Лань Cян",
                description: "Еще один постферментированный чай из Хэцзяня, но с более сладким, мятным вкусом и нотками сухофруктов и мёда. Аромат свежий, мятный, с нотками цветов. Лиу Пао Бин Лань сян - это освежающий чай, который хорошо подходит для утоления жажды.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },*/
            {
                name: "nanjing_yu_hua",
                title: "Нанцзин Юй Хуа",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "dan_cung_huang_zhi_xiang_qing_xiang",
                title: "Дан Цхун Хуан Чжи Сян Цин Сян",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'white',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "kao_ben_shan",
                title: "Као Бен Шань",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "guntin_jin_ya",
                title: "Гунтхин Цзинь Я",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "lao_tong_zhi",
                title: "Лао Тун Чжи",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "i_vu",
                title: "И Ву",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "drevnie_sady_linchana",
                title: "Древние сады Линцхана",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "lao_sheng",
                title: "Лао Шэн",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },

            {
                name: "guntin_lincchan",
                title: "Гунтхин Линцхан",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "cyao_mu_van",
                title: "Цяо Му Ван",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'white',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "lao_shu_jin_yun",
                title: "Лао Шу Цзинь Юнь",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'white',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "li_pao_s_drakonoego_hrebta",
                title: "Лиу Пао с драконьего хребта",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "li_pao_bin_lan_syan",
                title: "Лиу Пао Бин Лань сян",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'wulong',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
            {
                name: "i_vu_zolotoy_olen_shen",
                title: "Иву золотой олень шен",
                description: "Тестовое описание ибо я уже устал генерить описания для тестовых наборов и вообще вот этим всем заполнением заниматься.",
                storage: 800,
                limit: 0,
                class: 'black',
                cost_in: 12,
                cost_sale: 0,
                package_type: 'g',
                tags: ['spring', 'fresh'],
                active: true,
                state: 'sale',
                analogs: [],
                notion_id: null,
            },
        ];

        return arr;
    }

    getReadyBoxes() {
        return [
            {
                name: 'stop_train',
                title: "Постой паровоз",
                description: "Быстрый, сочный, взрывной, с нотками угля и копчености на месте взрыва. Когда нужно успеть в уходящий вагон, самолет, или, может, вагон-самолет?  Эффект не хуже, чем от кофе, а на сердце легко. Бодрит тело и ум. И дух, кстати, тоже. Состав и вкусовая палитра пестрят самыми бодрыми представителями своих категорий – три Шу Пуэра, два Шен Пуэра, один зеленый Нанцзин Юй Хуа, один северофуцзяньский темный улун Дан Цхун и жареный темный Као Бен Шань.",
                weights: {
                    small: 300,
                    med: 560,
                    big: 720
                },
                status: "active",
                teas: [
                    {
                        name: "nanjing_yu_hua",
                    },
                    {
                        name: "dan_cung_huang_zhi_xiang_qing_xiang",
                    },
                    {
                        name: "kao_ben_shan",
                    },
                    {
                        name: "guntin_jin_ya",
                    },
                    {
                        name: "lao_tong_zhi",
                    },
                    {
                        name: "i_vu",
                    },
                    {
                        name: "drevnie_sady_linchana",
                    },
                    {
                        name: "lao_sheng",
                    },
                ],
                level: 1,
                promotion: [ "winter" ],
                achievements: [ "monster" ],
                min_grade: 0,
                costs: {
                    small: 1200,
                    med: 2400,
                    big: 3200,
                },
                image: "/boxes/stop_train.jpg",
                notion_id: null,
                active: true,
            },
            {
                name: 'sleep_set_v2',
                title: "Сонный сет v2",
                description: "Отличный сет на сон грядущий, успокаивает ум, помогает центральной нервной системе переходить в парасимпатический режим. Вкусо-ароматическая палитра варьируется от сладостных фруктовых до земляных. Данный сет так же подходит для расслабляющих практик. В составе два нестандартных белых – Лиу Шань Гунь Мэй и Те Гуань Инь Бай Чха, два Габа Улуна и два чая семейства Лиу Пао – черных чаев с «золотой плесенью». Последние содержат большое количество полезных для ЖКТ ферментов, нормализуют пищеварение, не бодрят.",
                weights: {
                    small: 300,
                    med: 560,
                    big: 720
                },
                status: "active",
                teas: [
                    {
                        name: "liu_shan_gun_mei",
                    },
                    {
                        name: "te_guanyin_bai_cha",
                    },
                    {
                        name: "gaba_uluon_alishan",
                    },
                    {
                        name: "gaba_uluon_gui_fei",
                    },
                    {
                        name: "liu_pao_gui_qing_yun",
                    },
                    {
                        name: "liu_pao_bin_lan_xiang",
                    },
                ],
                level: 1,
                promotion: [ "winter" ],
                achievements: [ "monster" ],
                min_grade: 0,
                costs: {
                    small: 1300,
                    med: 2800,
                    big: 3400,
                },
                image: "/boxes/sleep_set_v2.jpg",
                notion_id: null,
                active: true,
            },
            {
                name: 'dune_walk',
                title: "Прогулка по дюнам",
                description: "Земля, орехи, сухофрукты и прочие атрибуты бедуинов своих внутренних пустынь. Придаст сил, прояснит восприятие, насытит и увлажнит. В составе три Шен Пуэра и четыре Шу Пуэра разных мест и возрастов, а также два представителя семейства Лиу Пао – черных чаев с «золотой плесенью». Последние содержат большое количество полезных для ЖКТ ферментов, нормализуют пищеварение, не бодрят.",
                weights: {
                    small: 300,
                    med: 560,
                    big: 720
                },
                status: "active",
                teas: [
                    {
                        name: "guntin_lincchan",
                    },
                    {
                        name: "cyao_mu_van",
                    },
                    {
                        name: "lao_shu_jin_yun",
                    },
                    {
                        name: "i_vu",
                    },
                    {
                        name: "li_pao_s_drakonoego_hrebta",
                    },
                    {
                        name: "li_pao_bin_lan_syan",
                    },
                    {
                        name: "i_vu_zolotoy_olen_shen",
                    },
                    {
                        name: "drevnie_sady_linchana",
                    },
                    {
                        name: "lao_sheng",
                    },
                ],
                level: 2,
                promotion: [ "winter" ],
                achievements: [ "monster" ],
                min_grade: 1,
                costs: {
                    small: 1400,
                    med: 2500,
                },
                image: "/boxes/dune_walk.jpg",
                notion_id: null,
                active: true,
            },
        ];
    }

    
    async test(req, res) {
        console.log(this);
        const dto = {
            "title": "Яндекс - до двери",
            "type": "courier",
            "service": "yandex",
            "params": {
                "address": {
                    "value": "г Москва, ул Шаболовка, д 20, кв 2",
                    "unrestricted_value": "119049, г Москва, р-н Якиманка, ул Шаболовка, д 20, кв 2",
                    "data": {
                        "postal_code": "119049",
                        "country": "Россия",
                        "country_iso_code": "RU",
                        "federal_district": "Центральный",
                        "region_fias_id": "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
                        "region_kladr_id": "7700000000000",
                        "region_iso_code": "RU-MOW",
                        "region_with_type": "г Москва",
                        "region_type": "г",
                        "region_type_full": "город",
                        "region": "Москва",
                        "area_fias_id": null,
                        "area_kladr_id": null,
                        "area_with_type": null,
                        "area_type": null,
                        "area_type_full": null,
                        "area": null,
                        "city_fias_id": "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
                        "city_kladr_id": "7700000000000",
                        "city_with_type": "г Москва",
                        "city_type": "г",
                        "city_type_full": "город",
                        "city": "Москва",
                        "city_area": "Центральный",
                        "city_district_fias_id": null,
                        "city_district_kladr_id": null,
                        "city_district_with_type": null,
                        "city_district_type": null,
                        "city_district_type_full": null,
                        "city_district": null,
                        "settlement_fias_id": null,
                        "settlement_kladr_id": null,
                        "settlement_with_type": null,
                        "settlement_type": null,
                        "settlement_type_full": null,
                        "settlement": null,
                        "street_fias_id": "d1febe9c-11b9-46db-891e-30f3083d5611",
                        "street_kladr_id": "77000000000313300",
                        "street_with_type": "ул Шаболовка",
                        "street_type": "ул",
                        "street_type_full": "улица",
                        "street": "Шаболовка",
                        "stead_fias_id": null,
                        "stead_cadnum": null,
                        "stead_type": null,
                        "stead_type_full": null,
                        "stead": null,
                        "house_fias_id": "3c6d319d-dc38-4a5e-858c-151833bc618b",
                        "house_kladr_id": "7700000000031330162",
                        "house_cadnum": null,
                        "house_type": "д",
                        "house_type_full": "дом",
                        "house": "20",
                        "block_type": null,
                        "block_type_full": null,
                        "block": null,
                        "entrance": null,
                        "floor": null,
                        "flat_fias_id": "e4da5460-b937-4b0e-853c-ba3be56ba541",
                        "flat_cadnum": null,
                        "flat_type": "кв",
                        "flat_type_full": "квартира",
                        "flat": "2",
                        "flat_area": null,
                        "square_meter_price": null,
                        "flat_price": null,
                        "room_fias_id": null,
                        "room_cadnum": null,
                        "room_type": null,
                        "room_type_full": null,
                        "room": null,
                        "postal_box": null,
                        "fias_id": "e4da5460-b937-4b0e-853c-ba3be56ba541",
                        "fias_code": null,
                        "fias_level": "9",
                        "fias_actuality_state": "0",
                        "kladr_id": "7700000000031330162",
                        "geoname_id": "524901",
                        "capital_marker": "0",
                        "okato": "45286596000",
                        "oktmo": "45384000",
                        "tax_office": "7706",
                        "tax_office_legal": "7706",
                        "timezone": null,
                        "geo_lat": "55.721542",
                        "geo_lon": "37.60957",
                        "beltway_hit": null,
                        "beltway_distance": null,
                        "metro": null,
                        "divisions": null,
                        "qc_geo": "0",
                        "qc_complete": null,
                        "qc_house": null,
                        "history_values": null,
                        "unparsed_parts": null,
                        "source": null,
                        "qc": null
                    }
                },
                "boxes": [
                    {
                        "name": "sleep_set_v2",
                        "cost": 1300,
                        "weight": 320
                    },
                    {
                        "name": "sleep_set_v2",
                        "cost": 1300,
                        "weight": 320
                    },
                    {
                        "name": "sleep_set_v2",
                        "cost": 1300,
                        "weight": 320
                    }
                ]
            }
        };
        const delivery = new DeliveryService();
        const yd = new YandexDeliveryService();
        //const result = await delivery.checkDelivery(dto);
        const {address} = dto.params;
        //const result = await yd.getInterval(address);
        const result = await yd.getPVZList(address);


        
        return res.json(result);

        /*const testController = new TestController();

        const boxes = await TeaController.updateTeasInBoxes();
        console.log(boxes);
        return res.json(boxes);*/
        
        /*const boxes = testController.getReadyBoxes();
        const addBox = await boxes.map(async (box) => { 
            const newBox = new Box({...box});
            await newBox.save();
            return newBox;
        });
        return res.json(addBox);*/

        
        /*const teas = testController.getReadyTeas();
        const addTeas = teas.map((tea) => TeaController.add(tea));
        return res.json(addTeas);*/

        //const user = await User.findOne({chat_id: 828192790});

        /*User.find({ chat_id: { $ne: null }} , { chat_id: 1, chat_key: 1 }).then(
            (docs) => {
                return res.json(docs);
            }
        );*/
        
    }
};

module.exports = new TestController()