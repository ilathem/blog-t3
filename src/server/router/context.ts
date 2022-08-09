// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { verifyJwt } from "../../utils/jwt";
import { prisma } from "../db/client";

/* 
We are gonna be using the token in the cd b to find the currently logged in  user.
*/

// define interface for context user
interface CtxUser {
  id: string,
  email: string,
  name: string,
  iat: string,
  exp: number,
}

/* this will return a context user or null if that user doesn't exist */
function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;

  if (token) {
    // try to verify if the user exists
    try {
      // make sure to specify the generic
      const verified = verifyJwt<CtxUser>(token)
      return verified; // is the verified user
    } catch (error) {
      // catch the error if the user doesn't exist
      // return null instead of throwing the error
      return null
    }
  }

  return null;
}



// export as named export
export const createContext = async (
  // will take in options as a parameter, which consist of request and response
  opts: trpcNext.CreateNextContextOptions,
) => {
  // extract request out of options, type is next api request
  const req = opts.req;

  // extract response out of options
  const res = opts.res; 

  const session =
    req && res && (await getServerSession(req, res, nextAuthOptions));

  // get the current user from the cookie inside the request
  const user = getUserFromRequest(req);

  // return object
  return {
    req, // request
    res, // response
    session,
    prisma, // for db
    user, // context user
  };
};

// context type is a type of createContext
type Context = trpc.inferAsyncReturnType<typeof createContext>;

/* 
CreateRouter will have a generic that is of type Context, which 
is defined above.
*/
export const createRouter = () => trpc.router<Context>();
