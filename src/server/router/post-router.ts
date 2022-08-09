import { TRPCError } from "@trpc/server";
import { connect } from "http2";
import { createPostSchema, getSinglePostSchema } from "../../schema/posts.schema";
import { createRouter } from "./context";

/* 
a router for handling queries/mutations that deal with posts
*/
export const postRouter = createRouter()
  /* 
  When creating a post, you want to make sure that the user is logged in prior to creating the post.
  One way to do that is through middleware (Option 1)
    not a good idea because we want logged out users to be able to view posts
  Another way is to add the functionality to the create-post resolver itself (Option 2)
    a better idea because this functionality will only be required for this one api call
  */
  // Opt 1
  // .middleware(async ({ctx}) => {
  //   if (!ctx.user) {
  //     // throw error
  //   }
  // })

  .mutation('create-post', {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      // Opt 2
      // if user is not logged in
      if (!ctx.user) {
        new TRPCError({
          code: 'FORBIDDEN',
          message: 'Can not a create a post while logged out'
        })
      } 

      // user is logged in, proceed to add post
    
      // this doesn't work for some reason...?
      // create a post  
      // const post = await ctx.prisma.post.create({
      //   data: {
      //     ...input,
      //     user: {
      //       connect: {
      //         id: ctx.user?.id
      //       }
      //     }
      //   }
      // });

      const userPost = await ctx.prisma.userPost.create({
        data: {
          ...input,
          authorId: ctx.user!.id,
        }
      })

      return userPost;
      

    }
  })
  .query('posts', {
    resolve({ ctx }) {
      return ctx.prisma.userPost.findMany();
    }
  })
  .query('single-post', {
    input: getSinglePostSchema,
    resolve({ input, ctx }) {
      return ctx.prisma.userPost.findUnique({
        where: {
          id: input.postId,
        }
      })
    }
  })