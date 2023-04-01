export const GET_Request = async <T>(endpoint: string): Promise<T> => {
  const request = await fetch(endpoint);

  if (!request.ok) throw new Error("Something went wrong!");

  return (await request.json()) as T;
};
