"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { sensorItems, type SensorData, type SensorGroup } from "@/types/sensor"
import { getGroupOverallStatus, getStatusColor, getStatusBadgeText, getConnectionStatusColor, getConnectionStatusText, formatLastUpdate } from "@/utils/sensor-utils"

interface SensorDashboardProps {
    isOpen: boolean
    onToggle: () => void
    sensorGroups: SensorGroup[]
}

export default function SensorDashboard({ isOpen, onToggle, sensorGroups }: SensorDashboardProps) {
    const [selectedSensor, setSelectedSensor] = useState<string | null>(null)

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
                onClick={onToggle}
                className="fixed top-4 right-4 z-[9999] bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg border"
                size="sm"
            >
                {isOpen ? <ChevronRight className="w-4 h-4 text-black" /> : <ChevronLeft className="w-4 h-4 text-black" />}
            </Button>

            {/* Dashboard Panel */}
            <div
                className={`fixed top-0 right-0 h-full bg-white/95 backdrop-blur-sm shadow-xl border-l transition-transform duration-300 ease-in-out z-[9998] ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{ width: "400px" }}
            >
                {/* Header */}
                <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Dashboard Microscopico</h2>
                        </div>
                        {/* <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-muted-foreground">{normalCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-xs text-muted-foreground">{warningCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-xs text-muted-foreground">{criticalCount}</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 overflow-hidden">
                        <div className="p-4 space-y-4 pb-20">
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
                    <div className="p-4 border-t bg-muted/30 flex-shrink-0 sticky bottom-0">
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
            </div>
        </>
    )
}
