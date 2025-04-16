"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, Activity, Droplets, Thermometer, Fish, BarChart3, Waves, Gauge } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DonutChart } from "@/components/donut-chart"
import { CombinedChart } from "@/components/combined-chart"

// Mock data for fisheries sensors
const sensorData = [
  { id: 1, name: "Kolam 1", type: "Suhu Air", value: "28.5°C", status: "normal" },
  { id: 2, name: "Kolam 2", type: "Suhu Air", value: "27.9°C", status: "normal" },
  { id: 3, name: "Kolam 3", type: "Suhu Air", value: "29.1°C", status: "warning" },
  { id: 4, name: "Kolam 1", type: "pH Air", value: "7.2", status: "normal" },
  { id: 5, name: "Kolam 2", type: "pH Air", value: "6.8", status: "warning" },
  { id: 6, name: "Kolam 3", type: "pH Air", value: "7.5", status: "normal" },
  { id: 7, name: "Kolam 1", type: "Oksigen Terlarut", value: "6.8 mg/L", status: "normal" },
  { id: 8, name: "Kolam 2", type: "Oksigen Terlarut", value: "5.9 mg/L", status: "warning" },
  { id: 9, name: "Kolam 3", type: "Oksigen Terlarut", value: "7.1 mg/L", status: "normal" },
]

// Mock data for fisheries devices
const deviceData = [
  { id: 1, name: "Aerator 1", location: "Kolam 1", status: "active", lastMaintenance: "2023-10-15" },
  { id: 2, name: "Aerator 2", location: "Kolam 2", status: "active", lastMaintenance: "2023-11-02" },
  { id: 3, name: "Aerator 3", location: "Kolam 3", status: "inactive", lastMaintenance: "2023-09-28" },
  { id: 4, name: "Water Pump 1", location: "Kolam 1", status: "active", lastMaintenance: "2023-10-20" },
  { id: 5, name: "Water Pump 2", location: "Kolam 2", status: "active", lastMaintenance: "2023-11-05" },
  { id: 6, name: "Feeder 1", location: "Kolam 1", status: "active", lastMaintenance: "2023-10-10" },
  { id: 7, name: "Feeder 2", location: "Kolam 2", status: "warning", lastMaintenance: "2023-09-15" },
  { id: 8, name: "Water Quality Monitor", location: "All Ponds", status: "active", lastMaintenance: "2023-11-01" },
]

// Mock data for fisheries production
const productionData = [
  { month: "Jan", lele: 450, nila: 320, gurame: 180, mas: 250 },
  { month: "Feb", lele: 480, nila: 350, gurame: 200, mas: 270 },
  { month: "Mar", lele: 520, nila: 380, gurame: 220, mas: 290 },
  { month: "Apr", lele: 490, nila: 400, gurame: 210, mas: 310 },
  { month: "May", lele: 550, nila: 420, gurame: 240, mas: 330 },
  { month: "Jun", lele: 580, nila: 450, gurame: 260, mas: 350 },
  { month: "Jul", lele: 600, nila: 470, gurame: 280, mas: 370 },
  { month: "Aug", lele: 620, nila: 490, gurame: 300, mas: 390 },
  { month: "Sep", lele: 590, nila: 460, gurame: 290, mas: 380 },
  { month: "Oct", lele: 630, nila: 500, gurame: 310, mas: 400 },
  { month: "Nov", lele: 650, nila: 520, gurame: 330, mas: 420 },
  { month: "Dec", lele: 680, nila: 550, gurame: 350, mas: 450 },
]

// Mock data for fisheries revenue
const revenueData = [
  { date: "2023-01-15", target: 25, actual: 22, forecast: 28, trend: 26 },
  { date: "2023-02-15", target: 28, actual: 30, forecast: 32, trend: 29 },
  { date: "2023-03-15", target: 32, actual: 34, forecast: 36, trend: 33 },
  { date: "2023-04-15", target: 35, actual: 32, forecast: 38, trend: 36 },
  { date: "2023-05-15", target: 38, actual: 40, forecast: 42, trend: 39 },
  { date: "2023-06-15", target: 42, actual: 45, forecast: 46, trend: 43 },
  { date: "2023-07-15", target: 45, actual: 48, forecast: 50, trend: 47 },
  { date: "2023-08-15", target: 48, actual: 52, forecast: 54, trend: 50 },
  { date: "2023-09-15", target: 52, actual: 56, forecast: 58, trend: 54 },
  { date: "2023-10-15", target: 56, actual: 58, forecast: 62, trend: 59 },
  { date: "2023-11-15", target: 60, actual: 62, forecast: 65, trend: 63 },
  { date: "2023-12-15", target: 65, actual: 68, forecast: 70, trend: 67 },
]

// Mock data for fish species distribution
const speciesData = [
  { species: "Lele", value: 35 },
  { species: "Nila", value: 25 },
  { species: "Gurame", value: 20 },
  { species: "Mas", value: 15 },
  { species: "Patin", value: 5 },
]

// Mock data for water quality over time
const waterQualityData = [
  { date: "2023-01-01", temperature: 27.5, ph: 7.2, oxygen: 6.8 },
  { date: "2023-02-01", temperature: 27.8, ph: 7.1, oxygen: 6.7 },
  { date: "2023-03-01", temperature: 28.2, ph: 7.3, oxygen: 6.9 },
  { date: "2023-04-01", temperature: 28.5, ph: 7.2, oxygen: 7.0 },
  { date: "2023-05-01", temperature: 28.8, ph: 7.4, oxygen: 7.1 },
  { date: "2023-06-01", temperature: 29.0, ph: 7.3, oxygen: 7.0 },
  { date: "2023-07-01", temperature: 29.2, ph: 7.2, oxygen: 6.9 },
  { date: "2023-08-01", temperature: 29.5, ph: 7.1, oxygen: 6.8 },
  { date: "2023-09-01", temperature: 29.3, ph: 7.2, oxygen: 6.9 },
  { date: "2023-10-01", temperature: 29.0, ph: 7.3, oxygen: 7.0 },
  { date: "2023-11-01", temperature: 28.7, ph: 7.4, oxygen: 7.1 },
  { date: "2023-12-01", temperature: 28.5, ph: 7.3, oxygen: 7.0 },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function PerikananPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perikanan</h1>
          <p className="text-muted-foreground">Monitoring dan analisis data perikanan secara real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
          <TabsTrigger value="sensors">Sensor</TabsTrigger>
          <TabsTrigger value="devices">Perangkat</TabsTrigger>
          <TabsTrigger value="production">Produksi</TabsTrigger>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produksi</CardTitle>
                <Fish className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,240 kg</div>
                <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 78,5 Juta</div>
                <p className="text-xs text-muted-foreground">+15.2% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kualitas Air</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Baik</div>
                <p className="text-xs text-muted-foreground">2 kolam perlu perhatian</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kesehatan Ikan</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">+2.5% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Produksi Ikan Bulanan</CardTitle>
                <CardDescription>Produksi ikan per jenis dalam kilogram</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lele" fill="#0088FE" name="Lele" />
                    <Bar dataKey="nila" fill="#00C49F" name="Nila" />
                    <Bar dataKey="gurame" fill="#FFBB28" name="Gurame" />
                    <Bar dataKey="mas" fill="#FF8042" name="Mas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Distribusi Jenis Ikan</CardTitle>
                <CardDescription>Persentase produksi berdasarkan jenis ikan</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="donutChart" className="h-[350px]">
                  <DonutChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Kualitas Air</CardTitle>
                <CardDescription>Tren parameter kualitas air selama 12 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={waterQualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString("id-ID", { month: "short" })}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#FF8042"
                      name="Suhu (°C)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ph"
                      stroke="#0088FE"
                      name="pH"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="oxygen"
                      stroke="#00C49F"
                      name="Oksigen (mg/L)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Status Perangkat</CardTitle>
                <CardDescription>Kondisi perangkat pendukung perikanan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.slice(0, 5).map((device) => (
                    <div key={device.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            device.status === "active"
                              ? "bg-green-500"
                              : device.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500",
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium">{device.name}</p>
                          <p className="text-xs text-muted-foreground">{device.location}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          device.status === "active"
                            ? "outline"
                            : device.status === "warning"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {device.status === "active"
                          ? "Aktif"
                          : device.status === "warning"
                            ? "Perhatian"
                            : "Tidak Aktif"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Lihat Semua Perangkat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sensors Tab */}
        <TabsContent value="sensors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Parameter Kualitas Air</CardTitle>
                <CardDescription>Monitoring parameter kualitas air secara real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Thermometer className="mr-2 h-5 w-5" />
                      Suhu Air
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={waterQualityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString("id-ID", { month: "short" })}
                        />
                        <YAxis domain={[25, 32]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#FF8042"
                          name="Suhu (°C)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Waves className="mr-2 h-5 w-5" />
                      pH Air
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={waterQualityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString("id-ID", { month: "short" })}
                        />
                        <YAxis domain={[6, 8]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="ph"
                          stroke="#0088FE"
                          name="pH"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Droplets className="mr-2 h-5 w-5" />
                      Oksigen Terlarut
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={waterQualityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString("id-ID", { month: "short" })}
                        />
                        <YAxis domain={[5, 8]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="oxygen"
                          stroke="#00C49F"
                          name="Oksigen (mg/L)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sensorData.map((sensor) => (
              <Card key={sensor.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {sensor.name} - {sensor.type}
                  </CardTitle>
                  <Badge
                    variant={
                      sensor.status === "normal" ? "outline" : sensor.status === "warning" ? "secondary" : "destructive"
                    }
                  >
                    {sensor.status === "normal" ? "Normal" : sensor.status === "warning" ? "Perhatian" : "Kritis"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sensor.value}</div>
                  <p className="text-xs text-muted-foreground">Diperbarui 5 menit yang lalu</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Perangkat Pendukung Perikanan</h2>
              <p className="text-muted-foreground">Total 8 perangkat terpasang</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="warning">Perhatian</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deviceData.map((device) => (
              <Card key={device.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
                  <Badge
                    variant={
                      device.status === "active" ? "outline" : device.status === "warning" ? "secondary" : "destructive"
                    }
                  >
                    {device.status === "active" ? "Aktif" : device.status === "warning" ? "Perhatian" : "Tidak Aktif"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lokasi:</span>
                      <span className="text-sm font-medium">{device.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pemeliharaan Terakhir:</span>
                      <span className="text-sm font-medium">
                        {new Date(device.lastMaintenance).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Detail Perangkat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lele</CardTitle>
                <Fish className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,150 kg</div>
                <p className="text-xs text-muted-foreground">+15.3% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nila</CardTitle>
                <Fish className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,540 kg</div>
                <p className="text-xs text-muted-foreground">+12.8% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gurame</CardTitle>
                <Fish className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">980 kg</div>
                <p className="text-xs text-muted-foreground">+18.5% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mas</CardTitle>
                <Fish className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">570 kg</div>
                <p className="text-xs text-muted-foreground">+10.2% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Produksi Ikan Tahunan</CardTitle>
              <CardDescription>Tren produksi ikan per jenis selama 12 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lele" fill="#0088FE" name="Lele" />
                  <Bar dataKey="nila" fill="#00C49F" name="Nila" />
                  <Bar dataKey="gurame" fill="#FFBB28" name="Gurame" />
                  <Bar dataKey="mas" fill="#FF8042" name="Mas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Jenis Ikan</CardTitle>
                <CardDescription>Persentase produksi berdasarkan jenis ikan</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="speciesDonutChart" className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={speciesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ species, percent }) => `${species}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {speciesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tingkat Kelangsungan Hidup</CardTitle>
                <CardDescription>Persentase kelangsungan hidup ikan per jenis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lele</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary">
                      <div className="h-2 bg-primary" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Nila</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary">
                      <div className="h-2 bg-primary" style={{ width: "88%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Gurame</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary">
                      <div className="h-2 bg-primary" style={{ width: "95%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mas</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary">
                      <div className="h-2 bg-primary" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 78,5 Juta</div>
                <p className="text-xs text-muted-foreground">+15.2% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Biaya Operasional</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 32,8 Juta</div>
                <p className="text-xs text-muted-foreground">+8.5% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 45,7 Juta</div>
                <p className="text-xs text-muted-foreground">+20.3% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margin Keuntungan</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58.2%</div>
                <p className="text-xs text-muted-foreground">+5.1% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analisis Pendapatan dan Target</CardTitle>
              <CardDescription>Perbandingan pendapatan aktual dengan target bulanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div id="combinedChart" className="h-[500px]">
                <CombinedChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan per Jenis Ikan</CardTitle>
                <CardDescription>Kontribusi pendapatan berdasarkan jenis ikan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Lele", value: 35000000 },
                        { name: "Nila", value: 25000000 },
                        { name: "Gurame", value: 12000000 },
                        { name: "Mas", value: 6500000 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {speciesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `Rp ${(value / 1000000).toFixed(1)} Juta`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tren Harga Jual</CardTitle>
                <CardDescription>Perubahan harga jual ikan per kilogram</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: "Jan", lele: 25000, nila: 28000, gurame: 45000, mas: 30000 },
                      { month: "Feb", lele: 25500, nila: 28500, gurame: 46000, mas: 30500 },
                      { month: "Mar", lele: 26000, nila: 29000, gurame: 46500, mas: 31000 },
                      { month: "Apr", lele: 26500, nila: 29500, gurame: 47000, mas: 31500 },
                      { month: "May", lele: 27000, nila: 30000, gurame: 48000, mas: 32000 },
                      { month: "Jun", lele: 27500, nila: 30500, gurame: 48500, mas: 32500 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="lele" stroke="#0088FE" name="Lele" />
                    <Line type="monotone" dataKey="nila" stroke="#00C49F" name="Nila" />
                    <Line type="monotone" dataKey="gurame" stroke="#FFBB28" name="Gurame" />
                    <Line type="monotone" dataKey="mas" stroke="#FF8042" name="Mas" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
