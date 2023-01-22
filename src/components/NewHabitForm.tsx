import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox'
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function NewHabitForm() {

  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  async function createNewHabit(e:FormEvent){
    e.preventDefault()
    
    // validation
    if (!title || weekDays.length === 0) {
      // alert
      return
    }

    api.post('habits', {
      title,
      weekDays
    })

    setTitle('')
    setWeekDays([])

    alert('Habit created successfully!')
  }

  function handleWeekToggleDay(weekDay: number){
    // if user clicked on a day that was already checked, remove that day
    if (weekDays.includes(weekDay)){
      const weekDaysWithoutRemovedOne = weekDays.filter(day => day === weekDay)
      setWeekDays(weekDaysWithoutRemovedOne)
    } else { // if user clicked on a day that wasn't checked, add that day
       const weekDaysWithAddedOne = [...weekDays, weekDay]
       setWeekDays(weekDaysWithAddedOne)
    }
  }

  return (
    <form 
      className='w-full flex flex-col mt-6'
      onSubmit={createNewHabit}
    >
      <label htmlFor="title" className='font-semibold leading-tight'>
        Qual seu comprometimento?
      </label>

      <input 
        type='text'
        id='title'
        placeholder='ex.: Go to the gym, Sleep 8 hours'
        className='p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background'
        onChange={event => setTitle(event.target.value)}
        value={title}
        autoFocus
      />

      <label htmlFor="" className='font-semibold leading-tight mt-4'>
        Qual a recorrencia?
      </label>

      {/* checkbox */}
      <div className='mt-6 flex flex-col gap-3'>
        {
          availableWeekDays.map((weekday, index) => {
            return (
              <Checkbox.Root
                key={index}
                className='flex items-center gap-3 group focus:outline-none'
                checked={weekDays.includes(index)}
                onCheckedChange={() => { handleWeekToggleDay(index) }}
              >
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                  <Checkbox.Indicator>
                    <Check size={20} className='text-white' />
                  </Checkbox.Indicator>
                </div>
                <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                  {weekday}
                </span>
              </Checkbox.Root>
            )
          })
        }
      </div>

      <button type="submit" className='mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-background'>
        <Check size={20} weight="bold" />
        Let's get started
      </button>
    </form>
  )
}