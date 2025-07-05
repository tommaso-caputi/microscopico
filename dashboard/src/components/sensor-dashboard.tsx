"use client"

import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { sensorItems, type SensorData, type SensorGroup } from "@/types/sensor"
import { getGroupOverallStatus, getStatusColor, getStatusBadgeText, getConnectionStatusColor, getConnectionStatusText, formatLastUpdate, generateRandomSensorData } from "@/utils/sensor-utils"

// Debug mode from environment variable
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG === 'true'

// Dati mock dei sensori con la nuova struttura
const initialSensorGroups: SensorGroup[] = [
    {
        id: "gruppo-1",
        name: "Arduino 1",
        status: "offline",
        lastUpdate: null,
        data: null,
    }
]

interface SensorDashboardProps {
    isOpen: boolean
    onToggle: () => void
}

export default function SensorDashboard({ isOpen, onToggle }: SensorDashboardProps) {
    const [selectedSensor, setSelectedSensor] = useState<string | null>(null)
    const [sensorGroups, setSensorGroups] = useState<SensorGroup[]>(initialSensorGroups)

    useEffect(() => {
        const socket: Socket = io('https://panda-solid-globally.ngrok-free.app');

        socket.on('arduino-data', (msg: SensorData) => {
            // Update the first group with real socket data
            setSensorGroups(prevGroups => {
                const updatedGroups = [...prevGroups];
                if (updatedGroups[0]) {
                    updatedGroups[0] = {
                        ...updatedGroups[0],
                        data: msg,
                        lastUpdate: new Date(),
                        status: "online"
                    };
                }
                return updatedGroups;
            });
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
            // Mark first group as offline when disconnected
            setSensorGroups(prevGroups => {
                const updatedGroups = [...prevGroups];
                if (updatedGroups[0]) {
                    updatedGroups[0] = {
                        ...updatedGroups[0],
                        status: "offline"
                    };
                }
                return updatedGroups;
            });
        });

        // Debug mode: generate random data for the first group only
        if (DEBUG_MODE) {
            const debugInterval = setInterval(() => {
                setSensorGroups(prevGroups => {
                    const updatedGroups = [...prevGroups];
                    if (updatedGroups[0]) {
                        updatedGroups[0] = {
                            ...updatedGroups[0],
                            data: generateRandomSensorData(),
                            lastUpdate: new Date(),
                            status: "online"
                        };
                    }
                    return updatedGroups;
                });
            }, 5000); // Update every 5 seconds

            return () => {
                clearInterval(debugInterval);
                socket.disconnect();
            };
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    // Calcola le statistiche
    const allSensorReadings = sensorGroups.flatMap((group) =>
        group.data ? sensorItems.map((item) => item.getStatus(group.data as SensorData)) : []
    )

    const normalCount = allSensorReadings.filter((status) => status === "normale").length
    const warningCount = allSensorReadings.filter((status) => status === "attenzione").length
    const criticalCount = allSensorReadings.filter((status) => status === "critico").length

    return (
        <>
            {/* Toggle Button */}
            <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-[1000] bg-background shadow-md"
                onClick={onToggle}
            >
                {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>

            {/* Sidebar Dashboard */}
            <div
                className={`${isOpen ? "w-96" : "w-0"} transition-all duration-300 bg-background border-l flex flex-col h-full`}
            >
                {/* Fixed Header */}
                <div className="p-4 border-b bg-background flex-shrink-0">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="w-6 h-6" />
                        Dashboard Microscopico
                    </h1>
                </div>

                {/* Scrollable Content Area */}
                <ScrollArea className="flex-1 h-full overflow-hidden">
                    <div className="p-4 space-y-4 pb-4">
                        {sensorGroups.map((group) => {
                            const hasData = group.data !== null
                            const overallStatus = hasData ? getGroupOverallStatus(group.data as SensorData) : "normale"
                            return (
                                <Card key={group.id} className="border-2">
                                    <CardHeader className="">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <div
                                                    className={`w-4 h-4 rounded-full ${overallStatus === "critico"
                                                        ? "bg-red-500"
                                                        : overallStatus === "attenzione"
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                        }`}
                                                />
                                                {group.name}
                                            </CardTitle>
                                            <Badge className={`${getConnectionStatusColor(group.status)} border`}>
                                                {getConnectionStatusText(group.status)}
                                            </Badge>
                                        </div>
                                        {hasData && (
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">
                                                    Ultimo aggiornamento: {group.lastUpdate ? formatLastUpdate(group.lastUpdate) : "Mai"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {group.lastUpdate?.toLocaleTimeString("it-IT", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {hasData ? (
                                            sensorItems.map((sensor) => {
                                                const IconComponent = sensor.icon
                                                const sensorId = `${group.id}-${sensor.key}`
                                                const value = sensor.getValue(group.data as SensorData)
                                                const status = sensor.getStatus(group.data as SensorData)

                                                return (
                                                    <div
                                                        key={sensorId}
                                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted hover:shadow-md ${selectedSensor === sensorId ? "bg-muted border-primary shadow-md" : "border-border"
                                                            }`}
                                                        onClick={() => setSelectedSensor(sensorId)}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <IconComponent className={`w-4 h-4 ${sensor.color}`} />
                                                                <span className="font-medium text-sm">{sensor.name}</span>
                                                            </div>
                                                            <Badge className={getStatusColor(status)}>{getStatusBadgeText(status)}</Badge>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold">{value}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="p-6 text-center">
                                                <p className="text-muted-foreground text-sm">Nessun dato disponibile</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>

                {/* Fixed Footer with Statistics */}
                <div className="p-4 border-t bg-muted/30 flex-shrink-0 mt-auto">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xs text-muted-foreground">Normale</p>
                            <p className="text-lg font-bold text-green-600">{normalCount}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Attenzione</p>
                            <p className="text-lg font-bold text-yellow-600">{warningCount}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Critico</p>
                            <p className="text-lg font-bold text-red-600">{criticalCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
