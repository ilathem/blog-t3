import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

// verify the hash in the url
function VerifyToken({hash}:{hash:string}) {
  // for redirecting the user
  const router = useRouter();
  // send to backend
  const {data, isLoading} = trpc.useQuery(['users.verify-otp', {hash}])

  // while loading, tell the user
  if (isLoading) {
    return <p>Verifying...</p>
  }

  // redirect the user (home is '/')
  // if the redirect link has login inside of it, redirect them back to the home,
  // otherwise, redirect them back to the link given, or home if it's null
  router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/');

  return <p>Redirecting...</p>

  
}

function LoginForm() {

  // using form validation library
  // https://react-hook-form.com/get-started
  const {handleSubmit, register} = useForm<CreateUserInput>();

  const [success, setSuccess] = useState(false)

  // get router to redirect user to login page after creating account
  const router = useRouter();

  // under the hood, trpc uses react query
  /* react query can either return mutate or mutate async, which will resolve on success
  or throw on error. If we use mutate async, we have to handle the errors ourselves, but if
  we use mutate, we can handle the success inside the mutate function
  https://react-query-v3.tanstack.com/guides/mutations#promises
  in most cases, we'll just want to use mutate, because we can just do onSuccess and onError
  */
  const {mutate, error} = trpc.useMutation(['users.request-otp'], {
    // run when there's an error, don't need because errors will be handled
    // with the error object above
    // onError: (error) => {

    // },
    // run on success
    onSuccess: () => {
      // ex: redirect or display messages
      // set success to true
      setSuccess(true);
    }
  })
  
  // run on form submit
  function onSubmit(values: CreateUserInput) {
    // call mutate with the values
    // using redirect: router.asPath allows us to login from any page and then get
    // redirected back to that page
    mutate({
      ...values, // keep all other values in the object, except for what we're specifying
      redirect: router.asPath // save current path so that we can go back to it after clicking the link in the email
    });
  }

  // get the hash out of the url
  const hash = router.asPath.split('#token=')[1]

  // if there is a hash
  if (hash) {
    // tell the user that we are verifying their hash
    return <VerifyToken hash={hash}/>
  }

  return (
    <>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* if there's an error, display the error message */}
        { error && error.message}
        { success && <p>Check your email</p>}
        <h1>Login</h1>
        <input 
          type="email"
          placeholder="jane.doe@example.com"
          {...register('email')}
        />
        <button>Login</button>
        <button type="submit">Register</button>

      </form>

      <Link href="/register">
      Register
      </Link>

    </>
  )
}

export default LoginForm;