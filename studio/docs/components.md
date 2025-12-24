
## Select

The `Select` component is a customizable dropdown select input, built using `shadcn/ui` and `@radix-ui/react-select`. It provides an accessible way for users to choose from a list of options.

### Sub-Components and Props

The `Select` component consists of several sub-components:

#### `Select` (Root Component)

-   **Description**: The main container for the select dropdown. It manages the open/closed state and the selected value.
-   **Props**:
    | Prop Name | Type      | Description                                                                 |
    | :-------- | :-------- | :-------------------------------------------------------------------------- |
    | `open`    | `boolean` | Controls whether the select dropdown is open or closed.                     |
    | `onOpenChange` | `(open: boolean) => void` | Callback fired when the open state of the select changes. |
    | `value`   | `string`  | The currently selected value.                                               |
    | `onValueChange` | `(value: string) => void` | Callback fired when the selected value changes. |
    | `defaultValue` | `string` | The initial selected value.                                                 |
    | `dir`     | `"ltr" | "rtl"` | The reading direction of the select. Default is `ltr`.                  |
    | `name`    | `string`  | The name of the select input, used for form submission.                     |
    | `disabled`| `boolean` | If true, the select input will be disabled.                                 |
    | `required`| `boolean` | If true, the select input will be required for form submission.             |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>` | Other standard Radix UI Select Root props. |

#### `SelectGroup`

-   **Description**: A container for grouping related `SelectItem` components.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the group.                               |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>` | Other standard Radix UI Select Group props. |

#### `SelectValue`

-   **Description**: Displays the currently selected value within the `SelectTrigger`.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `placeholder` | `string` | The placeholder text to display when no value is selected.                  |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>` | Other standard Radix UI Select Value props. |

#### `SelectTrigger`

-   **Description**: The interactive element that opens the select dropdown.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the trigger.                             |
    | `children`| `React.ReactNode` | The content to be rendered inside the trigger (e.g., `SelectValue`).        |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>` | Other standard Radix UI Select Trigger props. |

#### `SelectContent`

-   **Description**: The container for the select options, which appears when the `SelectTrigger` is activated.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the content area.                        |
    | `children`| `React.ReactNode` | The content to be rendered inside the dropdown (e.g., `SelectGroup`, `SelectItem`). |
    | `position`| `"popper" | "item-aligned"` | The positioning strategy for the content. Default is `popper`.      |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>` | Other standard Radix UI Select Content props. |

#### `SelectLabel`

-   **Description**: A label for a group of `SelectItem` components within a `SelectGroup`.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the label.                               |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>` | Other standard Radix UI Select Label props. |

#### `SelectItem`

-   **Description**: An individual option within the select dropdown.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the item.                                |
    | `children`| `React.ReactNode` | The content to be rendered inside the item (e.g., the option text).         |
    | `value`   | `string`  | The value associated with the item.                                         |
    | `disabled`| `boolean` | If true, the item will be disabled.                                         |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>` | Other standard Radix UI Select Item props. |

#### `SelectSeparator`

-   **Description**: A visual separator between `SelectItem` components or `SelectGroup` components.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the separator.                           |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>` | Other standard Radix UI Select Separator props. |

#### `SelectScrollUpButton`

-   **Description**: A button that appears at the top of the dropdown content when there are more options above to scroll to.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the scroll up button.                    |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>` | Other standard Radix UI Select Scroll Up Button props. |

#### `SelectScrollDownButton`

-   **Description**: A button that appears at the bottom of the dropdown content when there are more options below to scroll to.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes to apply to the scroll down button.                  |
    | ...       | `React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>` | Other standard Radix UI Select Scroll Down Button props. |

### Usage Example

```

### Calendar

The `Calendar` component is a date picker that allows users to select a single date or a range of dates. It's built on top of `react-day-picker` and provides a customizable calendar interface.

**Props for `Calendar`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `classNames` | `Record<string, string>`                                | Custom class names for various calendar elements. |
| `showOutsideDays` | `boolean`                                               | Whether to show days outside the current month. |
| `...props`  | `React.ComponentProps<typeof DayPicker>`                | Standard HTML attributes and `react-day-picker` props. |

**Usage Example:**

```tsx
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
```

### Switch

The `Switch` component is a wrapper around Radix UI's Switch primitive, providing a toggle switch for users to turn options on or off.

**Props for `Switch`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
```

### Alert

The `Alert` component is used to display important messages to the user. It can be used to show success, warning, or error messages.

**Props for `Alert`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `variant`   | `"default" | "destructive"`                           | The visual style of the alert.            |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>` | Standard HTML attributes and variant props. |

**Props for `AlertTitle`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.HTMLAttributes<HTMLHeadingElement>`              | Standard HTML attributes.                 |

**Props for `AlertDescription`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.HTMLAttributes<HTMLParagraphElement>`            | Standard HTML attributes.                 |

**Usage Example:**

```tsx
import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function AlertDemo() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}

function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  )
}
```

### Tooltip

The `Tooltip` component is a wrapper around Radix UI's Tooltip primitive, providing a way to display a small, informative popover when a user hovers over or focuses on an element.

**Props for `TooltipProvider`:**

| Prop Name | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `delayDuration` | `number`  | The duration from when the pointer enters the trigger until the tooltip opens. |
| `skipDelayDuration` | `number`  | The duration from when the pointer leaves the trigger until the tooltip closes. |
| `disableHoverableContent` | `boolean` | When `true`, the tooltip content will not be hoverable. |

**Props for `Tooltip`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `open`      | `boolean`                                               | The controlled open state of the tooltip. |
| `defaultOpen` | `boolean`                                               | The open state of the tooltip when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void`                               | Event handler called when the open state changes. |
| `delayDuration` | `number`                                                | The duration from when the pointer enters the trigger until the tooltip opens. |
| `disableHoverableContent` | `boolean` | When `true`, the tooltip content will not be hoverable. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `TooltipTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `...props`  | `React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>` | Standard HTML attributes and Radix UI props. |

**Props for `TooltipContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `sideOffset` | `number`                                                | The distance in pixels from the trigger.  |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button" // Assuming Button component is available

function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### Accordion

The `Accordion` component is a wrapper around Radix UI's Accordion primitive, providing a way to display a list of collapsible items. Each item can be expanded or collapsed to reveal or hide its content.

**Props for `Accordion`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `type`      | `"single" | "multiple"`                               | Determines whether a single item or multiple items can be open at a time. |
| `collapsible` | `boolean`                                               | When `type` is "single", allows the open item to be closed. |
| `value`     | `string`                                                | The controlled value of the open item(s). |
| `defaultValue` | `string`                                                | The initial value of the open item(s) when uncontrolled. |
| `onValueChange` | `(value: string) => void`                               | Event handler called when the open item(s) change. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `AccordionItem`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `value`     | `string`                                                | A unique value for the accordion item.    |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>` | Standard HTML attributes and Radix UI props. |

**Props for `AccordionTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `children`  | `React.ReactNode`                                       | The content to be rendered inside the trigger. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>` | Standard HTML attributes and Radix UI props. |

**Props for `AccordionContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `children`  | `React.ReactNode`                                       | The content to be rendered inside the collapsible area. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Label

The `Label` component is a wrapper around Radix UI's Label primitive, used to associate text labels with form controls. It provides accessible labeling for input fields, checkboxes, radio buttons, and other interactive elements.

**Props for `Label`:**

| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>` | Standard HTML attributes and Radix UI props. |\n\n**Usage Example:**\n\n```tsx\nimport { Label } from "@/components/ui/label"\nimport { Input } from "@/components/ui/input" // Assuming Input component is available\n\nfunction LabelDemo() {\n  return (\n    <div className="grid w-full max-w-sm items-center gap-1.5">\n      <Label htmlFor="email">Email</Label>\n      <Input type="email" id="email" placeholder="Email" />\n    </div>\n  )\n}\n```

### RadioGroup

The `RadioGroup` component is a wrapper around Radix UI's RadioGroup primitive, providing a set of radio buttons for users to select a single option from a list.

**Props for `RadioGroup`:**

| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\n| `defaultValue` | `string`                                                | The value of the radio button that is checked by default. |\n| `value`     | `string`                                                | The controlled value of the checked radio button. |\n| `onValueChange` | `(value: string) => void`                               | Event handler called when the checked radio button changes. |\n| `name`      | `string`                                                | The name of the radio group, used for form submission. |\n| `disabled`  | `boolean`                                               | If `true`, all radio buttons in the group will be disabled. |\n| `orientation` | `\"horizontal\" | \"vertical\"`                           | The orientation of the radio group.       |\n| `dir`       | `\"ltr\" | \"rtl\"`                                   | The reading direction of the radio group. |\n| `loop`      | `boolean`                                               | If `true`, navigating past the last radio button will loop to the first. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>` | Standard HTML attributes and Radix UI props. |\n\n**Props for `RadioGroupItem`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `value`     | `string`                                                | The value associated with the radio button. |\n| `id`        | `string`                                                | The ID of the radio button.               |\n| `disabled`  | `boolean`                                               | If `true`, the radio button will be disabled. |\n| `required`  | `boolean`                                               | If `true`, the radio button must be checked for form submission. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>` | Standard HTML attributes and Radix UI props. |\n\n**Usage Example:**\n\n```tsx\nimport { Label } from \"@/components/ui/label\"\nimport {\n  RadioGroup,\n  RadioGroupItem,\n} from \"@/components/ui/radio-group\"\n\nfunction RadioGroupDemo() {\n  return (\n    <RadioGroup defaultValue=\"comfortable\">\n      <div className=\"flex items-center space-x-2\">\n        <RadioGroupItem value=\"default\" id=\"r1\" />\n        <Label htmlFor=\"r1\">Default</Label>\n      </div>\n      <div className=\"flex items-center space-x-2\">\n        <RadioGroupItem value=\"comfortable\" id=\"r2\" />\n        <Label htmlFor=\"r2\">Comfortable</Label>\n      </div>\n      <div className=\"flex items-center space-x-2\">\n        <RadioGroupItem value=\"compact\" id=\"r3\" />\n        <Label htmlFor=\"r3\">Compact</Label>\n      </div>\n    </RadioGroup>\n  )\n}\n```

### Separator

The `Separator` component is a visually or semantically separate content. It's commonly used to divide sections of content or to provide visual distinction between elements.\n\n**Props for `Separator`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\n| `orientation` | `\"horizontal\" | \"vertical\"`                           | The orientation of the separator. Default is `horizontal`. |\n| `decorative` | `boolean`                                               | When `true`, the separator is considered decorative and will be ignored by screen readers. Default is `true`. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>` | Standard HTML attributes and Radix UI props. |\n\n**Usage Example:**\n\n```tsx\nimport { Separator } from \"@/components/ui/separator\"\n\nfunction SeparatorDemo() {\n  return (\n    <div>\n      <div className=\"space-y-1\">\n        <h4 className=\"text-sm font-medium leading-none\">Radix Primitives</h4>\n        <p className=\"text-sm text-muted-foreground\">\n          An open-source UI component library.\n        </p>\n      </div>\n      <Separator className=\"my-4\" />\n      <div className=\"flex h-5 items-center space-x-4 text-sm\">\n        <div>Blog</div>\n        <Separator orientation=\"vertical\" />\n        <div>Docs</div>\n        <Separator orientation=\"vertical\" />\n        <div>Source</div>\n      </div>\n    </div>\n  )\n}\n```

### ScrollArea

The `ScrollArea` component is a wrapper around Radix UI's ScrollArea primitive, providing a customizable scrollable container with a native-like scrolling experience.\n\n**Props for `ScrollArea`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>` | Standard HTML attributes and Radix UI props. |\n\n**Props for `ScrollBar`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `orientation` | `\"horizontal\" | \"vertical\"`                           | The orientation of the scrollbar. Default is `vertical`. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>` | Standard HTML attributes and Radix UI props. |\n\n**Usage Example:**\n\n```tsx\nimport { ScrollArea, ScrollBar } from \"@/components/ui/scroll-area\"\n\nconst tags = Array.from({ length: 50 }).map(\n  (_, i) => `Tag ${i + 1}`\n)\n\nfunction ScrollAreaDemo() {\n  return (\n    <ScrollArea className=\"h-48 w-48 rounded-md border\">\n      <div className=\"p-4\">\n        <h4 className=\"mb-4 text-sm font-medium leading-none\">Tags</h4>\n        {tags.map((tag) => (\n          <div key={tag} className=\"text-sm\">\n            {tag}\n          </div>\n        ))}\n      </div>\n      <ScrollBar />\n    </ScrollArea>\n  )\n}\n```

### Breadcrumb

The `Breadcrumb` component is a navigation component that indicates the current page's location within a hierarchical structure. It's built using `shadcn/ui` and `@radix-ui/react-navigation-menu` primitives, providing an accessible way to navigate back through the site's structure.\n\n**Props for `Breadcrumb`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentProps<\"nav\">`                           | Standard HTML attributes for the `nav` element. |\n\n**Props for `BreadcrumbList`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentProps<\"ol\">`                            | Standard HTML attributes for the `ol` element. |\n\n**Props for `BreadcrumbItem`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentProps<\"li\">`                            | Standard HTML attributes for the `li` element. |\n\n**Props for `BreadcrumbLink`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `asChild`   | `boolean`                                               | Renders the child component without wrapping it in an extra DOM element. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentProps<typeof Link>`                     | Standard HTML attributes and `next/link` props. |\n\n**Props for `BreadcrumbPage`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `asChild`   | `boolean`                                               | Renders the child component without wrapping it in an extra DOM element. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\
| `...props`  | `React.ComponentProps<\"span\">`                          | Standard HTML attributes for the `span` element. |\n\n**Props for `BreadcrumbSeparator`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentProps<\"li\">`                            | Standard HTML attributes for the `li` element. |\n\n**Props for `BreadcrumbEllipsis`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.ComponentProps<\"span\">`                          | Standard HTML attributes for the `span` element. |\n\n**Usage Example:**\n\n```tsx\nimport Link from \"next/link\"\n\nimport {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from \"@/components/ui/breadcrumb\"\n\nfunction BreadcrumbDemo() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink asChild>\n            <Link href=\"/\">Home</Link>\n          </BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbLink asChild>\n            <Link href=\"/components\">Components</Link>\n          </BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  )\n}\n```

### Badge

The `Badge` component is a small, informative label used to highlight an item's status, category, or other key attributes. It's built using `shadcn/ui` and `class-variance-authority` for flexible styling.\n\n**Props for `Badge`:**\n\n| Prop Name | Type                                                    | Description                               |\n| --------- | ------------------------------------------------------- | ----------------------------------------- |\
| `variant`   | `\"default\" | \"secondary\" | \"destructive\" | \"outline\"` | The visual style of the badge. Default is `default`. |\n| `className` | `string`                                                | Additional CSS classes for styling.       |\n| `...props`  | `React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>` | Standard HTML attributes and variant props. |\n\n**Usage Example:**\n\n```tsx\nimport { Badge } from \"@/components/ui/badge\"\n\nfunction BadgeDemo() {\n  return (\n    <div className=\"flex gap-2\">\n      <Badge>Default</Badge>\n      <Badge variant=\"secondary\">Secondary</Badge>\n      <Badge variant=\"destructive\">Destructive</Badge>\n      <Badge variant=\"outline\">Outline</Badge>\n    </div>\n  )\n}\n```



### RadioGroup

The `RadioGroup` component is a wrapper around Radix UI's RadioGroup primitive, providing a set of radio buttons for users to select a single option from a list.

**Props for `RadioGroup`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `defaultValue` | `string`                                                | The value of the radio button that is checked by default. |
| `value`     | `string`                                                | The controlled value of the checked radio button. |
| `onValueChange` | `(value: string) => void`                               | Event handler called when the checked radio button changes. |
| `name`      | `string`                                                | The name of the radio group, used for form submission. |
| `disabled`  | `boolean`                                               | If `true`, all radio buttons in the group will be disabled. |
| `orientation` | `"horizontal" | "vertical"`                              | The orientation of the radio group.       |
| `dir`       | `"ltr" | "rtl"`                                   | The reading direction of the radio group. |
| `loop`      | `boolean`                                               | If `true`, navigating past the last radio button will loop to the first. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `RadioGroupItem`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `value`     | `string`                                                | The value of the radio button.            |
| `id`        | `string`                                                | The ID of the radio button.               |
| `disabled`  | `boolean`                                               | If `true`, the radio button will be disabled. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}
```

### Separator

The `Separator` component is a visually and semantically meaningful horizontal or vertical line that separates content. It's built using `shadcn/ui` and `@radix-ui/react-separator`.

**Props for `Separator`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `orientation` | `"horizontal" | "vertical"`                              | The orientation of the separator. Default is `horizontal`. |
| `decorative` | `boolean`                                               | When `true`, the separator is considered decorative and will be hidden from assistive technologies. Default is `false`. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import { Separator } from "@/components/ui/separator"

function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

### ScrollArea

The `ScrollArea` component is a custom scrollable area that enhances the native scrollbar experience, providing better styling and cross-browser consistency. It's built using `shadcn/ui` and `@radix-ui/react-scroll-area`.

**Props for `ScrollArea`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `children`  | `React.ReactNode`                                       | The content to be rendered inside the scrollable area. |
| `orientation` | `"vertical" | "horizontal"`                            | The orientation of the scrollbar(s). Default is `vertical`. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
```

### Breadcrumb

The `Breadcrumb` component provides a clear and accessible navigation path, allowing users to understand their location within a website's hierarchy. It's built using `shadcn/ui` and `@radix-ui/react-slot`.

**Sub-Components and Props:**

#### `Breadcrumb` (Root Component)

-   **Description**: The main container for the breadcrumb navigation.
-   **Props**:
    | Prop Name | Type           | Description                                                                 |
    | :-------- | :------------- | :-------------------------------------------------------------------------- |
    | `separator` | `React.ReactNode` | An optional custom separator to use between breadcrumb items. Defaults to a `ChevronRight` icon. |
    | `...props`  | `React.ComponentPropsWithoutRef<"nav">` | Standard HTML `nav` attributes. |

#### `BreadcrumbList`

-   **Description**: An ordered list (`<ol>`) that wraps the individual `BreadcrumbItem` components.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes for styling.                                         |
    | `...props`  | `React.ComponentPropsWithoutRef<"ol">` | Standard HTML `ol` attributes. |

#### `BreadcrumbItem`

-   **Description**: A list item (`<li>`) representing a single step in the breadcrumb path.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes for styling.                                         |
    | `...props`  | `React.ComponentPropsWithoutRef<"li">` | Standard HTML `li` attributes. |

#### `BreadcrumbLink`

-   **Description**: An anchor tag (`<a>`) used for navigable breadcrumb items.
-   **Props**:
    | Prop Name | Type      | Description                                                                 |
    | :-------- | :-------- | :-------------------------------------------------------------------------- |
    | `asChild` | `boolean` | If `true`, the component will render its child as the link, passing its props to the child. |
    | `className` | `string` | Additional CSS classes for styling.                                         |
    | `...props`  | `React.ComponentPropsWithoutRef<"a">` | Standard HTML `a` attributes. |

#### `BreadcrumbPage`

-   **Description**: A `<span>` element representing the current page in the breadcrumb. It's not a link and is typically styled differently to indicate the active state.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes for styling.                                         |
    | `...props`  | `React.ComponentPropsWithoutRef<"span">` | Standard HTML `span` attributes. |

#### `BreadcrumbSeparator`

-   **Description**: A visual separator between `BreadcrumbLink` or `BreadcrumbPage` components.
-   **Props**:
    | Prop Name | Type           | Description                                                                 |
    | :-------- | :------------- | :-------------------------------------------------------------------------- |
    | `children`  | `React.ReactNode` | Custom content for the separator. Defaults to a `ChevronRight` icon.        |
    | `className` | `string`       | Additional CSS classes for styling.                                         |
    | `...props`  | `React.ComponentProps<"li">` | Standard HTML `li` attributes. |

#### `BreadcrumbEllipsis`

-   **Description**: Represents a group of hidden or truncated breadcrumb items, typically displayed as "..." or a `MoreHorizontal` icon.
-   **Props**:
    | Prop Name | Type     | Description                                                                 |
    | :-------- | :------- | :-------------------------------------------------------------------------- |
    | `className` | `string` | Additional CSS classes for styling.                                         |
    | `...props`  | `React.ComponentProps<"span">` | Standard HTML `span` attributes. |

**Usage Example:**

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"

function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

### AlertDialog

The `AlertDialog` component is a modal dialog that interrupts the user with important content and expects a response. It's built on top of `shadcn/ui` and `@radix-ui/react-alert-dialog`.

**Props for `AlertDialog`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `open`      | `boolean`                                               | The controlled open state of the dialog.  |
| `onOpenChange` | `(open: boolean) => void`                               | Event handler called when the open state changes. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `AlertDialogTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `asChild`   | `boolean`                                               | Renders the child component without wrapping it in an extra DOM element. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>` | Standard HTML attributes and Radix UI props. |

**Props for `AlertDialogContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>` | Standard HTML attributes and Radix UI props. |

**Props for `AlertDialogAction`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>` | Standard HTML attributes and Radix UI props. |

**Props for `AlertDialogCancel`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Avatar

The `Avatar` component is an image element with a fallback for representing the user. It uses `@radix-ui/react-avatar` to handle image loading and fallback states.

**Props for `Avatar`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `AvatarImage`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `src`       | `string`                                                | The source URL of the image.              |
| `alt`       | `string`                                                | The alternative text for the image.       |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>` | Standard HTML attributes and Radix UI props. |

**Props for `AvatarFallback`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `delayMs`   | `number`                                                | The delay in milliseconds before the fallback is shown. |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
```

### Carousel

The `Carousel` component is a carousel slider built using `embla-carousel-react`. It supports various plugins and customization options.

**Props for `Carousel`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `opts`      | `CarouselOptions`                                       | Options for the Embla Carousel instance.  |
| `plugins`   | `CarouselPlugin`                                        | Plugins for the Embla Carousel instance.  |
| `orientation` | `"horizontal" | "vertical"`                           | The orientation of the carousel. Default is `horizontal`. |
| `setApi`    | `(api: CarouselApi) => void`                            | Callback to get the Embla Carousel API instance. |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>`                  | Standard HTML attributes.                 |

**Props for `CarouselContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>`                  | Standard HTML attributes.                 |

**Props for `CarouselItem`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>`                  | Standard HTML attributes.                 |

**Usage Example:**

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Checkbox

The `Checkbox` component is a control that allows the user to toggle between checked and not checked. It uses `@radix-ui/react-checkbox`.

**Props for `Checkbox`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `checked`   | `boolean | "indeterminate"`                             | The controlled checked state of the checkbox. |
| `defaultChecked` | `boolean | "indeterminate"`                        | The initial checked state when uncontrolled. |
| `onCheckedChange` | `(checked: boolean | "indeterminate") => void`      | Event handler called when the checked state changes. |
| `disabled`  | `boolean`                                               | If `true`, the checkbox will be disabled. |
| `required`  | `boolean`                                               | If `true`, the checkbox must be checked for form submission. |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
```

### Collapsible

The `Collapsible` component is an interactive component which expands/collapses a panel. It uses `@radix-ui/react-collapsible`.

**Props for `Collapsible`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `open`      | `boolean`                                               | The controlled open state of the collapsible. |
| `defaultOpen` | `boolean`                                               | The initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void`                               | Event handler called when the open state changes. |
| `disabled`  | `boolean`                                               | If `true`, the collapsible will be disabled. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `CollapsibleTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `asChild`   | `boolean`                                               | Renders the child component without wrapping it in an extra DOM element. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>` | Standard HTML attributes and Radix UI props. |

**Props for `CollapsibleContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `forceMount` | `boolean`                                               | Used to force mounting when more control is needed. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import * as React from "react"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

function BreadcrumbWithDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

### Dialog

The `Dialog` component is a window overlaid on either the primary window or another dialog window, rendering the content underneath inert. It uses `@radix-ui/react-dialog`.

**Props for `Dialog`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `open`      | `boolean`                                               | The controlled open state of the dialog.  |
| `onOpenChange` | `(open: boolean) => void`                               | Event handler called when the open state changes. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `DialogTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `asChild`   | `boolean`                                               | Renders the child component without wrapping it in an extra DOM element. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>` | Standard HTML attributes and Radix UI props. |

**Props for `DialogContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `children`  | `React.ReactNode`                                       | The content to display in the dialog.     |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### DropdownMenu

The `DropdownMenu` component displays a menu to the user—such as a set of actions or functions—triggered by a button. It uses `@radix-ui/react-dropdown-menu`.

**Props for `DropdownMenu`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `open`      | `boolean`                                               | The controlled open state of the menu.    |
| `onOpenChange` | `(open: boolean) => void`                               | Event handler called when the open state changes. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `DropdownMenuTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `asChild`   | `boolean`                                               | Renders the child component without wrapping it in an extra DOM element. |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>` | Standard HTML attributes and Radix UI props. |

**Props for `DropdownMenuContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `sideOffset` | `number`                                               | The distance in pixels from the trigger.  |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>` | Standard HTML attributes and Radix UI props. |

**Props for `DropdownMenuItem`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `inset`     | `boolean`                                               | If `true`, adds left padding for alignment. |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Form

The `Form` component is a wrapper around `react-hook-form` and `zod` schema validation. It provides a type-safe way to build forms.

**Props for `Form`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `...props`  | `FormProviderProps`                                     | Props from `react-hook-form`'s `FormProvider`. |

**Props for `FormField`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `control`   | `Control<TFieldValues>`                                 | The `control` object from `useForm`.      |
| `name`      | `FieldPath<TFieldValues>`                               | The name of the field.                    |
| `render`    | `(props: { field: ... }) => React.ReactElement`         | Render prop for the field.                |

**Usage Example:**

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Input

The `Input` component displays a form input field or a component that looks like an input field.

**Props for `Input`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `type`      | `string`                                                | The type of input (e.g., text, password, email). |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.InputHTMLAttributes<HTMLInputElement>`           | Standard HTML attributes for the `input` element. |

**Usage Example:**

```tsx
import { Input } from "@/components/ui/input"

function InputDemo() {
  return <Input type="email" placeholder="Email" />
}
```

### Menubar

The `Menubar` component displays a visually persistent menu common in desktop applications. It uses `@radix-ui/react-menubar`.

**Props for `Menubar`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>` | Standard HTML attributes and Radix UI props. |

**Props for `MenubarMenu`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `value`     | `string`                                                | A unique value to identify the menu.      |
| `...props`  | `React.ComponentProps<typeof MenubarPrimitive.Menu>`    | Standard Radix UI props.                  |

**Props for `MenubarTrigger`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>` | Standard HTML attributes and Radix UI props. |

**Props for `MenubarContent`:**

| Prop Name | Type                                                    | Description                               |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `className` | `string`                                                | Additional CSS classes for styling.       |
| `...props`  | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>` | Standard HTML attributes and Radix UI props. |

**Usage Example:**

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```
