import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import generateDates from '../utils/generate-dates'
import HabitDay from './HabitDay'
import dayjs from 'dayjs'

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const summaryDates = generateDates()
const minimumDates = 18 * 7 // 18 weeks
const amountDaysToFill = minimumDates - summaryDates.length

type Summary = Array<{
  id: string
  date: string
  available: number
  completed: number
}>

export default function SummaryTable() {

  const [summary, setSummary] = useState<Summary>([])

  // Call API one time -> useEffect's second param empty  
  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
      console.log(response.data)
    })
  }, [])
  
  return (
    <div className='w-full flex'>

      {/* 'header' with week day letters  */}
      <div className='grid grid-rows-7 grid-flow-row gap-3'>
        {weekDays.map((letter, index) => {
          return (
            <div key={letter + index} className='text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold'>
              {letter}
            </div>
          )
        })}
      </div>

      {/* Grid with dates */}
      <div className='grid grid-rows-7 grid-flow-col gap-3'>
        {
          summary.length > 0 &&
          summaryDates.map((date) => {

            // summaryDates -> all dates from the beginning of the year
            // summary -> all dates from back-end (dates with any registry)
            // is any of summaryDates also in summary? 
            const dayInSummary = summary.find(day => {
              return dayjs(date).isSame(day.date, 'day')
              // 'date' from summaryDates and 'day' from summary
            })

            return (
              <HabitDay 
                key={date.toString()}
                date={date}
                available={dayInSummary?.available}
                defaultCompleted={dayInSummary?.completed}
              />
            )
          })
        }

        { 
          // Empty unclickable squares ('dates') for design pourposes
          // Only if within first 18 weeks of the year
          amountDaysToFill > 0 && Array.from({ length: amountDaysToFill }).map((_, i) => {
            return (
              <div key={i} className='w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed' />
            )
          })
        }
      </div>
    </div>
  )
}