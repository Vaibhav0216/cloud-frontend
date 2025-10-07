// "use client";

// import ProtectedRoute from "../components/ProtectedRoute";
// import React from "react";
// import { Shield, Zap, Activity } from "lucide-react";

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <main className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 px-4 py-10 text-white">
//         <div className="mx-auto w-full max-w-6xl">
//           <header className="mb-8">
//             <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//             <p className="mt-1 text-sm text-gray-300">Secure overview of your system.</p>
//           </header>

//           <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             {/* Energy Overview */}
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm transition hover:bg-white/10">
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="rounded-lg bg-emerald-500/20 p-2"><Zap className="h-5 w-5 text-emerald-400" /></div>
//                 <h2 className="text-lg font-semibold">Energy Overview</h2>
//               </div>
//               <div className="space-y-2 text-sm text-gray-300">
//                 <p>Total Power: <span className="font-semibold text-white">—</span></p>
//                 <p>Active Meters: <span className="font-semibold text-white">—</span></p>
//                 <p>Frequency: <span className="font-semibold text-white">—</span></p>
//               </div>
//             </div>

//             {/* Pump Control */}
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm transition hover:bg-white/10">
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="rounded-lg bg-blue-500/20 p-2"><Activity className="h-5 w-5 text-blue-400" /></div>
//                 <h2 className="text-lg font-semibold">Pump Control</h2>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">Start</button>
//                 <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500">Stop</button>
//               </div>
//               <p className="mt-3 text-sm text-gray-300">Status: <span className="font-semibold text-white">—</span></p>
//             </div>

//             {/* System Health */}
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm transition hover:bg-white/10">
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="rounded-lg bg-amber-500/20 p-2"><Shield className="h-5 w-5 text-amber-400" /></div>
//                 <h2 className="text-lg font-semibold">System Health</h2>
//               </div>
//               <ul className="space-y-2 text-sm text-gray-300">
//                 <li>Uptime: <span className="font-semibold text-white">—</span></li>
//                 <li>Alerts: <span className="font-semibold text-white">—</span></li>
//                 <li>Connectivity: <span className="font-semibold text-white">—</span></li>
//               </ul>
//             </div>
//           </section>
//         </div>
//       </main>
//     </ProtectedRoute>
//   );
// }
