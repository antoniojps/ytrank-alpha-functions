interface MapResponseParams<T = Record<string, unknown>> {
  status?: number;
  data?: T;
  error?: Error;
}

interface FunctionResponse<T = Record<string, unknown>>
  extends Record<string, unknown> {
  data?: T;
  error?: string;
}

const config = {
  headers: {
    "content-type": "application/json",
  },
};

const getError = (error?: Error) => {
  if (typeof error === "undefined") return {};
  const message = "message" in error ? error.message : "Something went wrong";
  return {
    error: message,
  };
};

const getData = <T = Record<string, unknown>>(data?: T) => {
  if (typeof data === "undefined") return {};
  return {
    data,
  };
};

export const mapResponse = <T = Record<string, unknown>>({
  status = 200,
  data,
  error,
}: MapResponseParams<T>): FunctionResponse<T> => {
  return {
    status: status,
    body: {
      ...getError(error),
      ...getData(data),
    },
    ...config,
  };
};
