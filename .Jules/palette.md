## 2024-05-18 - Missing ARIA Labels on Mobile Nav
**Learning:** The mobile hamburger menu button lacks ARIA attributes, meaning screen reader users wouldn't know its state or purpose.
**Action:** Add `aria-label`, `aria-expanded`, and `aria-hidden` to icon-only toggle buttons.
## 2024-05-18 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Icon-only buttons (like image gallery prev/next, social share buttons) lack ARIA labels, making them inaccessible to screen readers.
**Action:** Add `aria-label` to icon-only buttons to clearly state their purpose.
