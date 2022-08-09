// import validation library with typescript
import { z } from 'zod';

// for validating input/output

export const createUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  // for optional, use .optional() at the end
})


export const createUserOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})


// creates better intellisense

// used to type the user input in the form in register.tsx
export type CreateUserInput = z.TypeOf<typeof createUserInputSchema>
export type CreateUserOutput = z.TypeOf<typeof createUserOutputSchema>

// export the otp schema
export const requestOtpSchema = z.object({
  // email is required
  email: z.string().email(),
  // redirect is required
  redirect: z.string().default('/'),
})

// also need to make a type for otp 
export type requestOtpInput = z.TypeOf<typeof requestOtpSchema>


export const verifyOtpSchema = z.object({
  hash: z.string(),
})