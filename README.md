This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Admin & backend (Supabase)

The site reads projects and the About text from Supabase and falls back to
`src/data/projects.ts` when Supabase isn't configured or has no projects.

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. In Supabase Auth, create your admin user (email + password).
3. Copy `.env.example` to `.env.local` and fill in the URL, anon key,
   service-role key and `ADMIN_EMAILS` (only these users can use the admin).
4. Run `npm run dev` and open `/admin`.

From `/admin` you can create/edit/delete projects (with cover + gallery image
uploads to the `portfolio` storage bucket), edit the home About text, and read
messages sent from the contact form.

## Analytics

Anonymous, cookie-less analytics (no IP addresses stored; Do Not Track is respected). Run these in the
Supabase SQL editor, in order: `supabase/analytics.sql`, then `supabase/analytics-v2.sql`.

The admin **Analytics** tab shows live visitors, hot leads, per-project engagement (time, scroll depth,
link clicks), where visitors come from, and issues (errors, broken files, slow pages, rage clicks).
Country/city come from Vercel's edge headers, so they only appear on the deployed site.
