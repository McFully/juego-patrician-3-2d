# UI Atoms

This document details the foundational UI components (Atoms) used throughout the Hanseatic Strategos project. These components are designed to be highly reusable, type-safe, and consistent with the project's visual identity.

## Button (`src/components/ui/Button.tsx`)

A versatile button component with multiple variants and sizes.

### Props
- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'` (Default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (Default: `'md'`)
- `loading`: `boolean` - Shows a spinner and disables the button.
- `icon`: `React.ReactNode` - Optional icon to display.
- `iconPosition`: `'left' | 'right'` (Default: `'left'`)
- `fullWidth`: `boolean` - Takes up the full width of the container.
- `...props`: Standard `ButtonHTMLAttributes<HTMLButtonElement>`.

### Styling Logic (Tailwind)
- **Base**: `inline-flex items-center justify-center font-label-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed`
- **Variants**:
  - `primary`: `bg-tertiary text-on-tertiary hover:scale-[1.02] active:scale-[0.98] focus:ring-tertiary-fixed`
  - `secondary`: `bg-transparent border-2 border-on-surface/30 text-on-surface hover:bg-on-surface/10 active:scale-[0.98] focus:ring-tertiary`
  - `ghost`: `bg-transparent text-on-surface-variant hover:bg-surface-variant/30 hover:text-tertiary focus:ring-tertiary`
  - `danger`: `bg-error-container text-on-error-container border border-error hover:scale-[1.02] active:scale-[0.98] focus:ring-error`
- **Sizes**:
  - `sm`: `px-sm py-xs text-xs`
  - `md`: `px-md py-sm`
  - `lg`: `px-lg py-md text-body-md`

---

## Card (`src/components/ui/Card.tsx`)

A container component with different glassmorphism effects.

### Props
- `variant`: `'base' | 'hover' | 'modal' | 'panel'` (Default: `'base'`)
- `padding`: `'none' | 'sm' | 'md' | 'lg'` (Default: `'md'`)
- `...props`: Standard `HTMLAttributes<HTMLDivElement>`.

### Sub-components
- `CardHeader`: Wrapper for the card's header area.
- `CardTitle`: Styled heading for the card.
- `CardContent`: Wrapper for the main content area.

### Styling Logic (Tailwind)
- **Base**: `rounded-xl`
- **Variants**:
  - `base`: `glass-base border border-on-surface/10`
  - `hover`: `glass-base border border-on-surface/10 hover:border-tertiary/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300`
  - `modal`: `glass-modal`
  - `panel`: `glass-panel`
- **Padding**:
  - `none`: `0`
  - `sm`: `p-sm` (8px)
  - `md`: `p-md` (16px)
  - `lg`: `p-lg` (24px)

---

## Input (`src/components/ui/Input.tsx`)

A controlled/uncontrolled text input with labels, icons, and error states.

### Props
- `label`: `string` - Label text.
- `error`: `string` - Error message (triggers error styling).
- `helperText`: `string` - Additional guidance text.
- `prefix`: `React.ReactNode` - Icon or text at the start.
- `suffix`: `React.ReactNode` - Icon or text at the end.
- `value`, `onChange`, `type`, `min`, `max`, `placeholder`, `id`, `className`: Standard input attributes.

### Styling Logic (Tailwind)
- **Container**: `w-full`
- **Label**: `font-label-sm text-label-sm text-on-surface-variant block mb-base`
- **Input**: `w-full bg-primary-container border rounded-lg px-sm py-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all duration-200`
- **States**:
  - Error: `border-error focus:border-error focus:ring-error`
  - Default: `border-on-surface/20`
- **Icon Padding**: `pl-10` (if prefix), `pr-10` (if suffix).

---

## Modal (`src/components/ui/Modal.tsx`)

A portal-based dialog component with backdrop and animations.

### Props
- `isOpen`: `boolean` (Required)
- `onClose`: `() => void` (Required)
- `title`: `string` - Header title.
- `children`: `ReactNode` - Content.
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'` (Default: `'md'`)
- `showCloseButton`: `boolean` (Default: `true`)
- `closeOnOverlayClick`: `boolean` (Default: `true`)
- `closeOnEscape`: `boolean` (Default: `true`)

### State & Logic
- Uses `useEffect` to handle "Escape" key and disable body scroll when open.
- Uses `createPortal` to render into `document.body`.

### Styling Logic (Tailwind)
- **Overlay**: `fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-sm`
- **Container**: `w-full glass-modal rounded-xl overflow-hidden`
- **Sizes**:
  - `sm`: `max-w-md`
  - `md`: `max-w-lg`
  - `lg`: `max-w-2xl`
  - `xl`: `max-w-4xl`
  - `full`: `max-w-[90vw]`
- **Content Area**: `p-md max-h-[70vh] overflow-y-auto`
