import { lazy, StrictMode, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  DefaultGenerics,
  ReactLocation,
  Route,
  RouteMatch,
  Router,
} from "react-location";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { HttpClient } from "./http-client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const routeConfig = [
  {
    path: "/",
    element: () => import("./App"),
  },
  {
    path: "/test",
    element: () => import("./Test"),
  },
  {
    path: "/country/:name",
    element: () => import("./Country"),
  },
];

const reactLocation = new ReactLocation({});

const RouterConfig = () => {
  const [routes, setRoutes] = useState<Route<DefaultGenerics>[]>([]);
  useEffect(() => {
    const asyncTask = async () => {
      const loadedRoutes = await Promise.all(
        routeConfig.map(async (route): Promise<Route<DefaultGenerics>> => {
          const config = await route.element();
          const RC = config.default;
          const Component = lazy(async () => config);
          const loader: any = !!(RC.getFetchLabel && RC.prefetch)
            ? (args: RouteMatch<DefaultGenerics>) => {
                const label = RC.getFetchLabel!(args.params);
                return () =>
                  HttpClient.query(label) ??
                  HttpClient.fetch(label, RC.prefetch as never).then((e) => {});
              }
            : undefined;
          return {
            loader,
            path: route.path,
            element: <Component />,
          };
        })
      );
      setRoutes(loadedRoutes);
    };
    setRoutes([]);
    asyncTask();
  }, []);

  if (routes.length === 0) return null;
  return <Router location={reactLocation} routes={routes} useErrorBoundary />;
};

ReactDOM.render(
  <StrictMode>
    <Suspense fallback={<h1>Loading...</h1>}>
      <QueryClientProvider client={HttpClient.client}>
        <RouterConfig />
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </Suspense>
  </StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
