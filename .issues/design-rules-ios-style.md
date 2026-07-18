# ComHub Design Rules — iOS-Inspired Style Guide

**Version:** 1.0.0  
**Last Updated:** 2026-07-16  
**Status:** Active — All frontend pages MUST follow these rules

---

## 1. Design Philosophy

**Core Principle:** iOS-inspired, friendly yet professional  
- Clean, minimal, and approachable like Apple's design language
- Premium feel with soft, layered depth instead of harsh borders
- Friendly but not playful — professional but not corporate
- Every component should feel like a shipped product, not a prototype

---

## 2. Color System — iOS Semantic Colors

### Light Mode (Default)
```css
--bg-primary:    #F2F2F7;  /* systemGroupedBackground */
--bg-surface:    #FFFFFF;  /* systemBackground */
--bg-secondary:  #F2F2F7;  /* secondarySystemGroupedBackground */
--bg-tertiary:   #E5E5EA;  /* tertiarySystemGroupedBackground */

--border:        rgba(60, 60, 67, 0.12);  /* separator */
--border-strong: rgba(60, 60, 67, 0.29);  /* opaqueSeparator */

--text-primary:   #000000;
--text-secondary: rgba(60, 60, 67, 0.60);  /* secondaryLabel */
--text-tertiary:  rgba(60, 60, 67, 0.30);  /* tertiaryLabel */

--blue:   #007AFF;  /* iOS system blue */
--green:  #34C759;
--red:    #FF3B30;
--orange: #FF9500;
--indigo: #5856D6;
```

### Dark Mode
```css
--bg-primary:    #000000;   /* systemGroupedBackground dark */
--bg-surface:    #1C1C1E;   /* systemBackground dark */
--bg-secondary:  #2C2C2E;
--bg-tertiary:   #3A3A3C;

--border:        rgba(84, 84, 88, 0.65);
--border-strong: rgba(84, 84, 88, 0.85);

--text-primary:   #FFFFFF;
--text-secondary: rgba(235, 235, 245, 0.60);
--text-tertiary:  rgba(235, 235, 245, 0.30);

--blue:   #0A84FF;  /* iOS blue dark */
--green:  #30D158;
--red:    #FF453A;
--orange: #FF9F0A;
```

**CRITICAL RULE:**  
🚫 **PURPLE BAN** — ห้ามใช้สีม่วง/ไวโอเล็ต (`#7C3AED`, `#8B5CF6`, `#A855F7`) เด็ดขาด

---

## 3. Typography System

### Font Families
- **Display/Heading:** `"Plus Jakarta Sans"` — rounded, friendly, ใกล้เคียง SF Pro Rounded
- **Body/UI Text:** `-apple-system, BlinkMacSystemFont, "Noto Sans Thai", sans-serif`
- **Monospace (numbers/prices):** `"SF Mono", "JetBrains Mono", monospace`

### Font Import
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
```

### Type Scale (Tailwind conventions)
- Heading 1: `text-3xl` / `text-4xl` (32px/36px), font-bold
- Heading 2: `text-2xl` (24px), font-semibold
- Heading 3: `text-xl` (20px), font-semibold
- Body: `text-base` (16px), font-normal
- Small: `text-sm` (14px), font-normal
- Caption: `text-xs` (12px), font-medium

**Weight Rules:**
- ใช้ `font-semibold` (600) สำหรับ CTA buttons — ไม่ใช้ `font-extrabold`
- ใช้ `font-medium` (500) สำหรับ labels
- ใช้ `font-normal` (400) สำหรับ body text

---

## 4. Component Patterns — iOS Grouped List Style

### Cards
**ก่อน (generic):**
```jsx
<div className="bg-app-surface border border-app-border rounded-2xl p-6">
```

**หลัง (iOS style):**
```jsx
{/* Section Header */}
<p className="text-xs font-semibold text-secondary uppercase tracking-wider px-4 mb-1">
  SECTION TITLE
</p>

{/* Grouped Card — no border, shadow only */}
<div className="bg-surface rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
  {/* Row with internal separator */}
  <div className="px-4 py-3 flex items-center border-b border-[rgba(60,60,67,0.12)] last:border-0">
    ...
  </div>
</div>
```

**Key Principle:** iOS ใช้ **shadow แทน border** บน card, separator อยู่ **ข้างใน** ไม่ใช่รอบนอก

### Buttons

#### Primary CTA
```jsx
<button className="bg-[#007AFF] hover:bg-[#0051D5] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
  เริ่มสร้างเครื่อง
</button>
```

#### Secondary
```jsx
<button className="bg-secondary hover:bg-tertiary text-primary font-medium px-6 py-3 rounded-xl transition-colors">
  ดูแค็ตตาล็อก
</button>
```

#### Destructive
```jsx
<button className="bg-[#FF3B30] hover:bg-[#D70015] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
  ลบ
</button>
```

### Tags/Chips
```jsx
<span className="inline-flex items-center gap-1 bg-blue/10 text-blue text-xs font-medium px-3 py-1 rounded-full">
  Most Popular
</span>
```

### Modal/Sheet
- ใช้ bottom sheet style: `rounded-t-3xl`
- มี handle bar ด้านบน: `w-10 h-1 bg-tertiary rounded-full mx-auto mb-4`
- backdrop: `bg-black/40 backdrop-blur-sm`

---

## 5. Layout & Spacing

### Spacing Scale (multiples of 4)
- `4px` — gap-1
- `8px` — gap-2
- `12px` — gap-3
- `16px` — gap-4
- `20px` — gap-5
- `24px` — gap-6

### Border Radius
- **Inner items:** `12px` — `rounded-xl`
- **Cards:** `16px` — `rounded-2xl`
- **Panels/Modals:** `20px` — `rounded-3xl`
- **Pills/Chips:** `999px` — `rounded-full`

### Container Widths
- Desktop: `max-w-7xl` (1280px)
- Tablet: `max-w-4xl` (896px)
- Mobile: `max-w-full` with `px-4` padding

---

## 6. Glassmorphism — Navbar/Header

```css
.ios-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(60, 60, 67, 0.12);
}

.dark .ios-glass {
  background: rgba(28, 28, 30, 0.72);
}
```

**Apply to:**
- Top navigation bar (sticky)
- Floating panels
- Dropdown menus

---

## 7. Responsive Behavior

### Breakpoints (Tailwind defaults)
```
sm:  640px   — Mobile landscape
md:  768px   — Tablet portrait
lg:  1024px  — Tablet landscape / Small desktop
xl:  1280px  — Desktop
2xl: 1536px  — Large desktop
```

### Layout Rules
- **Desktop (lg+):** Multi-column layouts (3-column PC Builder)
- **Tablet (md-lg):** 2-column or stacked with side panels
- **Mobile (<md):** Single column, full-width cards

### Touch Targets
- Minimum tap area: `44x44px` (iOS guideline)
- Button padding: `py-3 px-6` minimum
- Icon buttons: `p-3` (48x48px hit area)

---

## 8. Theme System

### Implementation
```jsx
// Detect and apply theme
const [theme, setTheme] = useState(
  localStorage.getItem('theme') || 'light'
);

useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Theme Toggle UI
- Capsule toggle switch (ไม่ใช่ checkbox)
- Icon: Sun (light) / Moon (dark)
- ตำแหน่ง: Settings dropdown ขวาบน header

**RULE:** ทุกหน้าต้องรองรับทั้ง Light และ Dark mode โดยอัตโนมัติ

---

## 9. Internationalization (i18n)

### Supported Languages
- **Thai (th)** — Default
- **English (en)**

### Language Switcher UI
- Capsule toggle: `TH` / `EN`
- ตำแหน่ง: Settings dropdown ขวาบน header (เดียวกับ theme toggle)

### Implementation
```jsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();
  
  return (
    <h1>{t('landing.title')}</h1>
  );
}
```

**RULE:** ทุกหน้าต้องใช้ `t()` สำหรับ text ทั้งหมด — ห้ามฮาร์ดโค้ดข้อความ

---

## 10. Accessibility (a11y)

### Requirements
- Color contrast ratio: minimum **4.5:1** for body text, **3:1** for large text
- All interactive elements: keyboard accessible (`tab` navigation)
- Focus states: visible outline `focus:ring-2 focus:ring-blue focus:ring-offset-2`
- Alt text: required for all images
- ARIA labels: required for icon-only buttons

### Example
```jsx
<button 
  aria-label="เพิ่มในตะกร้า"
  className="focus:ring-2 focus:ring-blue focus:ring-offset-2"
>
  <ShoppingCart className="w-5 h-5" />
</button>
```

---

## 11. Animation & Motion

### Principles
- Subtle, not distracting
- Duration: `150-300ms` for most transitions
- Easing: `ease-out` for entrances, `ease-in` for exits

### Common Patterns
```css
/* Hover lift */
.card {
  transition: transform 150ms ease-out;
}
.card:hover {
  transform: translateY(-2px);
}

/* Fade in */
.fade-in {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale pop */
.pop {
  animation: scaleIn 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 12. Icon System

**Library:** Lucide React (คล้าย SF Symbols)

### Usage
```jsx
import { ShoppingCart, Heart, Settings } from 'lucide-react';

<ShoppingCart className="w-5 h-5 text-blue" />
```

### Size Scale
- Small: `w-4 h-4` (16px)
- Default: `w-5 h-5` (20px)
- Medium: `w-6 h-6` (24px)
- Large: `w-8 h-8` (32px)

---

## 13. Implementation Checklist

**Every page MUST:**
- [ ] Use iOS color variables (no hardcoded colors except system colors)
- [ ] Support both Light and Dark themes
- [ ] Support Thai and English languages via `t()`
- [ ] Be fully responsive (mobile/tablet/desktop)
- [ ] Use Plus Jakarta Sans for headings
- [ ] Use shadow-based cards (no borders on card edges)
- [ ] Have minimum 44x44px touch targets
- [ ] Pass 4.5:1 contrast ratio
- [ ] Have keyboard focus states
- [ ] Use rounded-xl (12px) or larger radii
- [ ] NO PURPLE/VIOLET colors anywhere

---

## 14. File References

**Color definitions:** [FrontEnd/src/index.css](../FrontEnd/src/index.css)  
**Component examples:** [FrontEnd/src/pages/PCBuilder/PCBuilder.jsx](../FrontEnd/src/pages/PCBuilder/PCBuilder.jsx)  
**i18n config:** [FrontEnd/src/i18n.js](../FrontEnd/src/i18n.js)

---

## 15. Design Resources

**Figma:** [ComHub Design](https://www.figma.com/design/zf5S2YxamVRHNaeoE1J54j/Untitled?node-id=0-1)  
**Inspiration:** Apple Human Interface Guidelines (HIG) — iOS/iPadOS section

---

**END OF DESIGN RULES**
