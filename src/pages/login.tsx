import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";
import dynamic from 'next/dynamic';

// using dynamic import so that login form is not rendered on the server
/* https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
By using this, with ssr: false, LoginForm will no longer be rendered on the server.
This is useful in this scenario because not including dynamic imports was causing
the code in the server and the code in the client to be different. To fix the issue,
we are having LoginForm be only rendered client-side. This issue occurs because 
we are using cookies in LoginForm, which only exist client-side.
*/
const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
})

function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default LoginPage;