'use client'
import { Task } from '@/payload-types'
import React, { createContext, useState, useContext } from 'react'

type TaskDrawerContextType = {
  isOpen: boolean
  taskData: Task | null
  drawerWidth: number
  openTaskDrawer: (task: Task) => void
  closeDrawer: () => void
  setDrawerWidth: (width: number) => void
}

const TaskDrawerContext = createContext<TaskDrawerContextType>({} as TaskDrawerContextType)

export const TaskDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [taskData, setTaskData] = useState<Task | null>(null)
  const [drawerWidth, setDrawerWidth] = useState<number>(650)

  const openTaskDrawer = (task: Task) => {
    setTaskData(task)
    setIsOpen(true)
  }

  const closeDrawer = () => {
    setIsOpen(false)
  }

  return (
    <TaskDrawerContext.Provider
      value={{
        isOpen,
        taskData,
        drawerWidth,
        openTaskDrawer,
        closeDrawer,
        setDrawerWidth,
      }}
    >
      {children}
    </TaskDrawerContext.Provider>
  )
}

export function useTaskDrawer(): TaskDrawerContextType {
  const context = useContext(TaskDrawerContext)
  if (context === undefined) {
    throw new Error('useTaskDrawer must be used within a TaskDrawerProvider')
  }
  return context
}
