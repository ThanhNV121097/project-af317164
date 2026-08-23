type GreetingResponse = {
  text: string;
};

export async function getGreeting(): Promise<GreetingResponse> {
  if (process.env.NEXT_PUBLIC_MOCK_GREETING_STATE === "error") {
    throw new Error("greeting unavailable");
  }

  await new Promise((resolve) => setTimeout(resolve, 0));

  return {
    text:
      process.env.NEXT_PUBLIC_MOCK_GREETING_STATE === "empty"
        ? ""
        : "Hello Word",
  };
}
