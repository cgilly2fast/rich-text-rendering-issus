'use client'

import React from 'react'
import { Task } from '@/payload-types'
import { useTaskDrawer } from './TaskDrawerProvider'

// Hardcoded example task data for reproduction
const exampleTask: Task = {
  id: '123456789',
  name: 'Example Task for Reproduction',
  priority: 'medium',
  completed: false,
  description: {
    root: {
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  comments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  _status: 'published',
}

const TaskButton: React.FC = () => {
  const { openTaskDrawer } = useTaskDrawer()

  const handleClick = () => {
    openTaskDrawer(exampleTask)
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Open Task Drawer
    </button>
  )
}

export default TaskButton
