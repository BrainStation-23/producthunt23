
# ProductHunt23

[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-dark.svg)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)
------------------
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=BrainStation-23_producthunt23&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=BrainStation-23_producthunt23&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=BrainStation-23_producthunt23&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=BrainStation-23_producthunt23&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=BrainStation-23_producthunt23&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=BrainStation-23_producthunt23&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=BrainStation-23_producthunt23)

## About

ProductHunt23 is a platform for discovering and sharing new digital products. Users can submit their own products, browse and search for products, upvote their favorites, and engage with the community through comments. The platform includes features for product categorization, technology tagging, and user profiles.

## Technology Stack

This project is built with modern web technologies:

- **Frontend**:
  - [React](https://reactjs.org/) - JavaScript library for building user interfaces
  - [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
  - [Vite](https://vitejs.dev/) - Next-generation frontend tooling
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components built with Radix UI and Tailwind CSS
  - [React Router](https://reactrouter.com/) - Declarative routing for React
  - [Tanstack React Query](https://tanstack.com/query/latest) - Data fetching and state management

- **Backend**:
  - [Supabase](https://supabase.com/) - Open-source Firebase alternative
  - PostgreSQL - Advanced open-source relational database
  - Row Level Security (RLS) - Database-level security policies

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or [bun](https://bun.sh/) package manager

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd producthunt23
   ```

2. Install dependencies:
   ```sh
   npm install
   # or with bun
   bun install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or with bun
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Connecting to Your Own Supabase Backend

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Configure your Supabase project:
   - Set up authentication providers as needed
   - Run the database migrations found in the `supabase/migrations` directory
   - Set up storage buckets if needed

3. Update the Supabase client configuration:
   - Create a `.env.local` file in the project root (it's git-ignored)
   - Add your Supabase URL and anon key:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

4. Alternatively, you can directly update the `src/integrations/supabase/client.ts` file with your project details.

## Deployment

### Deploy with Netlify

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Sign up for [Netlify](https://www.netlify.com/)
3. Create a new site from Git
4. Select your repository and configure build settings:
   - Build command: `npm run build` or `bun run build`
   - Publish directory: `dist`
5. Configure environment variables for Supabase in the Netlify dashboard

### Deploy with Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Sign up for [Vercel](https://vercel.com/)
3. Import your repository
4. Configure build settings:
   - Framework preset: Vite
   - Build command: `npm run build` or `bun run build`
   - Output directory: `dist`
5. Configure environment variables for Supabase in the Vercel dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
