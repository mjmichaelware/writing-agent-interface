export async function POST() {
  return Response.json({
    results: [],
    status: "search_disabled_until_embedder_is_restored",
  });
}
