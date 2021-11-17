import axios from "axios";
import { Link, useLocation } from "react-location";
import { useQuery } from "react-query";
import "./App.css";
import { SmartComponent } from "./types";

const fetchLabel = "countries";

export const prefetch = async (args: any) => {
  const response = await axios.get("https://restcountries.com/v3.1/all");
  return response.data;
};

const useCountries = () => useQuery<any[], any>(fetchLabel, prefetch);

const Test: SmartComponent = () => {
  const { data, isLoading } = useCountries();
  const location = useLocation();

  if (isLoading && !data) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="App">
      <h1>ALl Countries</h1>
      <button onClick={() => location.history.back()}>Back</button>
      <Link to="/">GoTo</Link>
      {data?.map((x) => (
        <Link
          to={`/country/${x.name.common.toLowerCase()}`}
          style={{ display: "block" }}
          key={x.name.official}
        >
          {x.name.official}
        </Link>
      ))}
    </div>
  );
};

Test.prefetch = prefetch;

Test.getFetchLabel = () => fetchLabel;

export default Test;
