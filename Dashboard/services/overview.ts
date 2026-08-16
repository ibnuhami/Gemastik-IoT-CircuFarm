import { MqttStatus, NodeStatusPayload, SystemAlertPayload } from "@/lib/mqtt/types";

export const overviewTelemetry = { sensorsOnline: 42, uptime: '98.4%', actuatorsActive: 3, alertsToday: 2 }
export const automationLog = ['Nutrient dosing adjusted in Greenhouse A', 'Aeration cycle completed in Aquaculture Tank', 'Moisture threshold reached in Compost Unit', 'Sensor network health check completed']

const statusStyles = {
    CONNECTED:
        "border-emerald-400/40 bg-emerald-400/5 text-emerald-400 shadow-[0_0_60px_rgba(52,211,153,0.15)]",
    CONNECTING:
        "border-amber-400/40 bg-amber-400/5 text-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.15)]",
    RECONNECTING:
        "border-amber-400/40 bg-amber-400/5 text-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.15)]",
    ERROR:
        "border-rose-500/40 bg-rose-500/5 text-rose-400 shadow-[0_0_60px_rgba(244,63,94,0.15)]",
    DISCONNECTED:
        "border-rose-500/40 bg-rose-500/5 text-rose-400 shadow-[0_0_60px_rgba(244,63,94,0.15)]",
};

export const getCurrentStyle = (status?: MqttStatus | string) => {
    return (
        statusStyles[status as keyof typeof statusStyles] ||
        statusStyles.DISCONNECTED
    );
};

export const getStatusConfig = (status?: MqttStatus | string) => {
    switch (status) {
        case 'CONNECTED':
            return {
                label: 'Connected',
                iconAnim: 'animate-pulse',
                style: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.15)]',
                canReconnect: false,
            };
        case 'CONNECTING':
        case 'RECONNECTING':
            return {
                label: status === 'CONNECTING' ? 'Connecting...' : 'Reconnecting...',
                iconAnim: 'animate-spin',
                style: 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]',
                canReconnect: false,
            };
        case 'ERROR':
        case 'DISCONNECTED':
        default:
            return {
                label: 'Coba Lagi',
                iconAnim: '',
                style: 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)] cursor-pointer active:scale-95',
                canReconnect: true,
            };
    }
};

// Calculating the number of online devices based on the nodeMessages received from MQTT
export const calculateOnlineDevices = (nodeMessages: Record<string, NodeStatusPayload>  | null | undefined): number => {
    try {
        let onlineNodes: number = 0;
        if(nodeMessages && typeof nodeMessages === 'object') {
            onlineNodes = Object.values(nodeMessages).filter((node) => node?.status === 'online').length;
        } else {
            console.warn("Unexpected nodeMessages format:", nodeMessages);
        }
        return onlineNodes;
    } catch (error) {
        console.error("Error calculating data online devices:", error);
        return 0; // Fallback ke 0 jika terjadi error
    }
}

export const calculateAlert = (alerts: SystemAlertPayload[] | Record<string, SystemAlertPayload> | null | undefined): number => {
    try {
        let alertCount: number = 0;
        if(alerts && typeof alerts === 'object') {
            alertCount = Object.values(alerts).length;
        } else {
            console.warn("Unexpected alerts format:", alerts);
        }
        return alertCount;
    } catch (error) {
        console.error("Error calculating alert count:", error);
        return 0; // Fallback ke 0 jika terjadi error
    }
}