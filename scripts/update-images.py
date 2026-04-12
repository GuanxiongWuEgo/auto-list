#!/usr/bin/env python3
"""Update cover_image_url for all brands and add missing models."""
import json
import os

SEED_DIR = os.path.join(os.path.dirname(__file__), "seed-data")

# === FERRARI IMAGE URLS ===
ferrari_images = {
    "ferrari-f40-1987": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Ferrari_F40.JPG",
    "ferrari-f40-lm-1989": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Goodwood2007-025_Ferrari_F40_LM_%281995%29.jpg",
    "ferrari-f40-competizione-1989": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Ferrari_F40_Competizione_Automobiles_museum_torino.JPG",
    "ferrari-f50-1995": "https://upload.wikimedia.org/wikipedia/commons/4/47/Ferrari_F50.jpg",
    "ferrari-f50-gt-1996": None,  # extremely rare, no good Wikimedia image
    "ferrari-enzo-2002": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Ferrari_Enzo_Ferrari.JPG",
    "ferrari-fxx-2005": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Ferrari_FXX.JPG",
    "ferrari-laferrari-2013": "https://upload.wikimedia.org/wikipedia/commons/a/a5/2015_Ferrari_LaFerrari.jpg",
    "ferrari-laferrari-aperta-2016": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Ferrari_LaFerrari_Aperta.jpg",
    "ferrari-fxx-k-2014": "https://upload.wikimedia.org/wikipedia/commons/4/47/2015_Ferrari_FXX-K_RED.jpg",
    "ferrari-sf90-stradale-2019": "https://upload.wikimedia.org/wikipedia/commons/a/a0/2019_Ferrari_SF90_Stradale.jpg",
    "ferrari-sf90-spider-2020": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Ferrari_SF90_Spider_%2852576066276%29.jpg",
    "ferrari-sf90-xx-stradale-2023": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Ferrari_SF90_Stradale_%282023%29_%2852864606180%29.jpg",
    # New models
    "ferrari-288-gto-1984": "https://upload.wikimedia.org/wikipedia/commons/8/81/Ferrari_288_GTO_%281%29.JPG",
    "ferrari-daytona-sp3-2022": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ferrari_Daytona_SP3_%2852576084316%29.jpg",
}

# === LAMBORGHINI IMAGE URLS ===
lamborghini_images = {
    "lamborghini-countach-lp400-1974": "https://upload.wikimedia.org/wikipedia/commons/a/a7/1974_Lamborghini_Countach_LP400.jpg",
    "lamborghini-countach-lp500s-1982": "https://upload.wikimedia.org/wikipedia/commons/3/39/Lamborghini_Countach_LP500S_1982.jpg",
    "lamborghini-countach-25th-anniversary-1988": "https://upload.wikimedia.org/wikipedia/commons/7/74/Lamborghini_Countach_25th_Anniversary_%2813943504119%29.jpg",
    "lamborghini-diablo-1990": "https://upload.wikimedia.org/wikipedia/commons/5/55/Lamborghini_Diablo_%2816099506577%29.jpg",
    "lamborghini-diablo-vt-1993": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Lamborghini_Diablo_VT_6.0_-_Flickr_-_Alexandre_Pr%C3%A9vot_%281%29.jpg",
    "lamborghini-diablo-sv-1995": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Lamborghini_Diablo_SV_%2816070399418%29.jpg",
    "lamborghini-diablo-gtr-1999": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Lamborghini_Diablo_GTR_%2841948685282%29.jpg",
    "lamborghini-murcielago-2001": "https://upload.wikimedia.org/wikipedia/commons/2/22/Lamborghini_Murci%C3%A9lago.jpg",
    "lamborghini-murcielago-lp640-2006": "https://upload.wikimedia.org/wikipedia/commons/9/91/Lamborghini_Murcielago_LP640.jpg",
    "lamborghini-murcielago-lp670-4-sv-2009": "https://upload.wikimedia.org/wikipedia/commons/9/94/2010_Lamborghini_Murcielago_LP670-4_SuperVeloce_%2810195146956%29.jpg",
    "lamborghini-aventador-lp700-4-2011": "https://upload.wikimedia.org/wikipedia/commons/3/37/Lamborghini_Aventador_LP_700-4.jpg",
    "lamborghini-aventador-sv-2015": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Lamborghini_Aventador_LP750-4_Superveloce_%2820698865898%29.jpg",
    "lamborghini-aventador-svj-2018": "https://upload.wikimedia.org/wikipedia/commons/4/4e/2019_Lamborghini_Aventador_SVJ.jpg",
    "lamborghini-aventador-ultimae-2021": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Lamborghini_Aventador_LP_780-4_Ultimae_%2852575853641%29.jpg",
    "lamborghini-huracan-lp610-4-2014": "https://upload.wikimedia.org/wikipedia/commons/e/e5/2014_Lamborghini_Hurac%C3%A1n_LP_610-4_%28US%29_front.jpg",
    "lamborghini-huracan-performante-2017": "https://upload.wikimedia.org/wikipedia/commons/c/ce/2017_Lamborghini_Huracan_Performante.jpg",
    "lamborghini-huracan-sto-2020": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lamborghini_Hurac%C3%A1n_STO_%2852575853281%29.jpg",
    "lamborghini-huracan-tecnica-2022": "https://upload.wikimedia.org/wikipedia/commons/7/77/Lamborghini_Hurac%C3%A1n_Tecnica_%2852576128303%29.jpg",
    # New models
    "lamborghini-miura-p400-1966": "https://upload.wikimedia.org/wikipedia/commons/4/4f/1967_Lamborghini_Miura_P400_%2830668030784%29.jpg",
    "lamborghini-miura-sv-1971": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Lamborghini_Miura_SVJ_Spider_%2815416163572%29.jpg",
    "lamborghini-veneno-2013": "https://upload.wikimedia.org/wikipedia/commons/4/40/Geneva_MotorShow_2013_-_Lamborghini_Veneno.jpg",
    "lamborghini-centenario-2016": "https://upload.wikimedia.org/wikipedia/commons/9/94/Lamborghini_Centenario_LP_770-4_%2832275477474%29.jpg",
    "lamborghini-sian-fkp37-2019": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lamborghini_Si%C3%A1n_FKP_37_%2849088225788%29.jpg",
    "lamborghini-revuelto-2023": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Lamborghini_Revuelto_%2852864516330%29.jpg",
}

# === BUGATTI IMAGE URLS ===
bugatti_images = {
    "bugatti-eb110-gt-1991": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Bugatti_EB110_GT_%2814855055426%29.jpg",
    "bugatti-eb110-ss-1992": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Bugatti_EB110_SS_%2810230659256%29.jpg",
    "bugatti-veyron-164-2005": "https://upload.wikimedia.org/wikipedia/commons/5/54/Bugatti_Veyron_16.4_2.JPG",
    "bugatti-veyron-super-sport-2010": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Bugatti_Veyron_16.4_Super_Sport_%2810831280986%29.jpg",
    "bugatti-veyron-grand-sport-vitesse-2012": "https://upload.wikimedia.org/wikipedia/commons/4/41/Bugatti_Veyron_16.4_Grand_Sport_Vitesse_%2814482674574%29.jpg",
    "bugatti-chiron-2016": "https://upload.wikimedia.org/wikipedia/commons/5/5e/2016-03-01_Geneva_Motor_Show_0877.JPG",
    "bugatti-chiron-sport-2018": "https://upload.wikimedia.org/wikipedia/commons/9/99/Bugatti_Chiron_Sport_Top_Marques_2019_IMG_1035.jpg",
    "bugatti-chiron-super-sport-300-2019": "https://upload.wikimedia.org/wikipedia/commons/0/09/2020_Bugatti_Chiron_Super_Sport_300%2B_Prototype_Front.jpg",
    "bugatti-chiron-pur-sport-2020": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bugatti_Chiron_Pur_Sport_%2851645455880%29.jpg",
    # New models
    "bugatti-divo-2018": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Bugatti_Divo_%2849063655943%29.jpg",
    "bugatti-centodieci-2019": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Bugatti_Centodieci_%2849063655798%29.jpg",
    "bugatti-bolide-2020": "https://upload.wikimedia.org/wikipedia/commons/6/67/Bugatti_Bolide_Milano.jpg",
    "bugatti-mistral-2022": "https://upload.wikimedia.org/wikipedia/commons/0/08/Bugatti_Mistral_7.jpg",
    "bugatti-tourbillon-2024": "https://upload.wikimedia.org/wikipedia/commons/9/99/Bugatti_Tourbillon_at_The_Quail_2024.jpg",
}

# === KOENIGSEGG IMAGE URLS ===
koenigsegg_images = {
    "koenigsegg-cc8s-2002": "https://upload.wikimedia.org/wikipedia/commons/b/be/Koenigsegg_CC8S_%2852164513373%29.jpg",
    "koenigsegg-ccr-2004": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Koenigsegg_CCR.jpg",
    "koenigsegg-ccx-2006": "https://upload.wikimedia.org/wikipedia/commons/9/98/Koenigsegg_CCX.jpg",
    "koenigsegg-agera-2011": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Agera_%287464076462%29.jpg",
    "koenigsegg-agera-r-2011": "https://upload.wikimedia.org/wikipedia/commons/2/2b/2012-03-07_Motorshow_Geneva_4598.JPG",
    "koenigsegg-agera-rs-2015": "https://upload.wikimedia.org/wikipedia/commons/0/0a/2015-03-03_Geneva_Motor_Show_3297.JPG",
    "koenigsegg-jesko-2022": "https://upload.wikimedia.org/wikipedia/commons/6/68/2023_Koenigsegg_Jesko_Attack_%2877763%29.jpg",
    "koenigsegg-jesko-absolut-2022": "https://upload.wikimedia.org/wikipedia/commons/a/a4/2023_Koenigsegg_Jesko_Absolut.jpg",
    "koenigsegg-regera-2016": "https://upload.wikimedia.org/wikipedia/commons/0/0a/2015-03-03_Geneva_Motor_Show_3297.JPG",
    # New models
    "koenigsegg-one1-2014": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Koenigsegg_%28Agera%29_One-1_at_Goodwood_2014_008.jpg",
    "koenigsegg-gemera-2020": "https://upload.wikimedia.org/wikipedia/commons/5/56/Koenigsegg_Gemera_%2850817931577%29.jpg",
    "koenigsegg-cc850-2022": "https://upload.wikimedia.org/wikipedia/commons/4/44/Koenigsegg_CC850_%2852575923226%29.jpg",
}

# Better Regera image
koenigsegg_images["koenigsegg-regera-2016"] = "https://upload.wikimedia.org/wikipedia/commons/4/40/2015-03-03_Geneva_Motor_Show_3294.JPG"


def update_images(filename, image_map):
    """Update cover_image_url for existing variants in a JSON file."""
    filepath = os.path.join(SEED_DIR, filename)
    with open(filepath, "r") as f:
        data = json.load(f)

    updated = 0
    for series in data["series"]:
        for variant in series["variants"]:
            slug = variant["slug"]
            if slug in image_map and image_map[slug]:
                variant["cover_image_url"] = image_map[slug]
                updated += 1

    with open(filepath, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  {filename}: updated {updated} image URLs")
    return data


# === NEW MODELS TO ADD ===

def add_ferrari_missing(data):
    """Add 288 GTO and Daytona SP3 series."""
    # Add 288 GTO as first series
    gto_series = {
        "slug": "288-gto",
        "name_en": "288 GTO",
        "name_zh": "288 GTO",
        "production_start": 1984,
        "production_end": 1987,
        "description_en": "The Ferrari 288 GTO was Ferrari's first supercar of the modern era, built as a Group B homologation special. Its twin-turbocharged V8 and lightweight construction made it the fastest road car of its time. Only 272 were built. It laid the foundation for the F40.",
        "description_zh": "法拉利288 GTO是法拉利现代超跑的开山之作，作为B组赛车均质化特别版打造。双涡轮增压V8和轻量化结构使其成为当时最快的公路车。仅生产272台。它为F40奠定了基础。",
        "variants": [
            {
                "slug": "ferrari-288-gto-1984",
                "name_en": "288 GTO",
                "name_zh": "288 GTO",
                "year": 1984,
                "engine_layout": "mid-rear twin-turbo V8",
                "displacement_cc": 2855,
                "cylinders": 8,
                "forced_induction": "twin-turbo",
                "max_power_hp": 400,
                "max_torque_nm": 496,
                "zero_to_100_s": 4.9,
                "top_speed_kmh": 305,
                "weight_kg": 1160,
                "units_produced": 272,
                "msrp_usd": 83400,
                "cover_image_url": ferrari_images.get("ferrari-288-gto-1984"),
                "image_urls": [],
                "description_en": "Ferrari's Group B homologation special. The 2.8-litre twin-turbocharged V8, derived from the 308 GTB, produces 400 hp. Longitudinally mounted engine (unlike the transverse 308) with a carbon-Kevlar body saving significant weight. Only 272 built against the 200 required for homologation. The direct ancestor of the F40.",
                "description_zh": "法拉利B组赛车均质化特别版。源自308 GTB的2.8升双涡轮增压V8输出400马力。纵向安装发动机（不同于横置的308），碳纤维-Kevlar车身大幅减重。仅在均质化所需200台基础上生产了272台。F40的直接前身。"
            }
        ]
    }

    # Add Daytona SP3 as Icona series
    icona_series = {
        "slug": "daytona-sp3",
        "name_en": "Daytona SP3",
        "name_zh": "Daytona SP3",
        "production_start": 2022,
        "production_end": 2024,
        "description_en": "The Ferrari Daytona SP3 is the third car in Ferrari's Icona series, celebrating the legendary 1-2-3 finish at the 1967 24 Hours of Daytona. Its 840 hp naturally aspirated V12 is the most powerful Ferrari road car engine without hybrid assistance. Targa body with butterfly doors.",
        "description_zh": "法拉利Daytona SP3是法拉利Icona系列的第三款车，纪念1967年代托纳24小时耐力赛的1-2-3全包揽。其840马力自然吸气V12是法拉利最强大的非混动公路车发动机。Targa车身配蝴蝶门。",
        "variants": [
            {
                "slug": "ferrari-daytona-sp3-2022",
                "name_en": "Daytona SP3",
                "name_zh": "Daytona SP3",
                "year": 2022,
                "engine_layout": "mid-rear V12",
                "displacement_cc": 6496,
                "cylinders": 12,
                "forced_induction": "naturally aspirated",
                "max_power_hp": 840,
                "max_torque_nm": 697,
                "zero_to_100_s": 2.85,
                "top_speed_kmh": 340,
                "weight_kg": 1485,
                "units_produced": 599,
                "msrp_usd": 2250000,
                "cover_image_url": ferrari_images.get("ferrari-daytona-sp3-2022"),
                "image_urls": [],
                "description_en": "Third Icona model celebrating Ferrari's 1967 Daytona victory. The 6.5-litre V12 produces 840 hp at 9,250 RPM — the most powerful non-hybrid Ferrari road car engine ever. Carbon fibre targa body with butterfly doors, derived from the LaFerrari platform. 599 units at $2.25M each.",
                "description_zh": "第三款Icona车型，纪念法拉利1967年代托纳大捷。6.5升V12在9,250 RPM时输出840马力——法拉利有史以来最强大的非混动公路车发动机。碳纤维Targa车身配蝴蝶门，基于LaFerrari平台。599台，每台225万美元。"
            }
        ]
    }

    data["series"].insert(0, gto_series)
    data["series"].append(icona_series)
    return data


def add_lamborghini_missing(data):
    """Add Miura, Veneno, Centenario, Sián, Revuelto."""
    miura_series = {
        "slug": "miura",
        "name_en": "Miura",
        "name_zh": "Miura 缪拉",
        "production_start": 1966,
        "production_end": 1973,
        "description_en": "The Lamborghini Miura is widely considered the first supercar ever built. Its transverse mid-mounted V12, stunning Gandini design, and 170+ mph top speed redefined the sports car landscape. Named after the Spanish fighting bull breed.",
        "description_zh": "兰博基尼Miura被广泛认为是有史以来第一台超跑。其横置中置V12、甘迪尼的惊艳设计和超过170英里/小时的极速，重新定义了跑车格局。以西班牙斗牛品种命名。",
        "variants": [
            {
                "slug": "lamborghini-miura-p400-1966",
                "name_en": "Miura P400",
                "name_zh": "Miura P400",
                "year": 1966,
                "engine_layout": "mid transverse V12",
                "displacement_cc": 3929,
                "cylinders": 12,
                "forced_induction": "naturally aspirated",
                "max_power_hp": 350,
                "max_torque_nm": 370,
                "zero_to_100_s": 6.7,
                "top_speed_kmh": 280,
                "weight_kg": 1180,
                "units_produced": 275,
                "msrp_usd": None,
                "cover_image_url": lamborghini_images.get("lamborghini-miura-p400-1966"),
                "image_urls": [],
                "description_en": "The original Miura P400 debuted at the 1966 Geneva Motor Show and is considered the world's first supercar. A transverse mid-mounted 3.9-litre V12 producing 350 hp, clothed in Marcello Gandini's breathtaking design for Bertone. Changed the automotive world forever.",
                "description_zh": "原版Miura P400于1966年日内瓦车展首发，被认为是世界上第一台超跑。横置中置3.9升V12输出350马力，包裹在马尔切洛·甘迪尼为贝尔托内设计的惊艳外形中。永远改变了汽车世界。"
            },
            {
                "slug": "lamborghini-miura-sv-1971",
                "name_en": "Miura SV",
                "name_zh": "Miura SV",
                "year": 1971,
                "engine_layout": "mid transverse V12",
                "displacement_cc": 3929,
                "cylinders": 12,
                "forced_induction": "naturally aspirated",
                "max_power_hp": 385,
                "max_torque_nm": 400,
                "zero_to_100_s": 5.8,
                "top_speed_kmh": 290,
                "weight_kg": 1245,
                "units_produced": 150,
                "msrp_usd": None,
                "cover_image_url": lamborghini_images.get("lamborghini-miura-sv-1971"),
                "image_urls": [],
                "description_en": "The ultimate Miura. SV (Super Veloce) featured a revised V12 with 385 hp, wider rear fenders, improved rear suspension with limited-slip differential, and enhanced interior. The most refined and desirable Miura variant. 150 built.",
                "description_zh": "终极Miura。SV（超级速度）配备修改后的V12，385马力，更宽的后翼子板，改进的后悬架配限滑差速器，以及升级的内饰。最精致和最受追捧的Miura版本。生产150台。"
            }
        ]
    }

    special_series = {
        "slug": "special-editions",
        "name_en": "Special Editions",
        "name_zh": "特别版",
        "production_start": 2013,
        "production_end": None,
        "description_en": "Lamborghini's ultra-limited special edition hypercars, produced in extremely small numbers to celebrate milestones and push boundaries. Includes the Veneno, Centenario, and Sián — each more exclusive than the last.",
        "description_zh": "兰博基尼的超限量特别版超跑，以极少的数量生产，用于庆祝里程碑和突破极限。包括Veneno、Centenario和Sián——每一款都比上一款更加珍稀。",
        "variants": [
            {
                "slug": "lamborghini-veneno-2013",
                "name_en": "Veneno",
                "name_zh": "Veneno 毒药",
                "year": 2013,
                "engine_layout": "mid-rear V12",
                "displacement_cc": 6498,
                "cylinders": 12,
                "forced_induction": "naturally aspirated",
                "max_power_hp": 750,
                "max_torque_nm": 690,
                "zero_to_100_s": 2.8,
                "top_speed_kmh": 355,
                "weight_kg": 1450,
                "units_produced": 5,
                "msrp_usd": 4500000,
                "cover_image_url": lamborghini_images.get("lamborghini-veneno-2013"),
                "image_urls": [],
                "description_en": "Celebrating Lamborghini's 50th anniversary. Based on the Aventador with a 750 hp V12, radical aerodynamic bodywork, and carbon fibre construction. Only 3 coupes sold to customers (plus 1 for the factory). Named after a fighting bull. At $4.5M, one of the most expensive cars ever at launch.",
                "description_zh": "庆祝兰博基尼成立50周年。基于Aventador，搭载750马力V12，激进的空气动力学车身和碳纤维结构。仅3台硬顶版售予客户（加1台工厂留存）。以一头斗牛命名。以450万美元成为发布时最昂贵的车型之一。"
            },
            {
                "slug": "lamborghini-centenario-2016",
                "name_en": "Centenario LP 770-4",
                "name_zh": "Centenario LP 770-4 百年纪念",
                "year": 2016,
                "engine_layout": "mid-rear V12",
                "displacement_cc": 6498,
                "cylinders": 12,
                "forced_induction": "naturally aspirated",
                "max_power_hp": 770,
                "max_torque_nm": 690,
                "zero_to_100_s": 2.8,
                "top_speed_kmh": 350,
                "weight_kg": 1520,
                "units_produced": 40,
                "msrp_usd": 1900000,
                "cover_image_url": lamborghini_images.get("lamborghini-centenario-2016"),
                "image_urls": [],
                "description_en": "Built to celebrate the 100th birthday of founder Ferruccio Lamborghini. The most powerful naturally aspirated Lamborghini at launch with 770 hp from a 6.5-litre V12. 20 coupes and 20 roadsters, all sold before the Geneva Motor Show reveal.",
                "description_zh": "为庆祝创始人费鲁吉奥·兰博基尼诞辰100周年而打造。发布时搭载最强大的自然吸气兰博基尼发动机，6.5升V12输出770马力。20台硬顶版和20台敞篷版，在日内瓦车展揭幕前全部售罄。"
            },
            {
                "slug": "lamborghini-sian-fkp37-2019",
                "name_en": "Sián FKP 37",
                "name_zh": "Sián FKP 37 闪电",
                "year": 2019,
                "engine_layout": "mid-rear V12 mild hybrid",
                "displacement_cc": 6498,
                "cylinders": 12,
                "forced_induction": "naturally aspirated + supercapacitor",
                "max_power_hp": 819,
                "max_torque_nm": 720,
                "zero_to_100_s": 2.8,
                "top_speed_kmh": 350,
                "weight_kg": 1525,
                "units_produced": 63,
                "msrp_usd": 3600000,
                "cover_image_url": lamborghini_images.get("lamborghini-sian-fkp37-2019"),
                "image_urls": [],
                "description_en": "Lamborghini's first hybrid, using a supercapacitor instead of a battery. 'Sián' means 'lightning' in Bolognese dialect. FKP 37 honours Ferdinand Karl Piëch. The 6.5-litre V12 produces 785 hp, supplemented by a 34 hp electric motor for 819 hp total. 63 units (37 coupes + 19 roadsters), representing 1963, the year of Lamborghini's founding.",
                "description_zh": "兰博基尼首款混合动力车，使用超级电容器而非电池。'Sián'在博洛尼亚方言中意为'闪电'。FKP 37致敬费迪南德·卡尔·皮耶希。6.5升V12输出785马力，辅以34马力电动机，综合819马力。63台（37台硬顶+19台敞篷），代表1963年兰博基尼创立之年。"
            }
        ]
    }

    revuelto_series = {
        "slug": "revuelto",
        "name_en": "Revuelto",
        "name_zh": "Revuelto 雷武尔托",
        "production_start": 2023,
        "production_end": None,
        "description_en": "The Revuelto is the successor to the Aventador and Lamborghini's first series-production V12 plug-in hybrid. Combining a new 6.5-litre V12 with three electric motors for 1,015 hp, it represents the most powerful Lamborghini road car ever produced.",
        "description_zh": "Revuelto是Aventador的继任者，也是兰博基尼首款量产V12插电式混合动力车。将全新6.5升V12与三台电动机结合，输出1,015马力，是有史以来最强大的兰博基尼公路车。",
        "variants": [
            {
                "slug": "lamborghini-revuelto-2023",
                "name_en": "Revuelto",
                "name_zh": "Revuelto",
                "year": 2023,
                "engine_layout": "mid-rear V12 plug-in hybrid",
                "displacement_cc": 6498,
                "cylinders": 12,
                "forced_induction": "hybrid",
                "max_power_hp": 1015,
                "max_torque_nm": 725,
                "zero_to_100_s": 2.5,
                "top_speed_kmh": 350,
                "weight_kg": 1772,
                "units_produced": None,
                "msrp_usd": 608358,
                "cover_image_url": lamborghini_images.get("lamborghini-revuelto-2023"),
                "image_urls": [],
                "description_en": "Lamborghini's first V12 PHEV and the most powerful Lamborghini ever. New 6.5L V12 (825 hp at 9,250 RPM) combined with three electric motors for 1,015 hp total. New carbon fibre monocoque, 8-speed dual-clutch, eAWD via front electric motors. Named after a fighting bull.",
                "description_zh": "兰博基尼首款V12插电式混合动力车，也是有史以来最强大的兰博基尼。全新6.5L V12（9,250 RPM时825马力）结合三台电动机，综合输出1,015马力。全新碳纤维单体壳、8速双离合、通过前置电动机实现eAWD。以一头斗牛命名。"
            }
        ]
    }

    data["series"].insert(0, miura_series)
    data["series"].append(special_series)
    data["series"].append(revuelto_series)
    return data


def add_bugatti_missing(data):
    """Add Divo, Centodieci, Bolide, Mistral, Tourbillon to Chiron series or new series."""
    # Add special editions as a new series
    chiron_specials = {
        "slug": "chiron-special",
        "name_en": "Chiron Special Editions",
        "name_zh": "奇龙特别版",
        "production_start": 2018,
        "production_end": 2024,
        "description_en": "Ultra-limited variants of the Chiron platform, each exploring a different aspect of performance or luxury. The Divo prioritized handling, the Centodieci paid tribute to the EB110, and the Bolide stripped everything for maximum track performance.",
        "description_zh": "基于奇龙平台的超限量特别版，每款探索性能或奢华的不同方面。Divo注重操控，Centodieci致敬EB110，Bolide则剥离一切追求极限赛道性能。",
        "variants": [
            {
                "slug": "bugatti-divo-2018",
                "name_en": "Divo",
                "name_zh": "Divo 帝沃",
                "year": 2018,
                "engine_layout": "mid-rear quad-turbo W16",
                "displacement_cc": 7993,
                "cylinders": 16,
                "forced_induction": "quad-turbo",
                "max_power_hp": 1500,
                "max_torque_nm": 1600,
                "zero_to_100_s": 2.4,
                "top_speed_kmh": 380,
                "weight_kg": 1960,
                "units_produced": 40,
                "msrp_usd": 5800000,
                "cover_image_url": bugatti_images.get("bugatti-divo-2018"),
                "image_urls": [],
                "description_en": "Named after Albert Divo, two-time Targa Florio winner for Bugatti. The Divo trades top speed for lateral acceleration — 380 km/h limit but 1.6g cornering, 8 seconds faster than Chiron at Nardò. Reshaped body with 90 kg more downforce. All 40 sold at €5M before reveal.",
                "description_zh": "以布加迪两届塔加·弗洛里奥冠军阿尔贝·迪沃命名。Divo以极速换取横向加速——380 km/h限速但1.6g过弯，在纳尔多赛道比奇龙快8秒。重塑车身增加90公斤下压力。40台全部在揭幕前以500万欧元售罄。"
            },
            {
                "slug": "bugatti-centodieci-2019",
                "name_en": "Centodieci",
                "name_zh": "Centodieci 百十",
                "year": 2019,
                "engine_layout": "mid-rear quad-turbo W16",
                "displacement_cc": 7993,
                "cylinders": 16,
                "forced_induction": "quad-turbo",
                "max_power_hp": 1600,
                "max_torque_nm": 1600,
                "zero_to_100_s": 2.4,
                "top_speed_kmh": 380,
                "weight_kg": 1978,
                "units_produced": 10,
                "msrp_usd": 9000000,
                "cover_image_url": bugatti_images.get("bugatti-centodieci-2019"),
                "image_urls": [],
                "description_en": "Tribute to the EB110, 'centodieci' means '110' in Italian. W16 boosted to 1,600 hp, the most powerful Chiron variant at its reveal. Design references the EB110's five-hole side vents and horseshoe tail lights. Only 10 built at €8M each. Cristiano Ronaldo owns one.",
                "description_zh": "'Centodieci'在意大利语中意为'110'，致敬EB110。W16提升至1,600马力，揭幕时最强大的奇龙版本。设计参考了EB110的五孔侧面通风口和马蹄形尾灯。仅10台，每台800万欧元。C罗拥有一台。"
            },
            {
                "slug": "bugatti-bolide-2020",
                "name_en": "Bolide",
                "name_zh": "Bolide 火流星",
                "year": 2020,
                "engine_layout": "mid-rear quad-turbo W16",
                "displacement_cc": 7993,
                "cylinders": 16,
                "forced_induction": "quad-turbo",
                "max_power_hp": 1825,
                "max_torque_nm": 1850,
                "zero_to_100_s": 2.2,
                "top_speed_kmh": 500,
                "weight_kg": 1240,
                "units_produced": 40,
                "msrp_usd": 4700000,
                "cover_image_url": bugatti_images.get("bugatti-bolide-2020"),
                "image_urls": [],
                "description_en": "Track-only hypercar that answers 'what if the W16 had the lightest possible body?' 1,825 hp from the quad-turbo W16 in a body weighing just 1,240 kg — a power-to-weight ratio of 1,472 hp/ton. Theoretical top speed over 500 km/h. X-shaped tail lights. 40 units.",
                "description_zh": "仅限赛道的超级跑车，回答'如果W16拥有最轻的车身会怎样？'四涡轮W16在仅重1,240公斤的车身中输出1,825马力——功重比达到每吨1,472马力。理论极速超过500 km/h。X形尾灯。40台。"
            }
        ]
    }

    mistral_series = {
        "slug": "mistral",
        "name_en": "W16 Mistral",
        "name_zh": "W16 Mistral 密斯特拉",
        "production_start": 2022,
        "production_end": 2024,
        "description_en": "The final W16-powered Bugatti and the world's most powerful roadster. The Mistral is named after the powerful Mediterranean wind and serves as the last chapter of Bugatti's W16 era before the V16 hybrid Tourbillon.",
        "description_zh": "最后一款搭载W16的布加迪，也是世界上最强大的敞篷车。Mistral以地中海强风命名，标志着布加迪W16时代在V16混动Tourbillon之前的最后篇章。",
        "variants": [
            {
                "slug": "bugatti-mistral-2022",
                "name_en": "W16 Mistral",
                "name_zh": "W16 Mistral",
                "year": 2022,
                "engine_layout": "mid-rear quad-turbo W16",
                "displacement_cc": 7993,
                "cylinders": 16,
                "forced_induction": "quad-turbo",
                "max_power_hp": 1600,
                "max_torque_nm": 1600,
                "zero_to_100_s": 2.4,
                "top_speed_kmh": 453,
                "weight_kg": 1997,
                "units_produced": 99,
                "msrp_usd": 5000000,
                "cover_image_url": bugatti_images.get("bugatti-mistral-2022"),
                "image_urls": [],
                "description_en": "The last W16 roadster Bugatti will ever build. 1,600 hp open-top with a claimed 453 km/h top speed — the fastest roadster in the world. Design inspired by classic Bugatti roadsters. 99 units at €5M each, all sold before reveal.",
                "description_zh": "布加迪将制造的最后一台W16敞篷车。1,600马力敞篷，官称453 km/h极速——世界上最快的敞篷车。设计灵感源自经典布加迪敞篷车。99台，每台500万欧元，揭幕前全部售罄。"
            }
        ]
    }

    tourbillon_series = {
        "slug": "tourbillon",
        "name_en": "Tourbillon",
        "name_zh": "Tourbillon 陀飞轮",
        "production_start": 2026,
        "production_end": None,
        "description_en": "The Bugatti Tourbillon is the successor to the Chiron and marks a fundamental shift: a naturally aspirated 8.3-litre V16 engine paired with three electric motors for 1,800 hp. The first Bugatti without a W16 in the modern era. Named after the horological complication.",
        "description_zh": "布加迪Tourbillon是奇龙的继任者，标志着根本性转变：8.3升自然吸气V16发动机搭配三台电动机，综合1,800马力。现代布加迪首次不搭载W16。以钟表复杂功能'陀飞轮'命名。",
        "variants": [
            {
                "slug": "bugatti-tourbillon-2024",
                "name_en": "Tourbillon",
                "name_zh": "Tourbillon 陀飞轮",
                "year": 2024,
                "engine_layout": "mid-rear V16 plug-in hybrid",
                "displacement_cc": 8300,
                "cylinders": 16,
                "forced_induction": "hybrid",
                "max_power_hp": 1800,
                "max_torque_nm": 1800,
                "zero_to_100_s": 2.0,
                "top_speed_kmh": 445,
                "weight_kg": 1995,
                "units_produced": 250,
                "msrp_usd": 3800000,
                "cover_image_url": bugatti_images.get("bugatti-tourbillon-2024"),
                "image_urls": [],
                "description_en": "Bugatti's next chapter. The 8.3L naturally aspirated V16 revs to 9,000 RPM, paired with three electric motors for 1,800 hp total. An 800V electrical architecture and 25 kWh battery. Analog instrument cluster inspired by Swiss watchmaking. 250 units planned, deliveries from 2026.",
                "description_zh": "布加迪的下一篇章。8.3L自然吸气V16转速达9,000 RPM，搭配三台电动机综合输出1,800马力。800V电气架构和25千瓦时电池。受瑞士制表启发的模拟仪表盘。计划250台，2026年开始交付。"
            }
        ]
    }

    data["series"].append(chiron_specials)
    data["series"].append(mistral_series)
    data["series"].append(tourbillon_series)
    return data


def add_koenigsegg_missing(data):
    """Add One:1, Gemera, CC850."""
    # Add One:1 to Agera series
    for series in data["series"]:
        if series["slug"] == "agera":
            series["variants"].append({
                "slug": "koenigsegg-one1-2014",
                "name_en": "One:1",
                "name_zh": "One:1",
                "year": 2014,
                "engine_layout": "mid-rear twin-turbo V8",
                "displacement_cc": 4973,
                "cylinders": 8,
                "forced_induction": "twin-turbo",
                "max_power_hp": 1360,
                "max_torque_nm": 1371,
                "zero_to_100_s": 2.8,
                "top_speed_kmh": 440,
                "weight_kg": 1360,
                "units_produced": 6,
                "msrp_usd": 2850000,
                "cover_image_url": koenigsegg_images.get("koenigsegg-one1-2014"),
                "image_urls": [],
                "description_en": "The world's first 'megacar' — named for its 1:1 power-to-weight ratio (1,360 hp / 1,360 kg). Twin-turbo 5.0L V8 producing 1 megawatt of power. Set a 0-300-0 km/h record of 17.95 seconds. Only 6 production units plus 1 prototype. First production car with over 1 megawatt.",
                "description_zh": "世界首台'百万瓦超跑'——以其1:1的功重比命名（1,360马力/1,360公斤）。双涡轮5.0L V8输出1兆瓦功率。创下0-300-0 km/h仅17.95秒的纪录。仅6台量产版加1台原型车。首款功率超过1兆瓦的量产车。"
            })

    # Add Gemera series
    gemera_series = {
        "slug": "gemera",
        "name_en": "Gemera",
        "name_zh": "Gemera 吉梅拉",
        "production_start": 2023,
        "production_end": None,
        "description_en": "The Gemera is Koenigsegg's first four-seater and the world's first Mega-GT. It combines a 2.0-litre three-cylinder twin-turbo engine (the most powerful three-cylinder ever) with three electric motors for 1,700 hp. Four real seats, luggage space, and hypercar performance.",
        "description_zh": "Gemera是柯尼塞格首款四座车，也是世界首款Mega-GT。将2.0升三缸双涡轮发动机（有史以来最强三缸机）与三台电动机结合，输出1,700马力。四个真实座椅、行李空间和超跑性能。",
        "variants": [
            {
                "slug": "koenigsegg-gemera-2020",
                "name_en": "Gemera",
                "name_zh": "Gemera",
                "year": 2020,
                "engine_layout": "mid-rear 3-cyl twin-turbo + 3 electric motors",
                "displacement_cc": 1988,
                "cylinders": 3,
                "forced_induction": "twin-turbo + hybrid",
                "max_power_hp": 1700,
                "max_torque_nm": 3500,
                "zero_to_100_s": 1.9,
                "top_speed_kmh": 400,
                "weight_kg": 1850,
                "units_produced": 300,
                "msrp_usd": 1700000,
                "cover_image_url": koenigsegg_images.get("koenigsegg-gemera-2020"),
                "image_urls": [],
                "description_en": "World's first Mega-GT. The Tiny Friendly Giant (TFG) 2.0L three-cylinder produces 600 hp — the most powerful 3-cylinder engine ever built. Three electric motors add 1,100 hp for 1,700 hp total and 3,500 Nm. Four seats, two doors with Koenigsegg's Autosilla system. 300 planned.",
                "description_zh": "世界首款Mega-GT。名为'小友好巨人'（TFG）的2.0L三缸发动机输出600马力——有史以来最强大的三缸发动机。三台电动机增加1,100马力，综合1,700马力和3,500牛·米。四座两门，配备柯尼塞格Autosilla系统。计划生产300台。"
            }
        ]
    }

    # Add CC850 series
    cc850_series = {
        "slug": "cc850",
        "name_en": "CC850",
        "name_zh": "CC850",
        "production_start": 2022,
        "production_end": None,
        "description_en": "The CC850 celebrates 20 years of Koenigsegg and the 50th birthday of Christian von Koenigsegg. It's a modern reinterpretation of the CC8S with a unique Engage Shift System (ESS) that can function as both a 6-speed manual and a 9-speed automatic.",
        "description_zh": "CC850庆祝柯尼塞格成立20周年和克里斯蒂安·冯·柯尼塞格50岁生日。它是CC8S的现代重新诠释，配备独特的Engage换挡系统（ESS），可同时作为6速手动和9速自动变速箱使用。",
        "variants": [
            {
                "slug": "koenigsegg-cc850-2022",
                "name_en": "CC850",
                "name_zh": "CC850",
                "year": 2022,
                "engine_layout": "mid-rear twin-turbo V8",
                "displacement_cc": 4973,
                "cylinders": 8,
                "forced_induction": "twin-turbo",
                "max_power_hp": 1385,
                "max_torque_nm": 1385,
                "zero_to_100_s": 2.6,
                "top_speed_kmh": 450,
                "weight_kg": 1385,
                "units_produced": 70,
                "msrp_usd": 3650000,
                "cover_image_url": koenigsegg_images.get("koenigsegg-cc850-2022"),
                "image_urls": [],
                "description_en": "Celebrates 20 years of Koenigsegg with a retro-inspired design echoing the CC8S. The revolutionary Engage Shift System (ESS) can work as a 6-speed manual with a gated shifter or a 9-speed automatic — switching modes seamlessly. 1,385 hp, targa body. 50 units initially, expanded to 70.",
                "description_zh": "以复古设计致敬CC8S，庆祝柯尼塞格成立20周年。革命性的Engage换挡系统（ESS）可在带挡位槽的6速手动和9速自动之间无缝切换。1,385马力，Targa车身。最初50台，后扩展至70台。"
            }
        ]
    }

    data["series"].append(gemera_series)
    data["series"].append(cc850_series)
    return data


# === PAGANI IMAGE UPDATES ===
pagani_images = {
    "pagani-zonda-c12-1999": "https://upload.wikimedia.org/wikipedia/commons/6/62/Pagani_Zonda_C12_-_Flickr_-_exfordy.jpg",
    "pagani-zonda-c12-s-2000": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Pagani_Zonda_S_%287188898896%29.jpg",
    "pagani-zonda-s-73-2003": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Pagani_Zonda_S_7.3_%2810712604096%29.jpg",
    "pagani-zonda-f-2005": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pagani_Zonda_F_%286939226060%29.jpg",
    "pagani-zonda-f-2005-roadster": "https://upload.wikimedia.org/wikipedia/commons/8/84/Pagani_Zonda_F_Roadster_%286193228537%29.jpg",
    "pagani-zonda-cinque-2009": "https://upload.wikimedia.org/wikipedia/commons/5/57/Pagani_Zonda_Cinque_%2830666913164%29.jpg",
    "pagani-zonda-cinque-2009-roadster": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Pagani_Zonda_Cinque_Roadster_%288012298730%29.jpg",
    "pagani-zonda-tricolore-2010": "https://upload.wikimedia.org/wikipedia/commons/6/65/Pagani_Zonda_Tricolore_%286004682117%29.jpg",
    "pagani-zonda-r-2009": "https://upload.wikimedia.org/wikipedia/commons/0/06/Pagani_Zonda_R_%2812541371753%29.jpg",
    "pagani-zonda-revolucion-2013": "https://upload.wikimedia.org/wikipedia/commons/4/48/Pagani_Zonda_Revoluci%C3%B3n_%2815853432626%29.jpg",
    "pagani-zonda-hp-barchetta-2017": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Pagani_Zonda_HP_Barchetta_%2849063686938%29.jpg",
    "pagani-huayra-2012": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Pagani_Huayra_%2816457011655%29.jpg",
    "pagani-huayra-bc-2016": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Pagani_Huayra_BC_%2830666869694%29.jpg",
    "pagani-huayra-roadster-2017": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Pagani_Huayra_Roadster_%2838571652696%29.jpg",
    "pagani-huayra-roadster-bc-2019": "https://upload.wikimedia.org/wikipedia/commons/0/03/Pagani_Huayra_Roadster_BC_%2849088189888%29.jpg",
    "pagani-huayra-r-2021": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Pagani_Huayra_R_%2851693946756%29.jpg",
    "pagani-huayra-codalunga-2022": None,  # very rare one-off, no clear Wikimedia image
    "pagani-utopia-2022": "https://upload.wikimedia.org/wikipedia/commons/2/20/Pagani_Utopia_%2852863990773%29.jpg",
    "pagani-utopia-roadster-2024": None,  # too new for Wikimedia
}


def main():
    print("=== Updating all brand data ===\n")

    # 1. Ferrari
    print("Ferrari:")
    data = update_images("ferrari.json", ferrari_images)
    data = add_ferrari_missing(data)
    with open(os.path.join(SEED_DIR, "ferrari.json"), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    total = sum(len(s["variants"]) for s in data["series"])
    print(f"  Total variants: {total} ({total - 13} new)")

    # 2. Lamborghini
    print("Lamborghini:")
    data = update_images("lamborghini.json", lamborghini_images)
    data = add_lamborghini_missing(data)
    with open(os.path.join(SEED_DIR, "lamborghini.json"), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    total = sum(len(s["variants"]) for s in data["series"])
    print(f"  Total variants: {total} ({total - 18} new)")

    # 3. Bugatti
    print("Bugatti:")
    data = update_images("bugatti.json", bugatti_images)
    data = add_bugatti_missing(data)
    with open(os.path.join(SEED_DIR, "bugatti.json"), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    total = sum(len(s["variants"]) for s in data["series"])
    print(f"  Total variants: {total} ({total - 9} new)")

    # 4. Koenigsegg
    print("Koenigsegg:")
    data = update_images("koenigsegg.json", koenigsegg_images)
    data = add_koenigsegg_missing(data)
    with open(os.path.join(SEED_DIR, "koenigsegg.json"), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    total = sum(len(s["variants"]) for s in data["series"])
    print(f"  Total variants: {total} ({total - 9} new)")

    # 5. Pagani (images only, no new models needed for now)
    print("Pagani:")
    update_images("pagani.json", pagani_images)

    print("\n=== Done! Run seed script to push to database ===")


if __name__ == "__main__":
    main()
