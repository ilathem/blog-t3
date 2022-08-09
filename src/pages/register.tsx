import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

function RegisterPage() {

  // using form validation library
  // https://react-hook-form.com/get-started
  const {handleSubmit, register} = useForm<CreateUserInput>();

  // get router to redirect user to login page after creating account
  const router = useRouter();

  // under the hood, trpc uses react query
  /* react query can either return mutate or mutate async, which will resolve on success
  or throw on error. If we use mutate async, we have to handle the errors ourselves, but if
  we use mutate, we can handle the success inside the mutate function
  https://react-query-v3.tanstack.com/guides/mutations#promises
  in most cases, we'll just want to use mutate, because we can just do onSuccess and onError
  */
  const {mutate, error} = trpc.useMutation(['users.register-user'], {
    // run when there's an error, don't need because errors will be handled
    // with the error object above
    // onError: (error) => {

    // },
    // run on success
    onSuccess: () => {
      // redirect or display messages

      // redirect user to login page
      router.push('/login');
    }
  })
  
  // run on form submit
  function onSubmit(values: CreateUserInput) {
    // call mutate with the values
    mutate(values);
  }

  return (
    <>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* if there's an error, display the error message */}
        { error && error.message}

        <h1>Register</h1>
        <input 
          type="email"
          placeholder="jane.doe@example.com"
          {...register('email')}
        />
        <br />
        <input 
          type="text"
          placeholder="Tom"
          {...register('name')}
        />
        <button
          type="submit"
        >
          Register
        </button>

      </form>

      <Link href="/login">
      Login
      </Link>

    </>
  )
}

export default RegisterPage;