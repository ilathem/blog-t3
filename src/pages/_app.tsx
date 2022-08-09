// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { loggerLink } from '@trpc/client/links/loggerLink'; // for debugging
// for combining multiple db operations into a single request
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'; 
import { url } from '../constants'
import { trpc } from "../utils/trpc";
import { UserContextProvider } from "../context/user.context";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  // get the current user context
  const { data, error, isLoading } = trpc.useQuery(['users.me']);

  if (isLoading) {
    return (
      <>
        Loading user...
      </>
    )
  }
  
  
  
  return (
    <SessionProvider session={session}>
      <UserContextProvider value={data}>
        <main>
          <Component {...pageProps} />
        </main>
      </UserContextProvider>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

// withTRPC has generic of type AppRouter
export default withTRPC<AppRouter>({
  config({ ctx }) {

    // we want to define links to make the application faster and easier to debug
    const links = [
      // order matters, http or http batch needs to come after logger link
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10, // max number of queries per request
        url,
      }),
    ]

    return {
      queryClientConfig: {
        defaultOptions: {
          // default options for queries
          queries: {
            // data will be considered stale after 60 ms by default
            staleTime: 60,
          }
        }
      },
      headers() {
        // putting a '?' after ctx covers the case where ctx may be undefined, so req wouldn't exist on an undefined object
        if (ctx?.req) {
          return {
            ...ctx.req.headers, // add headers to the request into the server to get cookies out of the header
            'x-ssr': '1', // request is done on the server
          }
        }
        // if context.request doesn't exist, return an empty object
        return {}
      },
      // returning array of links instead of url for more options
      links, 
      transformer: superjson, // superjson means we can use native dates, maps, and sets
    };
  },
  ssr: false, // we want to be able to see all of the requests the client is making
})(MyApp); // execute with trpc with MyApp
