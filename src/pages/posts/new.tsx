import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/posts.schema";
import { trpc } from "../../utils/trpc";

function CreatePostPage() {
  const router = useRouter();
  const {handleSubmit, register} = useForm<CreatePostInput>();

  const { mutate, error } = trpc.useMutation(['posts.create-post'], {
    onSuccess({ id }) {
        router.push(`/posts/${id}`)
    }
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && error.message}

      <h1>Create posts</h1>

      <br />

      <input 
        type="text"
        placeholder="Your post title"
        {...register('title')}
      />

      <br />

      <textarea 
        placeholder="Your post body"
        {...register('body')}
      />

      <br />

      <button>Create post</button>

    </form>
  )

}

export default CreatePostPage;