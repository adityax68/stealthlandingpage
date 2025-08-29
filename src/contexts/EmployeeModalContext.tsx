import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface EmployeeModalContextType {
  isEmployeeModalOpen: boolean
  openEmployeeModal: () => void
  closeEmployeeModal: () => void
  onEmployeeSuccess: () => void
}

const EmployeeModalContext = createContext<EmployeeModalContextType | undefined>(undefined)

export const useEmployeeModal = () => {
  const context = useContext(EmployeeModalContext)
  if (context === undefined) {
    throw new Error('useEmployeeModal must be used within an EmployeeModalProvider')
  }
  return context
}

interface EmployeeModalProviderProps {
  children: ReactNode
}

export const EmployeeModalProvider: React.FC<EmployeeModalProviderProps> = ({ children }) => {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false)

  const openEmployeeModal = () => {
    setIsEmployeeModalOpen(true)
  }

  const closeEmployeeModal = () => {
    setIsEmployeeModalOpen(false)
  }

  const onEmployeeSuccess = () => {
    // Just close the modal, no page reload needed
    // The toast will be shown by the modal component itself
  }

  return (
    <EmployeeModalContext.Provider
      value={{
        isEmployeeModalOpen,
        openEmployeeModal,
        closeEmployeeModal,
        onEmployeeSuccess
      }}
    >
      {children}
    </EmployeeModalContext.Provider>
  )
} 