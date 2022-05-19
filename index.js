const puppeteer = require("puppeteer");
const fs = require("fs");

const FILE_NAME = "results.txt";

(async () => {
    if (fs.existsSync(FILE_NAME)) {
        fs.unlinkSync(FILE_NAME);
    }

    const browser = await puppeteer.launch(
        process.platform === "linux"
            ? {
                  executablePath: "/usr/bin/chromium-browser",
                  args: ["--no-sandbox"],
              }
            : undefined
    );
    const page = await browser.newPage();
    const url =
        "https://www.amiami.com/eng/search/list/?s_condition_flg=1&s_st_condition_flg=1&s_sortkey=preowned&s_cate2=459";

    let pageIndex = 1;

    try {
        while (pageIndex <= 20) {
            await page.goto(url + "&pagecnt=" + pageIndex);
            await page.waitForSelector("p.newly-added-items__item__name");

            const pageResults = await page.evaluate(() => {
                const figureNames = [
                    "Kaori Miyazono",
                    "Asuka Langley Jersey",
                    "KDcolle Saber Alter Kimono",
                    "Kagurazaka Reina",
                    "Dizzy",
                    'Kaerunoko Illustration "Neko"',
                    "Girls Chun-Mei",
                    "Lazy Afternoon",
                    "Hanekawa 2 Figures Set",
                    "KDcolle Megumin Sunflower",
                    "Sword Art Online Asuna -Crystal Dress",
                    "Niya",
                    "Megumi Kato First Meeting",
                    "Ayaka-chan",
                    "Comic Aun Hinagiku",
                    "Magic City Dream",
                    "Fate/Grand Order Saber/Altria Pendragon [Lily]",
                    "Chika Fujiwara",
                    "Nendoroid Doll",
                    "Spice and Wolf Holo",
                    "Shinobu Oshino",
                    "Keqing Driving",
                    "Megurine Luka Temptation",
                    "OTs-14",
                    "Mushroom Girls",
                    "Gals Series Katsuragi Misato",
                    "League of Legends Elementalist Lux",
                    "KDcolle Light Novel Edition Siesta",
                    "Character's Selection",
                    "Ayanami Rei Millennials",
                    "Sakurajima Mai Bunny Girl",
                    "Jeanne d'Arc Dress",
                    "Houkai 3rd Sakura Yae Chinese Dress",
                    "Momo Belia Deviluke",
                    "Kogitsune",
                    "Shiro Cat",
                    "Amamiya Ren",
                    "Miku With You 2021",
                    "Matou Sakura",
                    "Jeanne Formal Dress",
                    "POP UP PARADE Ayanami Rei",
                    "Sorai Yuuka Cat Ears",
                    "Scathach",
                    "SA MAXIMUM",
                    "Zhaojun Yuhuan",
                    "Japanese Style TechGear",
                    "Tohsaka Rin",
                    "Succubus Black Lulumu",
                    "Eve LOVECALL",
                    "Hatsune Miku 2022 Chinese New Year",
                    "Murakami Suigun Red",
                    "Makise Kurisu",
                    "Okamizukin-chan",
                    "ARTFX J Levi Fortitude",
                    "AN94",
                    "Illyasviel von Einzbern",
                    "J Rin",
                    "Library Stardust",
                    "KDcolle Tokisaki Kurumi Calligraphic Beauty",
                    "Sleeping Beauty",
                    "Gilgamesh",
                    "Yoko",
                    "illya",
                    "Hanekawa 2 Set",
                ];
                const nameElements = document.querySelectorAll("p.newly-added-items__item__name");
                const appropriateResults = [];

                nameElements.forEach((nameElement) => {
                    const name = nameElement.textContent;

                    let isAppropriate = false;

                    figureNames.forEach((figureName) => {
                        const figureIsAppropriate = !!figureName
                            .toLowerCase()
                            .split(" ")
                            .every((nameWord) => name.toLowerCase().replace(/\s/g, "").includes(nameWord));

                        if (figureIsAppropriate) isAppropriate = true;
                    });

                    if (isAppropriate) {
                        const link = nameElement.closest("a").href;

                        const result = {
                            name,
                            link,
                        };

                        appropriateResults.push(result);
                    }
                });

                return appropriateResults;
            });

            pageResults.forEach((result) => {
                const record = `Название: ${result.name}, Страница: ${pageIndex}, Ссылка: ${result.link}`;

                console.log(record);

                fs.appendFileSync(FILE_NAME, record + "\r\n", "utf8");
            });

            pageIndex++;
        }
    } catch (err) {
        console.error(err);
    }

    await browser.close();
})();
