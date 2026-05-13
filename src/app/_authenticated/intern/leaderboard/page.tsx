import { Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export default async function LeaderboardPage() {
  const session = await getSession();
  const currentUserId = session?.id as string;

  // Calculate scores dynamically based on approved tasks
  const internsWithScores = await prisma.user.findMany({
    where: { role: "INTERN", status: "APPROVED" },
    include: {
      internProfile: true,
      tasksReceived: {
        where: { status: "APPROVED" },
      },
    },
  });

  const leaderboardData = internsWithScores.map((intern) => {
    // Sum up the scores of approved tasks, or default to 10 points per approved task if score is null
    const score = intern.tasksReceived.reduce((acc, task) => acc + (task.score || 10), 0);
    return {
      id: intern.id,
      name: intern.name,
      initials: intern.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      domain: intern.internProfile?.preferredDomain || "General",
      score,
    };
  }).sort((a, b) => b.score - a.score);


  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Leaderboard</h1>
        <p className="text-slate-500">Live rankings across all TARCIN cohorts.</p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThree.map((user, index) => {
          const rank = index + 1;
          const isFirst = rank === 1;
          return (
            <div 
              key={user.id} 
              className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center ${
                isFirst 
                  ? "bg-[#0284c7] text-white shadow-md" 
                  : "bg-white border border-slate-200 text-slate-900 shadow-sm"
              }`}
            >
              <Trophy size={32} className={`mb-3 ${isFirst ? "text-white" : "text-amber-500"}`} />
              <p className={`text-xs font-bold tracking-wider mb-2 ${isFirst ? "text-blue-100" : "text-slate-400"}`}>
                RANK #{rank}
              </p>
              <h3 className="text-xl font-bold mb-1">{user.name}</h3>
              <p className={`text-sm mb-6 ${isFirst ? "text-blue-100" : "text-slate-500"}`}>
                {user.domain}
              </p>
              <p className="text-4xl font-bold">{user.score}</p>
            </div>
          );
        })}
      </div>

      {/* Rest of the Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {(topThree.length > 0 ? leaderboardData : []).map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-4 px-6 transition-colors hover:bg-slate-50 ${
                  isCurrentUser ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-sm font-semibold text-slate-500 w-4 text-center">{rank}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {user.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {user.name}
                        {isCurrentUser && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            (you)
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500">{user.domain}</p>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {user.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
