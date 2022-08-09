/** TRPC handler for the frontend

*/


// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";

// export API handler (NEXTJS Route Handler)
export default createNextApiHandler({
  router: appRouter, // router is appRouter from server
  // createContext: createContext, // createContext is createContext from server
  createContext, // this is the same as the commented line above (double names)
  // custom error handler
  onError({error}) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error("Something went wrong", error);
    } else {
      console.error(error);
    }
  }
});
