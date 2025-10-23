# POSM Catalogue Platform

A modern web-based catalogue platform for browsing product models with interactive Point-of-Sale Material (POSM) placement visualization. Built with React, TypeScript, and TailwindCSS.

## Features

- **Interactive Model Viewer**: Browse product models with clickable POSM hotspots
- **Admin Mode**: Position and edit POSM markers with drag-and-drop functionality
- **Search & Filter**: Quickly find models with text search and category filtering
- **Data Export**: Export catalogue data as JSON for backup or sharing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance Optimized**: Lazy loading, efficient rendering for up to 100 models

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: TailwindCSS 3.x
- **Routing**: React Router 6.x
- **Drag & Drop**: react-draggable
- **Testing**: Vitest + React Testing Library

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```text
posm-catalogue/
├── public/                    # Static assets
│   ├── data/                  # JSON data files
│   │   ├── models.json        # Catalogue index
│   │   └── models/            # Individual model files
│   └── images/                # Model and POSM images
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── viewer/            # Viewer mode components
│   │   ├── admin/             # Admin mode components
│   │   ├── shared/            # Shared components
│   │   └── layout/            # Layout components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # Data services
│   ├── utils/                 # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── App.tsx                # Root component
├── tests/                     # Test files
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
└── tailwind.config.js         # TailwindCSS configuration
```

## Usage

### Viewer Mode (Default)

1. Browse the catalogue of product models
2. Click on a model to view details
3. Click POSM hotspots to see detailed information
4. Use search and filters to find specific models

### Admin Mode

1. Click "Admin" in the header and log in
2. Select a model to edit
3. Drag markers to position POSM locations
4. Click markers to edit their details
5. Changes are auto-saved as drafts
6. Export data when ready to deploy

### Adding New Models

1. Prepare your model image (WebP format recommended, max 5MB)
2. Create a JSON file in `public/data/models/` (see [data-model.md](../specs/001-posm-catalogue/data-model.md))
3. Update `public/data/models.json` to include the new model
4. Add the model image to `public/images/models/`

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_ADMIN_PASSWORD_HASH="your-bcrypt-hash-here"
```

### Admin Authentication

Generate a password hash:

```bash
npx ts-node scripts/generate-password-hash.ts your-secure-password
```

## Development

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code
npm run format
```

## Deployment

### Option 1: Netlify (Recommended)

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Option 2: Vercel

1. Import project from Git
2. Configure build settings (auto-detected)
3. Add environment variables
4. Deploy!

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Deploy
npm run deploy
```

## Performance

- **Initial Load**: <3s for catalogue index
- **Model Display**: <3s for full model with image
- **POSM Popup**: <1s response time
- **Smooth Interactions**: 60fps drag operations
- **Scalability**: Supports up to 100 models without degradation

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Documentation

- [Feature Specification](../specs/001-posm-catalogue/spec.md)
- [Implementation Plan](../specs/001-posm-catalogue/plan.md)
- [Data Model](../specs/001-posm-catalogue/data-model.md)
- [Quickstart Guide](../specs/001-posm-catalogue/quickstart.md)

## License

[Your License Here]

## Support

For issues or questions, please [create an issue](https://github.com/your-org/posm-catalogue/issues).
