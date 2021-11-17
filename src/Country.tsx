import { Link } from "react-location";
import "./App.css";
import { QueryConfig } from "./query-config";
import { SmartComponent } from "./types";

const fetchLabel = "country";

type Params = {
  name: string;
};

const Config = QueryConfig<Params, Data[], Data>({
  queryToken: (args) => [fetchLabel, args.name],
  url: (args) => {
    console.log(window.location);
    return `https://restcountries.com/v3.1/name/${args.name}`;
  },
  transform: (e) => e[0],
});

type Data = {
  name: {
    common: string;
    official: string;
  };
};

const Country: SmartComponent = () => {
  const match = Config.useParams();
  const result = Config.useData(match);

  if (result.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (result.error) {
    return (
      <h1 style={{ color: "red" }}>Error {JSON.stringify(result.error)}</h1>
    );
  }
  const data = result.data!;
  return (
    <div>
      <h1>{data.name.official}</h1>
      <h3>
        <Link
          onClick={() => result.refetch()}
          to={`/country/${data.name.common.toLowerCase()}?test=${Math.random()}`}
        >
          Add QueryString
        </Link>
      </h3>
      <Link to="/">Root</Link>
      {" | "}
      <Link to="/test">Countries</Link>
    </div>
  );
};

Country.prefetch = Config.prefetch;
Country.getFetchLabel = Config.getFetchLabel;
export default Country;
