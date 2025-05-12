import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';
import { createImageAltMap } from '../utils'; // Import the new helper
import path from 'path'; // Ensure path is imported
import fs from 'fs/promises'; // Ensure fs/promises is imported

// Define a more specific return type if needed, e.g., { [key: string]: number | undefined }
export const seedMedia = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq'>): Promise<{ seededImageIds: { [key: string]: number } }> => {
  const { payload, tenantA1, simulatedReq } = args;
  payload.logger.info('--- Seeding Media (Images) ---');

  const imageMetadata = [
    {
        "filename": "nagrada-a1-instalacije-doo.jpg",
        "alt_text": "Lesena nagrada z napisom PRIMERJAM.si, IZBIRA STRANK 2022 in A1 INŠTALACIJE d.o.o. ter oceno 5.0 s petimi zvezdicami. Nagrada je postavljena na armaturni plošči avtomobila."
    },
    {
        "filename": "polaganje-keramike-laser-nivelir.jpg",
        "alt_text": "Polaganje keramičnih ploščic v prostoru s pomočjo laserskega nivelirja. Ploščice so položene in fiksirane s plastičnimi distančniki."
    },
    {
        "filename": "kopalnica-prenova-ploščice-okno.jpg",
        "alt_text": "Kopalnica v prenovi s svetlimi ploščicami in oknom. Na tleh je položen parket."
    },
    {
        "filename": "polaganje-keramike-kopalnica-prenova.jpg",
        "alt_text": "Fotografija prikazuje polaganje keramičnih ploščic v kopalnici med prenovo. Ploščice so svetle s pisanimi vzorci, modri distančniki pa zagotavljajo enakomerne fuge."
    },
    {
        "filename": "polaganje-keramike-v-kopalnici.jpg",
        "alt_text": "Fotografija prikazuje polaganje keramičnih ploščic v kopalnici. Vidni so tudi orodje in naprave za polaganje ploščic."
    },
    {
        "filename": "notranjost-sobe-s-pečjo-televizorjem.jpg",
        "alt_text": "Notranjost sobe prikazuje peč iz rdečih opek, televizor na steni in leseno oblogo na stropu. V ozadju je stena z vzorcem cvetja in vrata."
    },
    {
        "filename": "hiša-terasa-zunanje-ureditve.jpg",
        "alt_text": "Zunanja terasa hiše s tlakovci in leseno nadstrešnico. Na vrtu je vidna trava in cvetje."
    },
    {
        "filename": "talno-ogrevanje-sistem-namestitev.jpg",
        "alt_text": "Talno ogrevanje je nameščeno v sobi, s črnimi ploščicami in belimi cevmi. Sistem je pripravljen za pokrivanje s talno oblogo."
    },
    {
        "filename": "kopalnica-prenova-polaganje-ploščic.jpg",
        "alt_text": "Kopalnica v fazi prenove s sveže položenimi keramičnimi ploščicami na stenah in lesenimi talnimi oblogami. Vidni so tudi elementi za sanitarno opremo in okno."
    },
    {
        "filename": "soba-keramika-stena-elektrika.jpg",
        "alt_text": "Prazna soba s keramičnimi ploščicami na tleh in belimi stenami. Na steni je električna vtičnica."
    },
    {
        "filename": "hiša-terasa-dvorišče-zunanjost.jpg",
        "alt_text": "Zunanji pogled na hišo s tlakovano teraso in zelenico. Na terasi so vidni ostanki gradbenih del."
    },
    {
        "filename": "kopalnica-s-keramicnimi-ploscicami.jpg",
        "alt_text": "Kopalnica s keramičnimi ploščicami in lesenim podom. Viden je tudi okenski okvir in priključki za sanitarno opremo."
    },
    {
        "filename": "kopalnica-umivalnik-wc-pralni-stroj.jpg",
        "alt_text": "Notranjost kopalnice s sodobnim umivalnikom, straniščem, pralnim strojem Samsung in tuš kabino. Na pultu pralnega stroja je čistilo Tandil."
    },
    {
        "filename": "bathroom-tiles-plumbing-fixtures.jpg",
        "alt_text": "A newly tiled bathroom features neutral-toned wall and floor tiles, with plumbing fixtures visible on the wall. A white bucket sits on the floor."
    },
    {
        "filename": "gorenje-bojler-vodovodne-napeljave.jpg",
        "alt_text": "Bojler Gorenje je nameščen na steni s priključenimi vodovodnimi napeljavami. Na polici pod njim sta orodje in posoda."
    },
    {
        "filename": "talno-ogrevanje-modra-izolacija.jpg",
        "alt_text": "Talno ogrevanje je nameščeno na modri izolaciji. Bele cevi za talno ogrevanje so položene v vzorcu na modri izolaciji."
    },
    {
        "filename": "kopalnica-prha-črna-armatura.jpg",
        "alt_text": "Sodobna kopalnica s črno prho in armaturo. Prha ima steklena vrata s črnim okvirjem."
    },
    {
        "filename": "kopalnica-ploščice-stene-prenova.jpg",
        "alt_text": "Notranjost kopalnice s svetlimi keramičnimi ploščicami na stenah. Prikazuje del prenove kopalnice z nameščenimi ploščicami in pripravami za sanitarno opremo."
    },
    {
        "filename": "nova-lesen-tlakovanje-notranjost.jpg",
        "alt_text": "Nova lesena talna obloga v notranjosti z nedokončanimi stenami. Tlakovanje je svetlo rjave barve in ima videz lesa."
    },
    {
        "filename": "polaganje-keramike-renoviranje-kopalnice.jpg",
        "alt_text": "Fotografija prikazuje polaganje keramičnih ploščic v kopalnici med prenovo. Ploščice so pritrjene s križci za enakomerne fuge."
    },
    {
        "filename": "tiles-installation-bathroom-wall.jpg",
        "alt_text": "Stena polnjena s keramičnimi ploščicami z uporabo izravnalnega sistema. Vidni so tudi vodovodne cevi in škatla za vgradnjo."
    },
    {
        "filename": "polaganje-keramike-izravnalni-sistem.jpg",
        "alt_text": "Prikazano je polaganje keramičnih ploščic z uporabo izravnalnega sistema. Modri distančniki zagotavljajo enakomerne fuge med ploščicami."
    },
    {
        "filename": "vodovodne-instalacije-a1-mehanovic.jpg",
        "alt_text": "Oglas za vodovodne instalacije A1 instalacije d.o.o. z Miralemom Mehanovicem, ki ponuja storitve na področju vode, gretja, elektrike, keramike in adaptacije kopalnic."
    },
    {
        "filename": "soba-keramika-opeka-notranjost.jpg",
        "alt_text": "Soba s keramičnimi ploščicami na tleh in pečjo iz opeke v kotu. Na peči je steklenica čistila."
    },
    {
        "filename": "kuhinja-sodobna-notranjost-okno.jpg",
        "alt_text": "Sodobna kuhinja z oknom, ki gleda na balkon. Kuhinja ima črne elemente in leseno pult."
    },
    {
        "filename": "kopalnica-stenske-ploščice-vtičnica.jpg",
        "alt_text": "Stena v kopalnici je obložena s svetlimi keramičnimi ploščicami. Na steni je nameščena vtičnica in priključki za vodo."
    },
    {
        "filename": "kopalnica-prenova-ploščice-stran.jpg",
        "alt_text": "Kopalnica v prenovi s sveže položenimi belimi ploščicami in modrimi distančniki. V ozadju je stranišče in modra stena."
    },
    {
        "filename": "notranjost-sobe-s-pečjo.jpg",
        "alt_text": "Notranjost sobe s keramičnimi tlemi, pečjo iz opečneatih ploščic in lesenimi vrati. Stena je okrašena z zelenim vzorcem."
    },
    {
        "filename": "bathroom-toilet-water-heater.jpg",
        "alt_text": "A bathroom features a wall-mounted toilet, a white water heater, and beige tile walls. A small shelf is built into the wall above the toilet."
    },
    {
        "filename": "soba-s-plo-icami-okno.jpg",
        "alt_text": "Prazen prostor s ploščicami in oknom, ki gleda na zunanjo teraso. Ploščice so svetlo sive barve in so položene v vzorcu opeke."
    },
    {
        "filename": "talno-ogrevanje-razdelilnik-cevi.jpg",
        "alt_text": "Slika prikazuje razdelilnik talnega ogrevanja s priključenimi belimi cevmi, nameščenimi na modri izolaciji. Na tleh so tudi orodja za montažo."
    },
    {
        "filename": "kuhinja-sodobna-črna-bela.jpg",
        "alt_text": "Sodobna kuhinja z belimi zgornjimi omaricami in črnimi spodnjimi omaricami ter lesenim pultom. V ospredju je lesena talna obloga."
    },
    {
        "filename": "nedokončana-kopalnica-prenova-notranjost.jpg",
        "alt_text": "Nedokončana kopalnica s keramičnimi ploščicami in lesenimi tlemi. Vidi se odprtina za vrata in napeljave na steni."
    },
    {
        "filename": "vtičnice-stenske-pipe-kopalnica.jpg",
        "alt_text": "Dve vtičnici na steni v kopalnici, pod njima pa so nameščene stenske pipe. Stena je obložena s svetlimi keramičnimi ploščicami."
    },
    {
        "filename": "kopalnica-talne-ploščice-odtok.jpg",
        "alt_text": "Pogled od zgoraj na talne ploščice v kopalnici z odtokom in delom steklene tuš kabine. Ploščice so bele z marmornatim vzorcem."
    }
  ];

  const imageAltMap = createImageAltMap(imageMetadata);
  const seededImageIds: { [key: string]: number } = {};

  try {
    const imagesDir = path.resolve(process.cwd(), 'seed/images');
    payload.logger.info(`Resolved image directory path for media seeding: ${imagesDir}`);
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

    for (const filename of imageFiles) {
      const altText = imageAltMap.get(filename);
      if (!altText) {
        payload.logger.warn(`Alt text not found for image: ${filename}, skipping.`);
        continue;
      }

      const filePath = path.join(imagesDir, filename);
      payload.logger.info(`Attempting to create Media for: ${filename}`);

      try {
        const mediaDoc = await payload.create({
          collection: 'media',
          filePath: filePath,
          data: {
            tenant: tenantA1.id,
            alt: altText,
          },
          req: simulatedReq,
        });
        payload.logger.info(`Created Media: ${filename} with ID: ${mediaDoc.id}`);
        if (mediaDoc.id) { // Ensure mediaDoc.id is valid before assigning
          seededImageIds[filename] = mediaDoc.id;
        }
      } catch (mediaErr) {
        payload.logger.error(`Error creating Media for ${filename}:`, mediaErr);
      }
    }
    payload.logger.info('Media seeding process completed.');

  } catch (err) {
    payload.logger.error('Error reading image directory or during media seeding process:', err);
    if (err instanceof Error) {
      payload.logger.error('Stack trace:', err.stack);
    } else {
      payload.logger.error('Full error object:', err);
    }
  }
  return { seededImageIds };
}; 