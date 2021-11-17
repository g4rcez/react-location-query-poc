import { useMatch } from "react-location";
import { useQuery } from "react-query";

type GetQueryToken<T extends {}> = (args: T) => string | string[];

type Dict = Record<string, string>;

class NetworkQueryError extends Error {
  public code: string;
  public status: string;
  constructor(message: string) {
    super(message);
    this.code = "";
    this.status = "";
  }
}

export const QueryConfig = <
  Params = Dict,
  Response = unknown,
  Data = unknown
>(props: {
  url: (params: Params) => string;
  queryToken: GetQueryToken<Params>;
  transform: (response: Response) => Data;
}) => {
  const prefetch = (params: Params) => {
    const url = props.url(params);
    return fetch(url)
      .then((e) => {
        if (!e.ok) {
          const error = new NetworkQueryError(
            `Status ${e.status} on request ${url}`
          );
          error.code = "404";
          error.status = "NotFound";
          throw error;
        }
        try {
          return e.json();
        } catch (error) {
          throw error;
        }
      })
      .then((e) => props.transform(e));
  };
  return {
    prefetch,
    getFetchLabel: props.queryToken,
    useParams: () => useMatch<Params>().params as unknown as Params,
    useData: (params: Params) =>
      useQuery<Data, any>(props.queryToken(params), () => prefetch(params), {
        retry: (fails, error) => {
          if (error.code === "404") return false;
          console.log({ fails, error });
          return true;
        },
      }),
  };
};
