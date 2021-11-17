import React from "react";

export type SmartComponent<T = unknown> = React.FC<T> & {
  prefetch?: (params: any) => Promise<any>;
  getFetchLabel?: (params: any) => string | string[];
};
