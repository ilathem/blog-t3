import Error from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

// single post page
function SinglePostPage() {
  const router = useRouter(); 

  // use router to get post id
  const postId = router.query.postId as string;

  // make api call to get post from db
  const { data, isLoading } = trpc.useQuery(['posts.single-post', { postId }])

  if (isLoading) {
    return (
      <>
        <p>Loading posts...</p>
      </>
    )
  }

  // if there is no post, post is not found
  if (!data) {
    return (
      <Error statusCode={404} />
    )
  }

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  )
}

export default SinglePostPage;