# UI Components Library

YouTube-inspired design system with React 19 + TypeScript + TailwindCSS 4.x

## Design System

### Colors
- **Primary**: #FF0000 (YouTube Red)
- **Primary Dark**: #CC0000
- **Background**: #F8FAFC (Slate-50)
- **Surface**: #FFFFFF

### Typography
- **Sans**: Pretendard
- **Mono**: Roboto Mono

## Components

### Button

Button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button variant="primary">Click me</Button>

// With loading state
<Button variant="primary" isLoading>Loading...</Button>

// With icons
<Button
  variant="primary"
  leftIcon={<IconComponent />}
>
  Add Item
</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `disabled`: boolean

---

### Input

Input component with label, validation, and icon support.

```tsx
import { Input } from '@/components/ui';

// With label
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// With validation error
<Input
  label="Username"
  error="Username is required"
/>

// With helper text
<Input
  label="Password"
  helperText="Must be at least 8 characters"
/>

// With icons
<Input
  prefixIcon={<SearchIcon />}
  placeholder="Search..."
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `prefixIcon`: ReactNode
- `suffixIcon`: ReactNode
- All standard input attributes

---

### Card

Card component with composition pattern.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

// Full composition
<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardBody>
    <p>Content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Minimal usage
<Card>
  <CardBody>
    Simple content
  </CardBody>
</Card>
```

**Sub-components:**
- `Card`: Main container
- `CardHeader`: Header section
- `CardBody`: Content section
- `CardFooter`: Footer section

---

### Badge

Badge component for status indicators.

```tsx
import { Badge } from '@/components/ui';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md'

---

### Tab

Tab component with keyboard navigation.

```tsx
import { TabList, Tabs, TabItem, TabPanel } from '@/components/ui';

<TabList defaultValue="tab1">
  <Tabs>
    <TabItem value="tab1">Tab 1</TabItem>
    <TabItem value="tab2">Tab 2</TabItem>
    <TabItem value="tab3">Tab 3</TabItem>
  </Tabs>

  <TabPanel value="tab1">
    Content for tab 1
  </TabPanel>
  <TabPanel value="tab2">
    Content for tab 2
  </TabPanel>
  <TabPanel value="tab3">
    Content for tab 3
  </TabPanel>
</TabList>
```

**Props:**
- `defaultValue`: string (required) - Initial active tab

**Features:**
- Keyboard navigation (Tab, Arrow keys)
- ARIA attributes for accessibility
- Only renders active panel (performance)

---

### Loading

Loading indicators with multiple variants.

```tsx
import { Spinner, Loading, LoadingOverlay } from '@/components/ui';

// Spinner (inline)
<Spinner size="md" />

// Loading container
<Loading size="lg" />

// Full-screen overlay
<LoadingOverlay message="Loading data..." />
```

**Spinner Props:**
- `size`: 'sm' | 'md' | 'lg'

**LoadingOverlay Props:**
- `message`: string

---

### ErrorMessage

Error message component with optional retry.

```tsx
import { ErrorMessage, InlineError } from '@/components/ui';

// Basic error
<ErrorMessage message="Something went wrong" />

// With retry button
<ErrorMessage
  title="Network Error"
  message="Failed to fetch data"
  onRetry={() => console.log('Retrying...')}
/>

// Inline error (compact)
<InlineError message="Invalid input" />
```

**Props:**
- `title`: string (default: 'Error')
- `message`: string (required)
- `onRetry`: () => void
- `showIcon`: boolean (default: true)

---

## Utilities

### cn() - Class Name Utility

Simple utility for conditional class merging.

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes'
)} />
```

---

## Accessibility

All components follow WCAG AA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **ARIA Attributes**: Proper roles and labels
- **Focus Management**: Clear focus indicators
- **Screen Readers**: Semantic HTML and ARIA labels
- **Color Contrast**: 4.5:1 ratio for text

---

## Design Principles

1. **Mobile-First**: Responsive by default
2. **Type-Safe**: Full TypeScript support
3. **Accessible**: ARIA and keyboard navigation
4. **Performant**: Minimal re-renders
5. **Composable**: Flexible composition patterns
6. **Consistent**: YouTube-inspired design system

---

## File Structure

```
src/components/ui/
├── Badge.tsx          # Status badges
├── Button.tsx         # Button variants
├── Card.tsx           # Card composition
├── ErrorMessage.tsx   # Error states
├── Input.tsx          # Form inputs
├── Loading.tsx        # Loading states
├── Tab.tsx            # Tab navigation
└── index.ts           # Re-exports
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Demo

See `/src/pages/ComponentDemo.tsx` for interactive examples of all components.

Run the demo:
```bash
npm run dev
```

Then navigate to `/demo` (or import ComponentDemo into your route).
