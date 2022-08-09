import z from 'zod'

// schema for defining input/output for post queries/mutations


// input schema for creating posts
export const createPostSchema = z.object({
  title: z.string().max(256, 'Max title length is 256'),
  body: z.string().min(10),
})

export type CreatePostInput = z.TypeOf<typeof createPostSchema>



// schema for getting a single post by id
export const getSinglePostSchema = z.object({
  postId: z.string().uuid()
})

export type GetSinglePostInput = z.TypeOf<typeof getSinglePostSchema>