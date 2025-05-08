# Sample CSV Data Examples for Seeding

Here are some examples of how you could structure CSV files for seeding your Payload CMS database, based on the `src/seed.ts` script.

**Important Considerations:**

*   **Relationships:** For fields that link to other collections (e.g., a service linking to a tenant), use a unique identifier like a `slug` or an `ID`. Your seeding script will need to resolve these.
*   **Complex Fields:**
    *   **Rich Text (Slate JSON):** CSV is best for plain text. For rich text, you might store simplified Markdown or plain text and have your seeding script convert it, or manage this data outside of CSVs.
    *   **Images/Media:** You can list filenames. Your seeding script would then need to locate these files (e.g., in a specific directory like `seed/images/`), upload them, and then link the resulting media IDs.
    *   **Arrays/Lists:** Use a consistent separator (e.g., semicolon `;`) for multiple values in a single cell, and your script can split them. For arrays of objects, CSV becomes more complex, and you might need separate related CSVs or a different import strategy.
*   **Dates:** Use a consistent format, preferably ISO 8601 (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ`).
*   **Booleans:** Use `TRUE`/`FALSE` or `1`/`0`.
*   **Tenant Context:** Most collections are tenant-specific. Ensure your CSVs include a `tenant_slug` or `tenant_id` column to associate data with the correct tenant.

---

## 1. Tenants (`tenants.csv`)

```csv
name,slug,domain,colors_primary,colors_primaryForeground,colors_secondary,colors_secondaryForeground,colors_accent,colors_accentForeground,colors_background,colors_foreground,typography_headingFont_name,typography_headingFont_weights,typography_headingFont_subsets,typography_bodyFont_name,typography_bodyFont_weights,typography_bodyFont_subsets,radius
"A1 INŠTALACIJE d.o.o.","a1-instalacije","a1-instalacije.si","oklch(0.82 0.1663 83.77)","oklch(0.985 0 0)","oklch(0.32 0.1025 253.89)","oklch(0.98 0.005 0)","oklch(0.77 0.1687 67.36)","oklch(0.205 0 0)","oklch(1 0 0)","oklch(0.145 0 0)","Inter","700","latin","Inter","400","latin","0.625rem"
"B2 Storitve","b2-storitve","b2-storitve.com","oklch(0.7 0.2 90)","oklch(1 0 0)","oklch(0.4 0.15 260)","oklch(0.99 0 0)","oklch(0.6 0.18 70)","oklch(0.1 0 0)","oklch(0.98 0 0)","oklch(0.2 0 0)","Roboto","700;900","latin;latin-ext","Open Sans","400","latin","0.5rem"
```

---

## 2. Users (`users.csv`)

This example focuses on tenant users. Super admins are usually created more directly.

```csv
email,password,firstName,lastName,user_roles,tenant_slug,tenant_member_roles
"info.a1instalacije@gmail.com","gmb-2025","Miralem","Mehanović","user","a1-instalacije","tenant-admin"
"jane.doe@b2-storitve.com","password123","Jane","Doe","user","b2-storitve","editor;contributor"
"john.smith@b2-storitve.com","securepass","John","Smith","user","b2-storitve","tenant-admin"
```
*   `user_roles`: General roles for the user in the system.
*   `tenant_slug`: Slug of the tenant this user belongs to or has permissions for.
*   `tenant_member_roles`: Roles specific to this user within the linked tenant (e.g., `tenant-admin`, `editor`). Use a separator like `;` if a user can have multiple roles within a tenant.

---

## 3. Services (`services.csv`)

```csv
tenant_slug,title,description,features,priceDisplay,image_filenames
"a1-instalacije","Vodoinštalacije","Nudimo celovite rešitve za vodovodne inštalacije, od načrtovanja do izvedbe in vzdrževanja.","Novogradnje;Adaptacije;Popravila","Po dogovoru","gorenje-bojler-vodovodne-napeljave.jpg;talno-ogrevanje-sistem-namestitev.jpg"
"a1-instalacije","Montaža sanitarne opreme","Strokovna montaža tuš kabin, kadi, WC školjk, umivalnikov in ostale sanitarne opreme.","Montaža;Priklop;Svetovanje","Od €150 dalje","kopalnica-umivalnik-wc-pralni-stroj.jpg;kopalnica-prha-črna-armatura.jpg"
"b2-storitve","Web Development","Custom web solutions for your business.","Frontend;Backend;SEO","Contact for quote","web_dev_main.png;web_dev_portfolio.jpg"
```
*   `features`: A list of features, separated by a semicolon.
*   `image_filenames`: A list of image filenames (from your `seed/images` or similar); your script would handle uploading and linking.

---

## 4. Testimonials (`testimonials.csv`)

```csv
tenant_slug,name,testimonialDate,source,location,service_description,content,rating
"a1-instalacije","Ana K.","2024-04-15T00:00:00.000Z","manual","Ljubljana","Adaptacija kopalnice","Zelo zadovoljni s hitrostjo in kvaliteto izvedbe prenove kopalnice. Priporočam!",5
"a1-instalacije","Marko P.","2024-05-01T00:00:00.000Z","google","Domžale","Menjava vodovodnih cevi","Profesionalen odnos in odlično opravljeno delo. Držali so se dogovorjenih rokov.",5
"b2-storitve","Client X","2024-06-10T00:00:00.000Z","website","Online","Web Development","Fantastic service and great results!",5
```
*   `service_description`: Could be the title of a linked service or just a descriptive text.

---

## 5. FAQ Items (`faq-items.csv`)

```csv
tenant_slug,question,category,answer_text
"a1-instalacije","Kakšen je vaš delovni čas?","general","Naš redni delovni čas je od ponedeljka do petka, od 8:00 do 16:00. Za nujne intervencije smo dosegljivi tudi izven delovnega časa."
"a1-instalacije","Na katerem območju opravljate storitve?","general","Storitve opravljamo predvsem na območju osrednje Slovenije, vključno z Ljubljano z okolico, Domžalami, Kamnikom in Kranjem. Za večje projekte se lahko dogovorimo tudi za delo izven tega območja."
"b2-storitve","What is your refund policy?","billing","We offer a 30-day money-back guarantee on most services."
```
*   `answer_text`: Simplified plain text for the answer.

---

Remember to adapt these examples to the exact fields and structures defined in your Payload CMS collections. Your seeding script will be crucial in parsing these CSVs and creating the corresponding entries in your database. 