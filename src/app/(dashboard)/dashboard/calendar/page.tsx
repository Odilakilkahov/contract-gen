"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CalendarEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: "meeting" | "deadline" | "shoot" | "call" | "other"
  project: string
  location?: string
  meetingUrl?: string
  description?: string
}

const eventTypes = {
  meeting: { color: "bg-blue-500", icon: "👥" },
  deadline: { color: "bg-red-500", icon: "⏰" },
  shoot: { color: "bg-violet-500", icon: "📸" },
  call: { color: "bg-emerald-500", icon: "📞" },
  other: { color: "bg-zinc-500", icon: "📌" },
}

const initialEvents: CalendarEvent[] = [
  { id: "1", title: "Nike Campaign Shoot", date: "2026-05-29", startTime: "10:00", endTime: "14:00", type: "shoot", project: "Nike", location: "Studio A" },
  { id: "2", title: "Gymshark Call", date: "2026-05-29", startTime: "15:00", endTime: "15:30", type: "call", project: "Gymshark", meetingUrl: "https://zoom.us/..." },
  { id: "3", title: "Contract Deadline - Samsung", date: "2026-05-30", startTime: "23:59", endTime: "23:59", type: "deadline", project: "Samsung" },
  { id: "4", title: "Content Review Meeting", date: "2026-05-31", startTime: "11:00", endTime: "12:00", type: "meeting", project: "Audible" },
  { id: "5", title: "Post TikTok - Nike", date: "2026-06-01", startTime: "18:00", endTime: "18:00", type: "deadline", project: "Nike" },
]

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting" as CalendarEvent["type"],
    project: "",
    location: "",
    meetingUrl: "",
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")
    return `${year}-${month}-${dayStr}`
  }

  const getEventsForDay = (day: number) => {
    const dateKey = formatDateKey(day)
    return events.filter(e => e.date === dateKey)
  }

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          ...newEvent,
        },
      ])
      setNewEvent({
        title: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endTime: "11:00",
        type: "meeting",
        project: "",
        location: "",
        meetingUrl: "",
      })
      setShowAddModal(false)
    }
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date(new Date().toISOString().split("T")[0]))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Calendar</h1>
          <p className="text-gray-500">Manage your schedule and deadlines</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs text-gray-500 py-2">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />
                  }

                  const dayEvents = getEventsForDay(day)
                  const dateKey = formatDateKey(day)

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(selectedDate === dateKey ? null : dateKey)}
                      className={`aspect-square p-1 rounded-lg transition-all relative ${
                        isToday(day) ? "bg-violet-500/20 border border-violet-500/50" :
                        selectedDate === dateKey ? "bg-gray-100 border border-gray-300" :
                        "hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <span className={`text-sm ${isToday(day) ? "text-violet-400 font-bold" : ""}`}>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((e, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${eventTypes[e.type].color}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Selected Day Events */}
              {selectedDate && (
                <div className="mt-6 pt-6 border-t border-[#E5E0D8]">
                  <h3 className="font-semibold mb-3">
                    {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>
                  <div className="space-y-2">
                    {events.filter(e => e.date === selectedDate).map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                        <span className="text-xl">{eventTypes[event.type].icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">
                            {event.startTime} - {event.endTime} • {event.project}
                          </div>
                        </div>
                        <button onClick={() => deleteEvent(event.id)} className="text-gray-400 hover:text-red-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {events.filter(e => e.date === selectedDate).length === 0 && (
                      <div className="text-gray-500 text-sm">No events on this day</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-white border-[#E5E0D8] rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${eventTypes[event.type].color}/20 flex items-center justify-center text-xl`}>
                      {eventTypes[event.type].icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {event.startTime}
                      </div>
                      {event.location && (
                        <div className="text-sm text-gray-500 mt-1">📍 {event.location}</div>
                      )}
                      {event.meetingUrl && (
                        <a href={event.meetingUrl} target="_blank" className="text-sm text-violet-400 hover:underline mt-1 block">
                          🔗 Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {upcomingEvents.length === 0 && (
              <Card className="bg-white border-[#E5E0D8] rounded-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-3">📅</div>
                  <div className="text-gray-500">No upcoming events</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sync Button */}
          <Card className="mt-6 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/20 rounded-xl">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-2">Sync with Calendar</div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#E5E0D8] text-xs"
                  onClick={() => {
                    const icsContent = events.map(e =>
                      `BEGIN:VEVENT\nDTSTART:${e.date.replace(/-/g, '')}T${e.startTime.replace(':', '')}00\nDTEND:${e.date.replace(/-/g, '')}T${e.endTime.replace(':', '')}00\nSUMMARY:${e.title}\nDESCRIPTION:${e.project}\nEND:VEVENT`
                    ).join('\n')
                    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ContractGen//EN\n${icsContent}\nEND:VCALENDAR`], { type: 'text/calendar' })
                    const url = URL.createObjectURL(blob)
                    window.open(`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(url)}`, '_blank')
                  }}
                >
                  Google
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#E5E0D8] text-xs"
                  onClick={() => {
                    const icsContent = events.map(e =>
                      `BEGIN:VEVENT\nDTSTART:${e.date.replace(/-/g, '')}T${e.startTime.replace(':', '')}00\nDTEND:${e.date.replace(/-/g, '')}T${e.endTime.replace(':', '')}00\nSUMMARY:${e.title}\nEND:VEVENT`
                    ).join('\n')
                    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\n${icsContent}\nEND:VCALENDAR`], { type: 'text/calendar' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'contractgen-calendar.ics'
                    a.click()
                  }}
                >
                  Outlook
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#E5E0D8] text-xs"
                  onClick={() => {
                    const icsContent = events.map(e =>
                      `BEGIN:VEVENT\nDTSTART:${e.date.replace(/-/g, '')}T${e.startTime.replace(':', '')}00\nDTEND:${e.date.replace(/-/g, '')}T${e.endTime.replace(':', '')}00\nSUMMARY:${e.title}\nEND:VEVENT`
                    ).join('\n')
                    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\n${icsContent}\nEND:VCALENDAR`], { type: 'text/calendar' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'contractgen-calendar.ics'
                    a.click()
                  }}
                >
                  Apple
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Event</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Event Title</label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Brand meeting"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Date</label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Start</label>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">End</label>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent["type"] })}
                      className="w-full h-10 px-3 bg-gray-100 border border-[#E5E0D8] rounded-xl text-gray-900"
                    >
                      <option value="meeting">👥 Meeting</option>
                      <option value="call">📞 Call</option>
                      <option value="shoot">📸 Shoot</option>
                      <option value="deadline">⏰ Deadline</option>
                      <option value="other">📌 Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Project</label>
                    <Input
                      value={newEvent.project}
                      onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
                      placeholder="Nike Campaign"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Location or Meeting URL</label>
                  <Input
                    value={newEvent.location || newEvent.meetingUrl}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val.startsWith("http")) {
                        setNewEvent({ ...newEvent, meetingUrl: val, location: "" })
                      } else {
                        setNewEvent({ ...newEvent, location: val, meetingUrl: "" })
                      }
                    }}
                    placeholder="Studio A or https://zoom.us/..."
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-[#E5E0D8]">
                  Cancel
                </Button>
                <Button onClick={addEvent} className="flex-1 bg-violet-600 hover:bg-violet-500">
                  Add Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
