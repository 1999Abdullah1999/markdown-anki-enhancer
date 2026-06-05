## التعديلات على `public/md-anki.html`

### 1) إعادة ترتيب أزرار الشريط العلوي
الترتيب الجديد من اليسار إلى اليمين:
**[Editor | Split | Preview]** … **Save PNG → Copy → Clear → Light → Settings**

(يعني Save PNG في النص بعد مجموعة الأوضاع، وSettings أقصى اليمين كما طلبت.)

### 2) دعم الصيغ الرياضية ($...$ و $$...$$)
السبب الحالي إن `$\uparrow$` و `$Na^+/Cl^-$` بتظهر كنص خام هو إن المعاينة مفيهاش math renderer.

سأضيف **KaTeX** عبر CDN (ملف واحد، يشتغل على GitHub Pages بدون build):
- `katex.min.css` + `katex.min.js` + `auto-render.min.js`
- استدعاء `renderMathInElement(preview)` بعد كل تحديث للمعاينة، مع delimiters:
  - `$...$` inline
  - `$$...$$` display
  - `\(...\)` و `\[...\]`
- تشغيله **قبل** `replaceArrowsInTextNodes` و `applyDirAuto` عشان ما يلمسش الـMathML/SVG اللي طلعها KaTeX (هتتجاهل `.katex` في الـTreeWalker).

نتيجة: `$\uparrow$` → ↑ ، `$\downarrow$` → ↓ ، `$Na^+/Cl^-$` → Na⁺/Cl⁻ بشكل مظبوط، وكذلك `\rightarrow \leftarrow \leftrightarrow \Rightarrow \Leftrightarrow \to` …إلخ.

### 3) اتجاه الأسهم مع العربية/الإنجليزية
المشكلة: في سياق RTL، السهم النصي (→) أو حتى `->` بيتقلب بصرياً بسبب bidi.

الحل:
- الأسهم اللي بيولّدها KaTeX (`\rightarrow` …) هتظهر صح لأنها داخل عنصر LTR معزول.
- الأسهم اللي بنحوّلها من `->`, `=>`, `<->`, `<=>` في `replaceArrowsInTextNodes`:
  - نلفّها في `<span class="arrow" dir="ltr" style="unicode-bidi:isolate">→</span>` بحيث تفضل يمين-لـ-شمال بصرياً حتى لو السياق عربي.
  - نضيف منطق: لو الـblock اللي حواليها اتجاهه RTL، السهم يفضل يشير لنفس الاتجاه المنطقي (→ يبقى "بعدين") — التعزيل بـ`unicode-bidi:isolate` بيحل التذبذب اللي بيخلي السهم يتقلب عشوائي.
- إضافة `→ ← ↔ ⇒ ⇐ ⇔ ↑ ↓` لقائمة الـmappings (بدل `->`, `=>` بس).

### 4) ضمان كل الصيغ مدعومة
هضيف بلوك اختبار صغير مخفي (أو في الـREADME comment) يتأكد إن:
- `$x^2$`, `$\frac{a}{b}$`, `$\uparrow$`, `$\Rightarrow$`, `$Na^+$`, `$$\sum_{i=1}^n i$$`
- `->`, `=>`, `<->`, `<=>`
كلها بتترندر صح في العربي والإنجليزي.

### تفاصيل تقنية
- KaTeX يُحمَّل من `https://cdn.jsdelivr.net/npm/katex@0.16.11/...` (ملف واحد، لا build step).
- إضافة `throwOnError: false` عشان أي LaTeX غلط ما يكسرش المعاينة.
- تحديث `wrapSections()` و `Copy/Save` ما يتأثروش — KaTeX بيطلع HTML عادي، html2canvas هيلتقطه.
- ما هتتغير أي حاجة في الـbackend أو routes، تعديل واحد بس على `public/md-anki.html`.
