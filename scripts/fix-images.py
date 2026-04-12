#!/usr/bin/env python3
"""
Fix all image URLs by resolving them through the Wikimedia API.
Converts filenames to proper thumbnail URLs (800px width).
"""
import json
import os
import urllib.request
import urllib.parse
import time

SEED_DIR = os.path.join(os.path.dirname(__file__), "seed-data")

def get_thumb_url(filename, width=800):
    """Use Wikimedia API to get a proper thumbnail URL for a file."""
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url",
        "iiurlwidth": str(width),
        "format": "json",
    }
    url = f"{api}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "SupercarWiki/1.0 (auto-list project; educational)")
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        pages = data.get("query", {}).get("pages", {})
        for page_id, page in pages.items():
            if page_id == "-1":
                return None  # File not found
            info = page.get("imageinfo", [{}])[0]
            return info.get("thumburl") or info.get("url")
    except Exception as e:
        print(f"    API error for {filename}: {e}")
        return None


def extract_filename(url):
    """Extract Wikimedia filename from a commons URL."""
    if not url:
        return None
    # Handle both /commons/a/ab/Filename.jpg and /commons/thumb/a/ab/Filename.jpg/800px-...
    parts = url.split("/commons/")
    if len(parts) < 2:
        return None
    path = parts[1]
    # Remove thumb prefix if present
    if path.startswith("thumb/"):
        path = path[6:]  # remove "thumb/"
    # Path is now like "a/ab/Filename.jpg" or "a/ab/Filename.jpg/800px-Filename.jpg"
    segments = path.split("/")
    if len(segments) >= 3:
        return urllib.parse.unquote(segments[2])
    return None


# Mapping of slug -> Wikimedia filename for all cars
# These are the CORRECT filenames from Wikimedia Commons
IMAGE_MAP = {
    # === FERRARI ===
    "ferrari-288-gto-1984": "Ferrari_288_GTO_(1).JPG",
    "ferrari-f40-1987": "F40_Ferrari_20090509.jpg",
    "ferrari-f40-lm-1989": "Ferrari_F40_LM_-_Flickr_-_exfordy.jpg",
    "ferrari-f40-competizione-1989": "Ferrari_F40_(7566485418).jpg",
    "ferrari-f50-1995": "Ferrari_F50_in_Switzerland.jpg",
    "ferrari-f50-gt-1996": None,
    "ferrari-enzo-2002": "Enzo_Ferrari_(8721223019).jpg",
    "ferrari-fxx-2005": "Ferrari_FXX_(8691745873).jpg",
    "ferrari-laferrari-2013": "Festival_automobile_international_2014_-_Ferrari_LaFerrari_-_003.jpg",
    "ferrari-laferrari-aperta-2016": "Ferrari_LaFerrari_Aperta_(1).jpg",
    "ferrari-fxx-k-2014": "2015_Ferrari_FXX-K_RED.jpg",
    "ferrari-sf90-stradale-2019": "Ferrari_SF90_Stradale_(48264238912).jpg",
    "ferrari-sf90-spider-2020": "Ferrari_SF90_Spider,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0339).jpg",
    "ferrari-sf90-xx-stradale-2023": "Ferrari_SF90_XX_Stradale,_GIMS_2023,_Le_Grand-Saconnex_(1X7A5966).jpg",
    "ferrari-daytona-sp3-2022": "Ferrari_Daytona_SP3,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0279).jpg",

    # === LAMBORGHINI ===
    "lamborghini-miura-p400-1966": "1967_Lamborghini_Miura_P400_-_fvr_(4637051511).jpg",
    "lamborghini-miura-sv-1971": "Lamborghini_Miura_SV_(7723990676).jpg",
    "lamborghini-countach-lp400-1974": "1977_Lamborghini_Countach_LP400_(8880269907).jpg",
    "lamborghini-countach-lp500s-1982": "Lamborghini_Countach_LP500_S_-_Flickr_-_Alexandre_Prévot.jpg",
    "lamborghini-countach-25th-anniversary-1988": "Lamborghini_Countach_(7636459788).jpg",
    "lamborghini-diablo-1990": "Lamborghini_Diablo_(16099506577).jpg",
    "lamborghini-diablo-vt-1993": "Lamborghini_Diablo_VT.jpg",
    "lamborghini-diablo-sv-1995": "Lamborghini_Diablo_SV_(16070399418).jpg",
    "lamborghini-diablo-gtr-1999": "Lamborghini_Diablo_GT_(38810846014).jpg",
    "lamborghini-murcielago-2001": "SC06_Lamborghini_Murciélago.jpg",
    "lamborghini-murcielago-lp640-2006": "Lamborghini_Murcielago_LP-640_(7345136472).jpg",
    "lamborghini-murcielago-lp670-4-sv-2009": "Lamborghini_Murciélago_LP_670-4_SuperVeloce_(7254449236).jpg",
    "lamborghini-aventador-lp700-4-2011": "Lamborghini_Aventador_LP_700-4_(8735044938).jpg",
    "lamborghini-aventador-sv-2015": "Lamborghini_Aventador_LP750-4_Superveloce_(20698865898).jpg",
    "lamborghini-aventador-svj-2018": "Lamborghini_Aventador_SVJ_(48264212107).jpg",
    "lamborghini-aventador-ultimae-2021": "Lamborghini_Aventador_Ultimae_at_Goodwood_FOS_2021.jpg",
    "lamborghini-huracan-lp610-4-2014": "Lamborghini_Huracán_LP_610-4_(14089170639).jpg",
    "lamborghini-huracan-performante-2017": "Lamborghini_Huracán_Performante_(36790302703).jpg",
    "lamborghini-huracan-sto-2020": "Lamborghini_Huracán_STO_(51148145471).jpg",
    "lamborghini-huracan-tecnica-2022": "Lamborghini_Huracán_Tecnica,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0247).jpg",
    "lamborghini-veneno-2013": "Geneva_MotorShow_2013_-_Lamborghini_Veneno.jpg",
    "lamborghini-centenario-2016": "Lamborghini_Centenario_LP_770-4_(32275477474).jpg",
    "lamborghini-sian-fkp37-2019": "Lamborghini_Sián_FKP_37_(49088225788).jpg",
    "lamborghini-revuelto-2023": "Lamborghini_Revuelto,_GIMS_2023,_Le_Grand-Saconnex_(1X7A5864).jpg",

    # === BUGATTI ===
    "bugatti-eb110-gt-1991": "Bugatti_EB110_(14855055426).jpg",
    "bugatti-eb110-ss-1992": "Bugatti_EB110_SS_(9478733218).jpg",
    "bugatti-veyron-164-2005": "Bugatti_Veyron_16.4_–_Frontansicht_(1),_5._April_2012,_Düsseldorf.jpg",
    "bugatti-veyron-super-sport-2010": "Bugatti_Veyron_16.4_Super_Sport_(10831280986).jpg",
    "bugatti-veyron-grand-sport-vitesse-2012": "Bugatti_Veyron_16.4_Grand_Sport_Vitesse_(14482674574).jpg",
    "bugatti-chiron-2016": "Bugatti_Chiron,_GIMS_2018,_Le_Grand-Saconnex_(1X7A1756).jpg",
    "bugatti-chiron-sport-2018": "Bugatti_Chiron_Sport,_GIMS_2018,_Le_Grand-Saconnex_(1X7A1723).jpg",
    "bugatti-chiron-super-sport-300-2019": "Bugatti_Chiron_Super_Sport_300+,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0188).jpg",
    "bugatti-chiron-pur-sport-2020": "Bugatti_Chiron_Pur_Sport_(51645455880).jpg",
    "bugatti-divo-2018": "Bugatti_Divo_(49063655943).jpg",
    "bugatti-centodieci-2019": "Bugatti_Centodieci,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0173).jpg",
    "bugatti-bolide-2020": "Bugatti_Bolide,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0203).jpg",
    "bugatti-mistral-2022": "Bugatti_W16_Mistral,_GIMS_2023,_Le_Grand-Saconnex_(1X7A5804).jpg",
    "bugatti-tourbillon-2024": "Bugatti_Tourbillon_at_Goodwood_FOS_2024.jpg",

    # === KOENIGSEGG ===
    "koenigsegg-cc8s-2002": "Koenigsegg_CC8S_(5019056606).jpg",
    "koenigsegg-ccr-2004": "Koenigsegg_CCR_(8621849843).jpg",
    "koenigsegg-ccx-2006": "Koenigsegg_CCX_(9524008619).jpg",
    "koenigsegg-agera-2011": "Koenigsegg_Agera_(7636308934).jpg",
    "koenigsegg-agera-r-2011": "2012-03-07_Motorshow_Geneva_4598.JPG",
    "koenigsegg-agera-rs-2015": "2015-03-03_Geneva_Motor_Show_3297.JPG",
    "koenigsegg-one1-2014": "Koenigsegg_(Agera)_One-1_at_Goodwood_2014_008.jpg",
    "koenigsegg-jesko-2022": "Koenigsegg_Jesko,_GIMS_2019,_Le_Grand-Saconnex_(1X7A9316).jpg",
    "koenigsegg-jesko-absolut-2022": "Koenigsegg_Jesko_Absolut,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0350).jpg",
    "koenigsegg-regera-2016": "Koenigsegg_Regera,_GIMS_2018,_Le_Grand-Saconnex_(1X7A1629).jpg",
    "koenigsegg-gemera-2020": "Koenigsegg_Gemera,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0361).jpg",
    "koenigsegg-cc850-2022": "Koenigsegg_CC850,_GIMS_2023,_Le_Grand-Saconnex_(1X7A5847).jpg",

    # === PAGANI ===
    "pagani-zonda-c12-1999": "Pagani_Zonda_C12_-_Flickr_-_exfordy.jpg",
    "pagani-zonda-c12-s-2000": "Pagani_Zonda_S_(7188898896).jpg",
    "pagani-zonda-s-73-2003": "Pagani_Zonda_S_7.3_(10712604096).jpg",
    "pagani-zonda-f-2005": "Pagani_Zonda_F_(6200411960).jpg",
    "pagani-zonda-f-2005-roadster": "Pagani_Zonda_F_Roadster_(6193228537).jpg",
    "pagani-zonda-cinque-2009": "Pagani_Zonda_Cinque_(30666913164).jpg",
    "pagani-zonda-cinque-2009-roadster": "Pagani_Zonda_Cinque_Roadster_(8012298730).jpg",
    "pagani-zonda-tricolore-2010": "Pagani_Zonda_Tricolore_(6004682117).jpg",
    "pagani-zonda-r-2009": "Pagani_Zonda_R_(12541371753).jpg",
    "pagani-zonda-revolucion-2013": "Pagani_Zonda_Revolución_(15853432626).jpg",
    "pagani-zonda-hp-barchetta-2017": "Pagani_Zonda_HP_Barchetta_(49063686938).jpg",
    "pagani-huayra-2012": "Festival_automobile_international_2014_-_Pagani_Huayra_-_003.jpg",
    "pagani-huayra-bc-2016": "Pagani_Huayra_BC_(30666869694).jpg",
    "pagani-huayra-roadster-2017": "Pagani_Huayra_Roadster_(38571652696).jpg",
    "pagani-huayra-roadster-bc-2019": "Pagani_Huayra_Roadster_BC_(49088189888).jpg",
    "pagani-huayra-r-2021": "Pagani_Huayra_R,_GIMS_2022,_Le_Grand-Saconnex_(1X7A0296).jpg",
    "pagani-huayra-codalunga-2022": None,
    "pagani-utopia-2023": "Pagani_Utopia,_GIMS_2023,_Le_Grand-Saconnex_(1X7A5959).jpg",
    "pagani-utopia-roadster-2024": None,
}


def main():
    print("=== Resolving image URLs via Wikimedia API ===\n")

    resolved = {}
    total = sum(1 for v in IMAGE_MAP.values() if v)
    done = 0

    for slug, filename in IMAGE_MAP.items():
        if not filename:
            resolved[slug] = None
            continue

        done += 1
        print(f"  [{done}/{total}] {slug}...", end=" ", flush=True)
        thumb = get_thumb_url(filename, width=800)
        if thumb:
            resolved[slug] = thumb
            print("OK")
        else:
            print("NOT FOUND")
            resolved[slug] = None

        time.sleep(0.3)  # Be polite to Wikimedia

    # Update all JSON files
    print("\n=== Updating JSON files ===\n")

    for fname in sorted(os.listdir(SEED_DIR)):
        if not fname.endswith(".json"):
            continue
        filepath = os.path.join(SEED_DIR, fname)
        with open(filepath) as f:
            data = json.load(f)

        updated = 0
        for series in data["series"]:
            for variant in series["variants"]:
                slug = variant["slug"]
                if slug in resolved:
                    if resolved[slug]:
                        variant["cover_image_url"] = resolved[slug]
                        updated += 1
                    elif variant.get("cover_image_url"):
                        # Keep existing URL if we don't have a replacement
                        pass

        with open(filepath, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"  {fname}: {updated} images resolved")

    # Summary
    ok = sum(1 for v in resolved.values() if v)
    fail = sum(1 for k, v in resolved.items() if v is None and IMAGE_MAP.get(k))
    print(f"\n=== Summary: {ok} resolved, {fail} not found ===")


if __name__ == "__main__":
    main()
