type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
};

const resolveErrorMessage = (response: ServiceResponse<unknown>) => {
  if (typeof response.error === "string") {
    return response.error;
  }

  if (
    response.error &&
    typeof response.error === "object" &&
    "message" in response.error &&
    typeof (response.error as { message?: unknown }).message === "string"
  ) {
    return (response.error as { message: string }).message;
  }

  return response.message || "Request failed";
};

export const unwrapServiceResponse = <T>(response: ServiceResponse<T>): T => {
  if (!response.success) {
    throw new Error(resolveErrorMessage(response));
  }

  if (response.data === undefined) {
    throw new Error("No data returned from server");
  }

  return response.data;
};
