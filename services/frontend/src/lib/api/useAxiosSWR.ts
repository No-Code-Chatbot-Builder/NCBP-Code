import useSWR from "swr";
import { apiClient } from "./apiService";

interface DataFetch {
  data: any;
  error: any;
  isLoading: boolean;
}

export const fetcher = (url: string) => apiClient.get(url).then((res) => res);

export const useAxiosSWR = (url: string, params?: any): DataFetch => {
  const paramString = params
    ? Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&")
    : "";

  const fullUrl = paramString ? `${url}?${paramString}` : url;
  console.log("UseAxiosSWR called with URL:", fullUrl);

  const { data, error } = useSWR(fullUrl, fetcher);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
};
