import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { baseUrl } from "../../constants";
import { createUserInputSchema, createUserOutputSchema, requestOtpSchema, verifyOtpSchema } from "../../schema/user.schema";
import { decode, encode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { sendLoginEmail } from "../../utils/mailer";
import { createRouter } from "./context";
import { serialize } from 'cookie';

// export the userRouter from this file 
export const userRouter = createRouter()
  .mutation('register-user', {
    // attaching createUserSchema to input will validate input for us
    input: createUserInputSchema, 

    // pass context into resolver
    resolve: async ({ ctx, input: {email, name} }) => {
      // we have access to prisma db inside of context

      // check to see if user already exists
      try {
        // create user with input parameters in prisma db
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          }
        });
        return user;

      } catch (error) {
        // if the error originates from the user already being in the db
        if (error instanceof PrismaClientKnownRequestError) {
          // P2002 means that it violates a unique constraint
          if (error.code === 'P2002') {
            // create and throw a trpc error
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'User already exists',
            })
          }
        }
        // otherwise, it's some other error we don't expect
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      } 
      

    },
  })
  // request a one time password, which will be the login token
  .mutation('request-otp', {
    input: requestOtpSchema,
    resolve: async({ ctx, input: {email, redirect}}) => {
      // try to find the user
      const user = await ctx.prisma.user
        // find a unique user
        .findUnique({
          // where the email matches the input email
          where: {
            email, 
          },
      })

      // if there is no such user, throw a not found error
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      } 

      // if there is a user, create a login token for them
      const token = await ctx.prisma.loginToken.create({
        data: {
          // provide the redirect link
          redirect,
          // connect the token to that specific user through a relation
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });

      // send email to user
      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
        email: user.email
      })

      return true;
    }
  })
  // verify the user's one time password
  .query('verify-otp', {
    input: verifyOtpSchema,
    async resolve({input, ctx}) {
      // decode the token
      // we encoded this by splitting with a colon, so we need to split with
      // a colon
      const decoded = decode(input.hash).split(":");
      const [id, email] = decoded; // destructure array

      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id, // id == id
          user: {
            email,
          }
        },
        // because users are joined to tokens, we can get the user as well
        include: {
          user: true,
        }
      });

      // if we can't find the token
      if (!token) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid token'
        })
      };

      // if there is a token, sign it for sending it over the wire
      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      /* create a cookie for the browser to save the signed token
      Response.setHeader is for creating the header of the html file when sending it to users.
      For this setHeader, we are specifying that we want to set the cookie of the header, which 
      will either create a new cookie of that type or change the existing one. For the cookie,
      we are passing in a serialize from the cookie package which arranges a cookie name-value pair
      into a Set-Cookie header string. This line is using name: 'token', value: 'jwt', and also 
      has an object designating additional options, which in this case is the default path: '/'
      https://github.com/jshttp/cookie#cookieserializename-value-options
      */
      ctx.res.setHeader('Set-Cookie', serialize('token', jwt, {path: '/'}))

      return {
        redirect: token.redirect, // tells client where to redirect to
      }

    }
  })
  // get the current user
  .query('me', {
    resolve({ctx}) {
      return ctx.user;
    }
  })