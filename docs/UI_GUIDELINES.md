# MemoClarity UI Guidelines (Draft)

> This document serves as an initial reference to maintain visual and structural consistency across MemoClarity screens. The focus is to standardize containers, typography, colors, spacing, and base components. UI/UX refinement will be done later.

## Base Structure
- Centered container: `max-w-2xl mx-auto w-full px-4 py-6`
- Vertical spacing between sections: `mb-6` or `space-y-6`
- Responsiveness: mobile first, then desktop

## Typography
- Titles: `font-sans font-bold text-2xl sm:text-3xl text-teal-900`
- Subtitles: `font-sans font-semibold text-lg text-gray-700`
- Body text: `font-sans text-base text-gray-600`
- Small: `text-sm text-gray-500`

## Color Palette
- Main background: `bg-gray-50` or `bg-white/80 backdrop-blur`
- Brand colors: Teal (`#0B4F6C`), Gold (`#FCA311`), Coral (`#FF6F61`), Aqua (`#A7D9D3`)
- Primary buttons: `bg-teal-600 text-white`, hover `bg-teal-700`
- Secondary buttons: `bg-yellow-500 text-white`, hover `bg-yellow-600`

## Borders, Shadows, and Effects
- Rounded borders: `rounded-xl` or `rounded-3xl`
- Light shadow: `shadow-lg` or `shadow-xl`
- Glassmorphism: `bg-white/80 backdrop-blur` for main cards

## Logo and Icons
- Always use the official logo highlighted at the top or main cards
- Minimalist SVG icons, aligned to the palette

## Buttons and Inputs
- Buttons: `px-6 py-3 rounded-xl font-semibold shadow transition-colors`
- Inputs: `rounded-xl px-4 py-3 border focus:ring-2`

## Example of Standard Card
```jsx
<section className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between mb-6">
  <div className="flex items-center gap-4">
    <img src={LogoParaQualquerFundo} alt="Logo" className="w-14 h-14 rounded-2xl" />
    <div>
      <h2 className="text-xl font-bold text-teal-900 mb-1 font-sans">Título</h2>
      <p className="text-gray-600 text-sm">Descrição do card.</p>
    </div>
  </div>
  <button className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition-colors text-base font-sans">Ação</button>
</section>
```

---

> Este guia será refinado conforme evoluirmos o design e a experiência do usuário.
