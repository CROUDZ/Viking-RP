// src/app/api/players/route.ts (si tu utilises Next.js 13+)
export async function GET() {
  const res = await fetch("https://api.mcsrvstat.us/2/play.example.com");
  const data = await res.json();
  return Response.json({
    onlinePlayers: data.players?.online ?? 0,
    maxPlayers: data.players?.max ?? 0,
  });
}
