# MemoClarity UI Guidelines (Draft)

> Este documento serve como referência inicial para manter consistência visual e estrutural nas telas do MemoClarity. O foco é padronizar containers, tipografia, cores, espaçamento e componentes base. O refinamento de UI/UX será feito posteriormente.

## Estrutura Base
- Container centralizado: `max-w-2xl mx-auto w-full px-4 py-6`
- Espaçamento vertical entre seções: `mb-6` ou `space-y-6`
- Responsividade: mobile first, depois desktop

## Tipografia
- Títulos: `font-sans font-bold text-2xl sm:text-3xl text-teal-900`
- Subtítulos: `font-sans font-semibold text-lg text-gray-700`
- Texto corpo: `font-sans text-base text-gray-600`
- Pequeno: `text-sm text-gray-500`

## Paleta de Cores
- Fundo principal: `bg-gray-50` ou `bg-white/80 backdrop-blur`
- Cores da marca: Teal (`#0B4F6C`), Gold (`#FCA311`), Coral (`#FF6F61`), Aqua (`#A7D9D3`)
- Botões principais: `bg-teal-600 text-white`, hover `bg-teal-700`
- Botões secundários: `bg-yellow-500 text-white`, hover `bg-yellow-600`

## Bordas, Sombras e Efeitos
- Bordas arredondadas: `rounded-xl` ou `rounded-3xl`
- Sombra leve: `shadow-lg` ou `shadow-xl`
- Glassmorphism: `bg-white/80 backdrop-blur` para cards principais

## Logo e Ícones
- Sempre usar a logo oficial em destaque no topo ou cards principais
- Ícones SVG minimalistas, alinhados à paleta

## Botões e Inputs
- Botões: `px-6 py-3 rounded-xl font-semibold shadow transition-colors`
- Inputs: `rounded-xl px-4 py-3 border focus:ring-2`

## Exemplo de Card Padrão
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
