import { RECOMMENDED_TALENTS, MOCK_USERS } from './mockData'

export const talentService = {
  getRecommendedTalents: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(RECOMMENDED_TALENTS)
      }, 500)
    })
  },

  getTalentById: async (id: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const talent = RECOMMENDED_TALENTS.find((t) => t.id === id)
        resolve(talent)
      }, 300)
    })
  },

  // Simulated search/filter
  searchTalents: async (query: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase()
        const results = RECOMMENDED_TALENTS.filter(
          (t) =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.role.toLowerCase().includes(lowerQuery) ||
            t.skills.some((s) => s.toLowerCase().includes(lowerQuery)),
        )
        resolve(results)
      }, 600)
    })
  },
}
