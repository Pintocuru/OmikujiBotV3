# OmikujiBot Editor

Last updated: <% tp.date.now('YYYY/MM/DD') %>

![intro_11](../../template/en/intro/intro_11.md) an application for editing the data of the generator BOT "OmikujiBot".

![intro_12](../../template/en/intro/intro_12.md) the "OmikujiBot Editor" bundled with the packages below.

![OmikujiBotPackageBOOTH](../../template/en/_common/OmikujiBotPackageBOOTH.md)

![intro_22_IntroOneComme](../../template/en/intro/intro_22_IntroOneComme.md)

## What is this app? (Features)

![](../../images/ConfigEditor-1792763358075.webp)

### A dedicated editor that lets you set up OmikujiBot your way

"OmikujiBot Editor" is an editor dedicated to [OmikujiBot](/core/OmikujiBot/README.md). You can intuitively customize the omikuji content and effects.

1. **Freely set omikuji probabilities and restrictions**
   - Freely change omikuji content and the timing of effects
   - Appearance probabilities are also freely adjustable, even down to pachislot-style 1/65536
   - Freely set trigger conditions such as "members only" or "gifts"
   - Limit how many times someone can draw (e.g., once a day, spam limits)
2. **"Placeholder" feature supporting a wide variety of omikuji results**
   - From simple setups using draw weights to advanced omikuji using placeholders
   - Easily create complex omikuji with over 1,000 variations
   - "Text mode" in placeholder settings makes entering large amounts of data easy
3. **Change speech bubble colors and styles**
   - Check bubble color and animation changes right inside the editor
4. **Characters, from simple to lively**
   - You can use character images, including your own images!
   - You can change the read-aloud voice for each character
5. **Use the editor plugin to make things even easier**
   - With the plugin, you can manage multiple sets of data

## Installation

### [1. Upgrading OmikujiBot / Newly installing OmikujiBot Editor](../../template/en/installation/Installation_52_VersionUp.md)

- OmikujiBot Editor comes with some OmikujiBot packages.
- Even if it isn't included, you can install OmikujiBot Editor for free.

## Usage

![](../../images/ConfigEditor-1792763482877.webp)

Details on how to set up omikuji data are written in the editor itself. It is still under development and has a wide range of features, so we do not document everything in this README.

**Basic tips**:

- When you open the editor, tooltips and descriptions are shown for each item
- The settings are designed to be intuitive to operate

### [Important] How to Save Your Settings

- By installing the OmikujiBot Plugin, you can save your work midway. It's free!
- For how to install it, see the [OmikujiBot Plugin README](/core/EditorPlugin/README.md).

If you don't install the OmikujiBot Plugin, OmikujiBot Editor cannot save midway. Your content disappears if you close or reload the page, so please save carefully.

**How to apply your changes**

1. Press the "Export Settings (js)" button, and the browser saves a file named "omikujiData.js".
2. Overwrite the "omikujiData.js" in the same folder as OmikujiBot Editor with the downloaded one.

![faq_91_OmikujiBotSet](../../template/en/faq/faq_91_OmikujiBotSet.md)

### Editor-related

#### Q. How do I change the editor's colors?

A. (TODO:ここを書く)

#### Q. Can I undo?

A. There is no Undo feature. Please save frequently.

#### Q. Can I share the data I created with others?

A. Redistributing the distributed data as-is is prohibited. JSON data that you have edited and to which you have added elements not in the distributed data may be distributable. For details, please read the Readme.

#### Q. Can I open files created with data older than the latest version?

- Files from the latest v2 can be opened, but some data has changed, so please fix them.
- Data older than that is not compatible and cannot be loaded.

## Troubleshooting

### Q. I entered data, but it isn't reflected in the generator

- This OmikujiBot Editor does not auto-save.
- You need to save by pressing the save button and overwriting the exported file.
  - For details, see "[Important] How to Save Your Settings" under Usage.
- Using the dedicated OmikujiBot Plugin together greatly simplifies saving.

## Credits / License

### Design and Coloring

- TailwindCSS <https://tailwindcss.com/> - MIT License
- DaisyUI <https://daisyui.com/> - MIT License

### UI Icons

- Lucide Icons <https://lucide.dev/> - MIT License

### Preview Icons

- DiceBear <https://www.dicebear.com/>
  - [Thumbs](https://www.dicebear.com/styles/thumbs/) - CC0 1.0
  - [Avataaars](https://www.dicebear.com/styles/avataaars/) - "Free for personal and commercial use"
  - [Bottts](https://www.dicebear.com/styles/bottts/) - "Free for personal and commercial use"
  - [Lorelei](https://www.dicebear.com/styles/lorelei/) - CC0 1.0
  - [Notionists](https://www.dicebear.com/styles/notionists/) - CC0 1.0
  - [Open Peeps](https://www.dicebear.com/styles/open-peeps/) - CC0 1.0
  - [Pixel Art](https://www.dicebear.com/styles/pixel-art/) - CC0 1.0

### Dialogs

- SweetAlert2 <https://sweetalert2.github.io/> - MIT License

![license_91_AppLicense](../../template/en/license/license_91_AppLicense.md)

## Version Information

> For the detailed change history, see [Releases](https://github.com/Pintocuru/OmikujiBot-Docs/releases).

![credits_99_sesupin](../../template/en/credits/credits_99_sesupin.md)

<%* await tp.user.expandEmbeds(tp) %>
