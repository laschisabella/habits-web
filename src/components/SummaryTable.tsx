import generateDates from '../utils/generate-dates'
import HabitDay from './HabitDay'

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const summaryDates = generateDates()

const minimumDates = 18 * 7 // 18 weeks

const amountDaysToFill = minimumDates - summaryDates.length

export default function SummaryTable() {
  return (
    <div className='w-full flex'>
      <div className='grid grid-rows-7 grid-flow-row gap-3'>
        {weekDays.map((letter, index) => {
          return (
            <div key={letter + index} className='text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold'>
              {letter}
            </div>
          )
        })}
      </div>

      <div className='grid grid-rows-7 grid-flow-col gap-3'>
        {summaryDates.map((date) => {
          return <HabitDay key={date.toString()} />
        })}

        {amountDaysToFill > 0 && Array.from({ length: amountDaysToFill }).map((_, i) => {
          return (
            <div key={i} className='w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed' />
          )
        })}
      </div>
    </div>
  )
}