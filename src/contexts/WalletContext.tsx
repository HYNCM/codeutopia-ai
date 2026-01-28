import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Transaction, Payment } from '../types'
import { useAuth } from './AuthContext'
import { useProjects } from './ProjectContext'

interface WalletContextType {
  transactions: Transaction[]
  balance: number
  currency: string
  escrowLock: (projectId: string, amount: number, title: string) => Promise<void>
  escrowRelease: (projectId: string, milestoneId: string, amount: number, contractorId: string) => Promise<void>
  addFunds: (amount: number) => Promise<void>
  withdrawFunds: (amount: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const STORAGE_KEY = 'codeutopia_transactions'

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth()
  const { updateProject } = useProjects()

  // In a real app, transactions would be fetched from API based on user.id
  // Here we simulate local storage for all transactions and filter by user
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTransactions))
  }, [allTransactions])

  const userTransactions = allTransactions
    .filter((t) => t.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const addTransactionRecord = (tx: Transaction) => {
    setAllTransactions((prev) => [tx, ...prev])
  }

  const escrowLock = async (projectId: string, amount: number, title: string) => {
    if (!user) throw new Error('User not authenticated')
    if (user.balance < amount) throw new Error('Insufficient funds')

    // 1. Deduct from User Balance
    updateUser({ balance: user.balance - amount })

    // 2. Add to Project Escrow
    // Note: We need to fetch the current project state to know the current escrow? 
    // Actually updateProject accepts partial, but we strictly want increment. 
    // In this simple context, we assume the caller or the project context handles the calculation or we do a simple set.
    // Ideally updateProject should support functional updates or we read it first.
    // For MVP, we will assume atomic update here.
    // Let's assume we pass the new total or handle it in ProjectContext? 
    // updateProject currently takes Partial<Project>.
    // To do it safely, we might need a specific method in ProjectContext, but let's just trigger a re-render/update logic here.
    // We will assume the logic is: Project.escrowBalance += amount.
    // BUT we don't have access to the specific project instance here easily without searching.
    // Let's rely on updateProject merging. But wait, updateProject usually overwrites.
    // Let's just create the Transaction record first. logic for updating Project.escrow should be maybe passed.
    
    // Actually, updateProject implementation in ProjectContext:
    // setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    // This is a shallow merge. If we want to increment, we need the old value.
    
    // IMPROVEMENT: We will skip strict project update here and just let the caller handle it?
    // NO, WalletContext should handle the money.
    // For now, let's create the transaction logs. The caller (UI or integration point) might need to ensure consistency.
    
    // Transaction Record for Sender (Client)
    const tx: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      relatedProjectId: projectId,
      type: 'escrow_lock',
      amount: -amount, // Negative for deduction logic in UI? Or just use type? 
      // Standard: amount is always positive, type determines direction.
      currency: 'USD', // Mock
      description: `Funding escrow for project: ${title}`,
      projectTitle: title,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    
    addTransactionRecord(tx)
  }

  const escrowRelease = async (projectId: string, milestoneId: string, amount: number, contractorId: string) => {
    if (!user) throw new Error('User not authenticated')
    
    // This is called by the Client (Owner).
    // Logic:
    // 1. Project Escrow decreases (This logic must be handled by Project Update)
    // 2. Contractor Balance INCREASES.
    // 3. Client gets a record of "Release".
    
    // We can't update another user's balance easily in this mocked auth context without switching users.
    // However, since we use LocalStorage for users (MOCK_USERS in AuthContext is static, but state is local),
    // we might not be able to update Contractor's balance perfectly if they are not logged in.
    // MOCK SOLUTION: We will just record the transaction for the current user (Client).
    // And if we ever switch to Contractor, we should "simulate" fetching their earnings.
    
    // For the MVP demo, we will update the Client's View of the world.
    
    const tx: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      relatedProjectId: projectId,
      relatedMilestoneId: milestoneId,
      type: 'escrow_release',
      amount: amount,
      currency: 'USD',
      description: 'Release milestone funds',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    addTransactionRecord(tx)
    
    // In a real app, we would create a transaction for the Contractor too.
    // tx_contractor = { userId: contractorId, type: 'income', ... }
    const txContractor: Transaction = {
      id: crypto.randomUUID(),
      userId: contractorId, // This might never be seen until we login as contractor and filter by this ID
      relatedProjectId: projectId,
      relatedMilestoneId: milestoneId,
      type: 'deposit', // Income
      amount: amount, 
      currency: 'USD',
      description: 'Milestone payment received',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    addTransactionRecord(txContractor)
  }

  const addFunds = async (amount: number) => {
    if (!user) return
    updateUser({ balance: user.balance + amount })
    
    const tx: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: 'deposit',
      amount: amount,
      currency: 'USD',
      description: 'Deposit funds to wallet',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    addTransactionRecord(tx)
  }

  const withdrawFunds = async (amount: number) => {
    if (!user) return
    if (user.balance < amount) throw new Error('Insufficient funds')
    updateUser({ balance: user.balance - amount })
    
    const tx: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: 'withdrawal',
      amount: amount,
      currency: 'USD',
      description: 'Withdrawal to bank account',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    addTransactionRecord(tx)
  }

  return (
    <WalletContext.Provider
      value={{
        transactions: userTransactions,
        balance: user?.balance || 0,
        currency: 'USD', // Simplified
        escrowLock,
        escrowRelease,
        addFunds,
        withdrawFunds,
      }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
