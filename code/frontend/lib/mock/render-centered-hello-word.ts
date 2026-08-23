type GreetingResponse = {
  text: string;
};

export async function getGreeting(): Promise<GreetingResponse> {
  const state = process.env.NEXT_PUBLIC_MOCK_GREETING_STATE ?? "loaded";

  await Promise.resolve();

  if (state === "error") {
    throw new Error("greeting unavailable");
  }

  if (state === "empty") {
    return { text: "" };
  }

  return { text: "Hello Word" };
}
