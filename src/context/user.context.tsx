/* context to store the user, to use throughout the application */

import { inferProcedureOutput } from "@trpc/server";
import { createContext, useContext } from "react";
import { AppRouter } from "../server/router";

// create types for type safety between client and server

type TQuery = keyof AppRouter['_def']['queries'];

type InferQueryOutput<TRouteKey extends TQuery> = 
  inferProcedureOutput<
    AppRouter['_def']['queries'][TRouteKey]>

/* instantiate userContext to be used throughout app
is going to be of the type we specified above, which complies with the query output
of users.me
*/
const UserContext = createContext<InferQueryOutput<'users.me'>>(null);


/* will be a wrapper  */
function UserContextProvider({children, value}: {
  // what to render inside
  children: React.ReactNode,
  // is going to be 'me' the current user
  value: InferQueryOutput<'users.me'> | undefined
}) {
  return (
    <UserContext.Provider 
      value={value || null}
    >
      {children}
    </UserContext.Provider>
  )
}

// define a hook
const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider };