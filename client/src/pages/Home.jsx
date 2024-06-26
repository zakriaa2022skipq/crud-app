import { useEffect, useState } from "react";
import { toast } from "sonner";
import PostCard from "../components/PostCard";
import { useInView } from "react-intersection-observer";
import axios from "@/src/util/axios";
import { useInfiniteQuery } from "react-query";
import { LoadingSpinner } from "@/components/ui/loadingspinner";
import Navbar from "../components/Navbar";

const Home = () => {
  const postLimit = 5;
  const { ref, inView } = useInView();
  const [errMessage, setErrMessage] = useState("");
  const fetchPosts = (pageParam) =>
    axios
      .get(`api/v1/post/all?limit=${postLimit}&page=${pageParam}`, {
        withCredentials: true,
      })
      .then((response) => response.data.posts);

  const {
    data,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    refetch,
  } = useInfiniteQuery(
    "user-posts",
    ({ pageParam = 0 }) => fetchPosts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === postLimit ? allPages.length : undefined;
        return nextPage;
      },
      onError: (error) => {
        if (error.response) {
          if (typeof error.response.data === "string") {
            setErrMessage(error.response.data);
          }
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
      },
    }
  );

  useEffect(() => {
    if (isError) {
      toast.error(errMessage);
    }
  }, [errMessage, isError]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const posts =
    isSuccess &&
    data.pages.map((page) =>
      page.map((post, index) =>
        index + 1 === page.length ? (
          <PostCard ref={ref} post={post} key={post._id} refetch={refetch} />
        ) : (
          <PostCard post={post} key={post._id} refetch={refetch} />
        )
      )
    );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col mx-auto gap-2">{posts}</div>
      {isSuccess && data?.pages[0].length === 0 && !isFetching && (
        <p className="text-xl text-center text-[hsl(180, 55%, 38%)] mx-auto max-w-[80vw]">
          You have not created any posts!!
        </p>
      )}
      {(isFetching || isFetchingNextPage) && (
        <LoadingSpinner className={"mx-auto my-5"} size={40} />
      )}
      {!isFetching &&
        !isFetchingNextPage &&
        !hasNextPage &&
        data?.pages[0].length > 0 && (
          <p className="my-3">You have reached the end</p>
        )}
    </div>
  );
};
export default Home;
