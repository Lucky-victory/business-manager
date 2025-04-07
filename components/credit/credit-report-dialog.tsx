"use client"

import { useState } from "react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"

type DateRange = {
  from: Date
  to: Date
}

type ReportFormat = "csv" | "pdf" | "excel"

export function CreditReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { credits, debtors } = useStore()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [reportFormat, setReportFormat] = useState<ReportFormat>("csv")
  const [selectedDebtor, setSelectedDebtor] = useState<string>("all")

  const handleGenerateReport = () => {
    // Filter credits by date range and debtor if selected
    let filteredCredits = credits.filter((credit) => {
      const creditDate = new Date(credit.date)
      return creditDate >= dateRange.from && creditDate <= dateRange.to
    })

    // Filter by debtor if not "all"
    if (selectedDebtor !== "all") {
      filteredCredits = filteredCredits.filter((credit) => credit.debtorId === selectedDebtor)
    }

    // In a real app, this would generate and download the report
    // For now, we'll just log the data and show a success message
    console.log("Generating report:", {
      format: reportFormat,
      dateRange,
      selectedDebtor,
      data: filteredCredits,
    })

    // Mock download based on format
    const fileName = `credit-report-${format(dateRange.from, "yyyy-MM-dd")}-to-${format(dateRange.to, "yyyy-MM-dd")}`

    // In a real app, this would be an actual file download
    alert(`Report "${fileName}.${reportFormat}" has been generated!`)

    onOpenChange(false)
  }

  // Preset date range options
  const selectLastWeek = () => {
    const today = new Date()
    setDateRange({
      from: subDays(today, 7),
      to: today,
    })
  }

  const selectLastMonth = () => {
    const today = new Date()
    setDateRange({
      from: subDays(today, 30),
      to: today,
    })
  }

  const selectThisMonth = () => {
    const today = new Date()
    setDateRange({
      from: startOfMonth(today),
      to: endOfMonth(today),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Credit Report</DialogTitle>
          <DialogDescription>
            Create a report of credit transactions for the selected date range and format.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={selectLastWeek}>
                Last 7 Days
              </Button>
              <Button variant="outline" size="sm" onClick={selectLastMonth}>
                Last 30 Days
              </Button>
              <Button variant="outline" size="sm" onClick={selectThisMonth}>
                This Month
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="from-date" variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="to-date" variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Debtor</h3>
            <Select value={selectedDebtor} onValueChange={setSelectedDebtor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a debtor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Debtors</SelectItem>
                {debtors.map((debtor) => (
                  <SelectItem key={debtor.id} value={debtor.id}>
                    {debtor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Report Format</h3>
            <Select value={reportFormat} onValueChange={(value: ReportFormat) => setReportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleGenerateReport}>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

