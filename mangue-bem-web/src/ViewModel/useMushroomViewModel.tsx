import axios from "axios";
import { Mushroom } from "../Model/MushroomData";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Page {
  content: Mushroom[];
  pagination: {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
  };
}

const getMushrooms = async (pageParam: number): Promise<Page | undefined> => {
  const iNaturalistTaxaUrl = "https://api.inaturalist.org/v1/taxa/";
  const baseUrl = "http://localhost:8080/v1/species";
  try {
    const speciesReponse = await axios.get(baseUrl, {
      params: { page: pageParam },
    });
    const mushroomData = speciesReponse.data;

    let mushroomIds = "";

    mushroomIds = encodeURIComponent(
      mushroomData.content
        .map((e: any) => e.inaturalistId)
        .filter((id: string) => id !== "")
        .join(","),
    );

    const inaturalistResponse = await axios.get(
      iNaturalistTaxaUrl + mushroomIds,
    );

    inaturalistResponse.data.results.sort((a: any, b: any) => a.id - b.id);
    mushroomData.content.sort(
      (a: any, b: any) => a.inaturalistId - b.inaturalistId,
    );

    for (let i = 0; i < inaturalistResponse.data.results.length; i++) {
      mushroomData.content[i].taxaPhoto =
        inaturalistResponse.data.results[i].default_photo?.medium_url;
    }
    return mushroomData;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const useGetMushroomData = (): [
  (Page | undefined)[] | undefined,
  () => void,
  boolean,
] => {
  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["mushrooms"],
    queryFn: ({ pageParam = 0 }) => getMushrooms(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNext
        ? lastPage?.pagination?.pageNumber + 1
        : undefined;
    },
  });

  const mushroomList = data?.pages;

  return [mushroomList, fetchNextPage, isFetchingNextPage];
};
export default useGetMushroomData;
