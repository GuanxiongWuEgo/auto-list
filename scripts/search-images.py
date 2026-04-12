#!/usr/bin/env python3
"""Search Wikimedia Commons for car images using the API."""
import json
import os
import urllib.request
import urllib.parse
import time

SEED_DIR = os.path.join(os.path.dirname(__file__), "seed-data")

def search_and_get_thumb(query, width=800):
    """Search Wikimedia Commons and return the first good result's thumbnail URL."""
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": f'"{query}"',
        "gsrnamespace": "6",  # File namespace
        "gsrlimit": "5",
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
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
        for page_id, page in sorted(pages.items(), key=lambda x: x[0]):
            info = page.get("imageinfo", [{}])[0]
            mime = info.get("mime", "")
            if "image" not in mime:
                continue
            thumb = info.get("thumburl")
            if thumb:
                return thumb, page.get("title", "")
        return None, None
    except Exception as e:
        return None, str(e)


# All cars to find images for
SEARCHES = {
    # Ferrari
    "ferrari-288-gto-1984": "Ferrari 288 GTO",
    "ferrari-f40-1987": "Ferrari F40",
    "ferrari-f40-lm-1989": "Ferrari F40 LM",
    "ferrari-f40-competizione-1989": "Ferrari F40 Competizione",
    "ferrari-f50-1995": "Ferrari F50",
    "ferrari-enzo-2002": "Ferrari Enzo",
    "ferrari-fxx-2005": "Ferrari FXX",
    "ferrari-laferrari-2013": "Ferrari LaFerrari",
    "ferrari-laferrari-aperta-2016": "Ferrari LaFerrari Aperta",
    "ferrari-fxx-k-2014": "Ferrari FXX K",
    "ferrari-sf90-stradale-2019": "Ferrari SF90 Stradale",
    "ferrari-sf90-spider-2020": "Ferrari SF90 Spider",
    "ferrari-sf90-xx-stradale-2023": "Ferrari SF90 XX",
    "ferrari-daytona-sp3-2022": "Ferrari Daytona SP3",

    # Lamborghini
    "lamborghini-miura-p400-1966": "Lamborghini Miura P400",
    "lamborghini-miura-sv-1971": "Lamborghini Miura SV",
    "lamborghini-countach-lp400-1974": "Lamborghini Countach LP400",
    "lamborghini-countach-lp500s-1982": "Lamborghini Countach LP500",
    "lamborghini-countach-25th-anniversary-1988": "Lamborghini Countach 25th Anniversary",
    "lamborghini-diablo-1990": "Lamborghini Diablo",
    "lamborghini-diablo-vt-1993": "Lamborghini Diablo VT",
    "lamborghini-diablo-sv-1995": "Lamborghini Diablo SV",
    "lamborghini-diablo-gtr-1999": "Lamborghini Diablo GT",
    "lamborghini-murcielago-2001": "Lamborghini Murciélago",
    "lamborghini-murcielago-lp640-2006": "Lamborghini Murciélago LP640",
    "lamborghini-murcielago-lp670-4-sv-2009": "Lamborghini Murciélago LP670 SV",
    "lamborghini-aventador-lp700-4-2011": "Lamborghini Aventador LP700",
    "lamborghini-aventador-sv-2015": "Lamborghini Aventador SV",
    "lamborghini-aventador-svj-2018": "Lamborghini Aventador SVJ",
    "lamborghini-aventador-ultimae-2021": "Lamborghini Aventador Ultimae",
    "lamborghini-huracan-lp610-4-2014": "Lamborghini Huracán LP610",
    "lamborghini-huracan-performante-2017": "Lamborghini Huracán Performante",
    "lamborghini-huracan-sto-2020": "Lamborghini Huracán STO",
    "lamborghini-huracan-tecnica-2022": "Lamborghini Huracán Tecnica",
    "lamborghini-veneno-2013": "Lamborghini Veneno",
    "lamborghini-centenario-2016": "Lamborghini Centenario",
    "lamborghini-sian-fkp37-2019": "Lamborghini Sián",
    "lamborghini-revuelto-2023": "Lamborghini Revuelto",

    # Bugatti
    "bugatti-eb110-gt-1991": "Bugatti EB110 GT",
    "bugatti-eb110-ss-1992": "Bugatti EB110 Super Sport",
    "bugatti-veyron-164-2005": "Bugatti Veyron 16.4",
    "bugatti-veyron-super-sport-2010": "Bugatti Veyron Super Sport",
    "bugatti-veyron-grand-sport-vitesse-2012": "Bugatti Veyron Grand Sport Vitesse",
    "bugatti-chiron-2016": "Bugatti Chiron",
    "bugatti-chiron-sport-2018": "Bugatti Chiron Sport",
    "bugatti-chiron-super-sport-300-2019": "Bugatti Chiron Super Sport 300",
    "bugatti-chiron-pur-sport-2020": "Bugatti Chiron Pur Sport",
    "bugatti-divo-2018": "Bugatti Divo",
    "bugatti-centodieci-2019": "Bugatti Centodieci",
    "bugatti-bolide-2020": "Bugatti Bolide",
    "bugatti-mistral-2022": "Bugatti Mistral",
    "bugatti-tourbillon-2024": "Bugatti Tourbillon",

    # Koenigsegg
    "koenigsegg-cc8s-2002": "Koenigsegg CC8S",
    "koenigsegg-ccr-2004": "Koenigsegg CCR",
    "koenigsegg-ccx-2006": "Koenigsegg CCX",
    "koenigsegg-agera-2011": "Koenigsegg Agera",
    "koenigsegg-agera-r-2011": "Koenigsegg Agera R",
    "koenigsegg-agera-rs-2015": "Koenigsegg Agera RS",
    "koenigsegg-one1-2014": "Koenigsegg One:1",
    "koenigsegg-jesko-2022": "Koenigsegg Jesko",
    "koenigsegg-jesko-absolut-2022": "Koenigsegg Jesko Absolut",
    "koenigsegg-regera-2016": "Koenigsegg Regera",
    "koenigsegg-gemera-2020": "Koenigsegg Gemera",
    "koenigsegg-cc850-2022": "Koenigsegg CC850",

    # Pagani
    "pagani-zonda-c12-1999": "Pagani Zonda C12",
    "pagani-zonda-c12-s-2000": "Pagani Zonda S",
    "pagani-zonda-s-73-2003": "Pagani Zonda S 7.3",
    "pagani-zonda-f-2005": "Pagani Zonda F",
    "pagani-zonda-f-2005-roadster": "Pagani Zonda F Roadster",
    "pagani-zonda-cinque-2009": "Pagani Zonda Cinque",
    "pagani-zonda-cinque-2009-roadster": "Pagani Zonda Cinque Roadster",
    "pagani-zonda-tricolore-2010": "Pagani Zonda Tricolore",
    "pagani-zonda-r-2009": "Pagani Zonda R",
    "pagani-zonda-revolucion-2013": "Pagani Zonda Revolución",
    "pagani-zonda-hp-barchetta-2017": "Pagani Zonda HP Barchetta",
    "pagani-huayra-2012": "Pagani Huayra",
    "pagani-huayra-bc-2016": "Pagani Huayra BC",
    "pagani-huayra-roadster-2017": "Pagani Huayra Roadster",
    "pagani-huayra-roadster-bc-2019": "Pagani Huayra Roadster BC",
    "pagani-huayra-r-2021": "Pagani Huayra R",
    "pagani-utopia-2023": "Pagani Utopia",
}


def main():
    print("=== Searching Wikimedia Commons for car images ===\n")

    resolved = {}
    total = len(SEARCHES)
    done = 0

    for slug, query in SEARCHES.items():
        done += 1
        print(f"  [{done}/{total}] {query}...", end=" ", flush=True)
        thumb, title = search_and_get_thumb(query)
        if thumb:
            resolved[slug] = thumb
            print(f"OK ({title})")
        else:
            print("NOT FOUND")
            resolved[slug] = None
        time.sleep(0.5)

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
                if slug in resolved and resolved[slug]:
                    variant["cover_image_url"] = resolved[slug]
                    updated += 1

        with open(filepath, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"  {fname}: {updated} images")

    ok = sum(1 for v in resolved.values() if v)
    print(f"\n=== Summary: {ok}/{total} images found ===")


if __name__ == "__main__":
    main()
