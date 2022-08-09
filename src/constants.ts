export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL // if we deploy to vercel...
? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` // use the vercel url
: `http://localhost:3000` // otherwise, use localhost url

export const url = `${baseUrl}/api/trpc`