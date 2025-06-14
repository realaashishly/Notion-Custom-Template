import React, { useState, useEffect, useCallback } from "react";

interface TimeZone {
    name: string;
    zone: string;
    label: string;
}

interface ClockProps {
    timezone: TimeZone;
    time: Date;
}

const AnalogClock: React.FC<{ time: Date }> = ({ time }) => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = hours * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6;
    const secondAngle = seconds * 6;

    return (
        <div className='relative w-32 h-32 mx-auto mb-4'>
            <svg
                className='w-full h-full transform -rotate-90'
                viewBox='0 0 100 100'
            >
                {/* Clock face */}
                <circle
                    cx='50'
                    cy='50'
                    r='48'
                    fill='transparent'
                    stroke='rgba(255,255,255,0.3)'
                    strokeWidth='1'
                />

                {/* Hour markers */}
                {[...Array(12)].map((_, i) => {
                    const angle = i * 30;
                    const isMainHour = i % 3 === 0;
                    const radius = isMainHour ? 40 : 43;
                    const x1 =
                        50 + 45 * Math.cos(((angle - 90) * Math.PI) / 180);
                    const y1 =
                        50 + 45 * Math.sin(((angle - 90) * Math.PI) / 180);
                    const x2 =
                        50 + radius * Math.cos(((angle - 90) * Math.PI) / 180);
                    const y2 =
                        50 + radius * Math.sin(((angle - 90) * Math.PI) / 180);

                    return (
                        <line
                            key={`hour-marker-${i}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke='rgba(255,255,255,0.6)'
                            strokeWidth={isMainHour ? "2" : "1"}
                        />
                    );
                })}

                {/* Numbers */}
                {[12, 3, 6, 9].map((num) => {
                    const angle = (num === 12 ? 0 : num * 30) - 90;
                    const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                    const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);

                    return (
                        <text
                            key={`number-${num}`}
                            x={x}
                            y={y}
                            textAnchor='middle'
                            dominantBaseline='middle'
                            fill='rgba(255,255,255,0.8)'
                            fontSize='10'
                            className='transform rotate-90'
                            style={{ transformOrigin: `${x}px ${y}px` }}
                        >
                            {num}
                        </text>
                    );
                })}

                {/* Hour hand */}
                <line
                    x1='50'
                    y1='50'
                    x2={50 + 30 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
                    y2={50 + 30 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
                    stroke='white'
                    strokeWidth='3'
                    strokeLinecap='round'
                />

                {/* Minute hand */}
                <line
                    x1='50'
                    y1='50'
                    x2={
                        50 + 40 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)
                    }
                    y2={
                        50 + 40 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)
                    }
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                />

                {/* Second hand */}
                <line
                    x1='50'
                    y1='50'
                    x2={
                        50 + 45 * Math.cos(((secondAngle - 90) * Math.PI) / 180)
                    }
                    y2={
                        50 + 45 * Math.sin(((secondAngle - 90) * Math.PI) / 180)
                    }
                    stroke='red'
                    strokeWidth='1'
                    strokeLinecap='round'
                />

                {/* Center dot */}
                <circle cx='50' cy='50' r='3' fill='white' />
            </svg>

            {/* AM/PM indicator */}
            <div className='absolute top-5 left-1/2 transform -translate-x-1/2 mt-2'>
                <span className='text-sm text-white/60'>
                    {time.getHours() >= 12 ? "PM" : "AM"}
                </span>
            </div>
        </div>
    );
};

const Clock: React.FC<ClockProps> = ({ timezone, time }) => {
    const formatTime = useCallback(
        (date: Date): string => {
            try {
                return date.toLocaleTimeString("en-US", {
                    timeZone: timezone.zone,
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
            } catch (error) {
                console.error(
                    `Error formatting time for ${timezone.name}:`,
                    error
                );
                return "Invalid Time";
            }
        },
        [timezone]
    );

    return (
        <div className='flex flex-col items-center text-white'>
            <AnalogClock time={time} />
            <div className='text-center'>
                <div className='text-base font-medium text-white/80 mb-1'>
                    {timezone.label}
                </div>
                <div className='text-3xl font-mono font-bold'>
                    {formatTime(time)}
                </div>
            </div>
        </div>
    );
};

const WorldClock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    const timezones: TimeZone[] = [
        { name: "IST", zone: "Asia/Kolkata", label: "India (IST)" },
        { name: "GMT", zone: "Europe/London", label: "London (GMT)" },
        { name: "UTC", zone: "UTC", label: "UTC" },
        { name: "New York", zone: "America/New_York", label: "New York (EST)" },
        { name: "Dubai", zone: "Asia/Dubai", label: "Dubai (GST)" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getTimeForZone = useCallback((timezone: string): Date => {
        try {
            const time = new Date(
                new Date().toLocaleString("en-US", { timeZone: timezone })
            );
            return isNaN(time.getTime()) ? new Date() : time;
        } catch (error) {
            console.error(`Error getting time for ${timezone}:`, error);
            return new Date();
        }
    }, []);

    return (
        <div className='min-h-screen bg-zinc-950 p-8'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-light text-white text-center mb-12 tracking-widest'>
                    WORLD CLOCK
                </h1>

                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center'>
                    {timezones.map((timezone) => (
                        <div key={timezone.name} className='w-full max-w-xs'>
                            <Clock
                                timezone={timezone}
                                time={getTimeForZone(timezone.zone)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorldClock;
