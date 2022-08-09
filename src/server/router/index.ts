// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./user-router";
import { postRouter } from "./post-router";

// create an appRouter
export const appRouter = createRouter()
  .transformer(superjson)
  /**
  .merge brings in routes from other routers, by prefixing them 
  */
  // prefix exampleRouter procedures with 'example.'
  .merge("example.", exampleRouter) 
  // prefix protectedExampleRouter procedures with 'question.'
  .merge("question.", protectedExampleRouter) 
  // merge the userRouter 
  // prefix userRouter procedures with 'users.'
  .merge('users.', userRouter)
  .merge('posts.', postRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
