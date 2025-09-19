'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '../components/ui/table';
import { AlertTriangle, XCircle } from 'lucide-react';

type AlertType = 'Warning' | 'Critical';

interface AlertItem {
	id: number;
	name: string;
	description: string;
	time: string;
	type: AlertType;
	acknowledged: boolean;
}

function AlertsContent() {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const { user } = useAuth();
	const { isConnected } = useWebSocket();

	const [alerts, setAlerts] = useState<AlertItem[]>([
		{
			id: 1,
			name: 'Pump Overload',
			description: 'Current draw exceeded safe threshold for 10s',
			time: '2025-09-18 10:22:14',
			type: 'Warning',
			acknowledged: false,
		},
		{
			id: 2,
			name: 'Tank Level Critical',
			description: 'Level dropped below 10% of capacity',
			time: '2025-09-18 09:58:03',
			type: 'Critical',
			acknowledged: true,
		},
		{
			id: 3,
			name: 'Flow Sensor Fault',
			description: 'Intermittent sensor readings detected',
			time: '2025-09-18 09:41:27',
			type: 'Warning',
			acknowledged: false,
		},
		{
			id: 4,
			name: 'Valve Failure',
			description: 'Actuator did not reach commanded position',
			time: '2025-09-18 08:35:49',
			type: 'Critical',
			acknowledged: false,
		},
	]);

	const handleAcknowledge = (id: number) => {
		setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
	};

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
							<h1 className="text-3xl font-bold">System Alerts</h1>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Active and Historical Alerts</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Sr No</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Description Message</TableHead>
											<TableHead>Time</TableHead>
											<TableHead>Alert Type</TableHead>
											<TableHead>Acknowledgement</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{alerts.map((alert) => {
											const isCritical = alert.type === 'Critical';
											return (
												<TableRow key={alert.id} className="hover:shadow-sm">
													<TableCell className="font-medium">{alert.id}</TableCell>
													<TableCell>{alert.name}</TableCell>
													<TableCell className="text-muted-foreground">{alert.description}</TableCell>
													<TableCell>{alert.time}</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															{isCritical ? (
																<XCircle size={18} className="text-red-500" />
															) : (
																<AlertTriangle size={18} className="text-yellow-500" />
															)}
															<Badge className={isCritical ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-yellow-500 text-white hover:bg-yellow-600'}>
																{alert.type}
															</Badge>
														</div>
													</TableCell>
													<TableCell>
														{alert.acknowledged ? (
															<Badge variant="success">Acknowledged</Badge>
														) : (
															<Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
																Acknowledge
															</Button>
														)}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function AlertsPage() {
	return (
		<ProtectedRoute>
			<AlertsContent />
		</ProtectedRoute>
	);
}


