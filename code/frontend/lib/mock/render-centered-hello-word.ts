type GreetingResponse = {
  text: string;
};

export async function getGreeting(): Promise<GreetingResponse> {
  if (process.env.NEXT_PUBLIC_MOCK_GREETING_STATE === "error") {
    throw new Error("greeting unavailable");
  }

  return {
    text:
      process.env.NEXT_PUBLIC_MOCK_GREETING_STATE === "empty"
        ? ""
        : "Hello Word",
  };
}
