# UI-Smith

**AI-Powered Generative UI Application**

UI-Smith is a production-ready, end-to-end web application built with the Tambo framework that allows users to describe UIs in natural language and get interactive React components in real-time.

![UI-Smith Banner](https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=400&fit=crop)

## ✨ Features

- **Natural Language UI Generation** - Describe what you want, get working React components
- **Real-time Preview** - See your UI rendered as you describe it
- **Multi-Agent Pipeline** - Your requests are processed by specialized AI agents:
  - 🏗️ **UI Architect** - Translates requirements into component specifications
  - 🎨 **Design Critic** - Reviews and improves visual design quality
  - ♿ **Accessibility Agent** - Validates WCAG 2.1 AA compliance
  - 📦 **Export Engineer** - Generates production-ready code
- **8 Premium Components** - Button, Card, PricingTable, DashboardLayout, Chart, Form, Modal, TestimonialSection
- **MCP Integration** - Model Context Protocol servers for design validation
- **Export to Code** - Get clean, copy-paste ready React + Tailwind code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/ui-smith.git
cd ui-smith

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building UIs!

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| AI Integration | Tambo SDK |
| Component Library | Radix UI + Shadcn/UI patterns |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Validation | Zod |
| MCP | Model Context Protocol SDK |

## 📁 Project Structure

```
ui-smith/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main application
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── components/
│   │   └── generative/         # AI-powered UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── pricing-table.tsx
│   │       ├── dashboard-layout.tsx
│   │       ├── chart.tsx
│   │       ├── form.tsx
│   │       ├── modal.tsx
│   │       └── testimonial-section.tsx
│   │
│   ├── agents/                 # Multi-agent system
│   │   ├── ui-architect.ts     # UI generation agent
│   │   ├── design-critic.ts    # Design review agent
│   │   ├── accessibility-agent.ts
│   │   ├── export-engineer.ts
│   │   └── orchestrator.ts     # Agent coordination
│   │
│   ├── tambo/                  # Tambo SDK configuration
│   │   ├── provider.tsx
│   │   ├── component-registry.ts
│   │   └── mcp-config.ts
│   │
│   ├── mcp/                    # MCP servers
│   │   ├── design-system/      # Design validation
│   │   ├── accessibility/      # A11y validation
│   │   ├── ux-best-practices/  # UX recommendations
│   │   └── export/             # Code generation
│   │
│   └── lib/                    # Utilities
│       └── utils.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Usage Examples

Try these prompts in UI-Smith:

```
"Create a SaaS pricing page with 3 tiers"
```

```
"Build a modern hero section with a call-to-action button"
```

```
"Design a contact form with name, email, and message fields"
```

```
"Generate a testimonials section with customer reviews"
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint

# MCP Servers
npm run mcp:design   # Start Design System MCP
npm run mcp:a11y     # Start Accessibility MCP
npm run mcp:ux       # Start UX Best Practices MCP
npm run mcp:export   # Start Export MCP
npm run mcp:all      # Start all MCP servers
```

## 🎨 Component Library

### Button
Interactive button with multiple variants (solid, outline, ghost, link), sizes, colors, and states.

### Card
Content container with variants (default, elevated, outlined, glass, gradient) and optional media, badges, and actions.

### PricingTable
Complete pricing display with tiers, features, billing toggle, and comparison.

### DashboardLayout
Full admin layout with sidebar navigation, header, and content area.

### Chart
Data visualization supporting line, bar, area, and pie charts.

### Form
Dynamic form builder with various field types, validation, and sections.

### Modal
Accessible dialog with animations and multiple variants.

### TestimonialSection
Customer testimonials with ratings, avatars, and multiple layouts.

## ♿ Accessibility

All components are built with accessibility in mind:
- WCAG 2.1 AA compliant color contrast
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

Built with ❤️ using [Tambo SDK](https://tambo.ai) and [Next.js](https://nextjs.org)
