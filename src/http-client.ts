import { QueryClient } from "react-query";

const client = new QueryClient();

export const HttpClient = {
  client: client,
  query: client.getQueryData,
  fetch: client.fetchQuery,
};
