'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableCaption,
} from '../components/ui/table';
import { User as UserIcon, Clock, LogIn, LogOut } from 'lucide-react';

type LogAction = 'Login' | 'Logout' | 'Failed Attempt';
type LogStatus = 'Success' | 'Failed';

interface UserLogItem {
	id: number;
	userName: string;
	loginTime: string;
	action: LogAction;
	status: LogStatus;
}

function UserLogContent() {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const { user } = useAuth();
	const { isConnected } = useWebSocket();

	// Placeholder admin check
	const isAdmin = true;

	const [logs] = useState<UserLogItem[]>([
		{ id: 1, userName: 'Alice Johnson', loginTime: '2025-09-18 08:12:45', action: 'Login', status: 'Success' },
		{ id: 2, userName: 'Bob Smith', loginTime: '2025-09-18 08:30:10', action: 'Failed Attempt', status: 'Failed' },
		{ id: 3, userName: 'Charlie Lee', loginTime: '2025-09-18 09:05:03', action: 'Login', status: 'Success' },
		{ id: 4, userName: 'Bob Smith', loginTime: '2025-09-18 12:01:27', action: 'Logout', status: 'Success' },
	]);

	if (!user) return null;

	return (
		<div className="flex h-screen bg-sidebar text-foreground">
			<Sidebar
				isCollapsed={isSidebarCollapsed}
				onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
			/>
			<div
				className={`flex-1 flex flex-col transition-all duration-300 ${
					isSidebarCollapsed ? 'ml-16' : 'ml-64'
				}`}
			>
				<TopNavbar
					user={{ name: user.name, role: user.role, company: user.company }}
					isConnected={isConnected}
				/>
				<main className="flex-1 p-6 overflow-auto">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold">User Logs</h1>
						</div>

						{!isAdmin ? (
							<Card>
								<CardContent className="py-10">
									<p className="text-center text-muted-foreground">Access Denied</p>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<CardTitle>Recent User Activity</CardTitle>
								</CardHeader>
								<CardContent>
									<Table>
										<TableCaption>Authentication events recorded by the system.</TableCaption>
										<TableHeader>
											<TableRow>
												<TableHead>Sr No</TableHead>
												<TableHead>User Name</TableHead>
												<TableHead>Log In Time</TableHead>
												<TableHead>Action</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{logs.map((log) => (
												<TableRow key={log.id} className="hover:shadow-sm">
													<TableCell className="font-medium">{log.id}</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<UserIcon size={16} className="text-muted-foreground" />
															<span>{log.userName}</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Clock size={16} className="text-muted-foreground" />
															<span>{log.loginTime}</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															{log.action === 'Logout' ? (
																<LogOut size={16} className="text-blue-500" />
															) : (
																<LogIn size={16} className={log.action === 'Failed Attempt' ? 'text-red-500' : 'text-green-500'} />
															)}
															<span>{log.action}</span>
														</div>
													</TableCell>
													<TableCell>
														{log.status === 'Success' ? (
															<Badge variant="success">Success</Badge>
														) : (
															<Badge variant="destructive">Failed</Badge>
														)}
													</TableCell>
											</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

export default function UserLogPage() {
	return (
		<ProtectedRoute>
			<UserLogContent />
		</ProtectedRoute>
	);
}


