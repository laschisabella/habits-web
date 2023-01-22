import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import dayjs from 'dayjs'

interface HabitsListProps {
  date: Date
  onCompletedChange: (completed: number) => void
}

interface HabitsInfo {
  availableHabits: Array<{
    id: string
    title: string
    created_at: string
  }>,
  completedHabits: string[]
}


export default function HabitsList({ date, onCompletedChange }: HabitsListProps) {

  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString()
      }
    }).then(response => {
      setHabitsInfo(response.data)
    })
  }, [])

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  async function handleToggleHabit(habitId: string) {
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
    await api.patch(`/habits/${habitId}/toggle`)

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }
    setHabitsInfo({
      availableHabits: habitsInfo!.availableHabits,
      completedHabits
    })

    onCompletedChange(completedHabits.length)
  }

  return (
    <div className='mt-3 flex flex-col gap-2'>

      {
        habitsInfo?.availableHabits.map(habit => {
          return (
            <Checkbox.Root
              key={habit.id}
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
              disabled={isDateInPast}
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-400 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                <Checkbox.Indicator>
                  <Check size={20} className='text-white' />
                </Checkbox.Indicator>
              </div>
              <span className='text-white leading-tight'>
                {habit.title}
              </span>
            </Checkbox.Root>
          )
        })
      }
    </div>
  )
}