import { client } from './amplify'
import type { 
  User, 
  Member, 
  Chapter, 
  School, 
  Advisor, 
  Induction, 
  InductionApplication,
  Payment,
  Event,
  EventAttendee,
  Page,
  NewsPost
} from '@/types'

// User API functions
export const userAPI = {
  async getUser(id: string): Promise<User | null> {
    try {
      const response = await client.graphql({
        query: `
          query GetUser($id: ID!) {
            getUser(id: $id) {
              id email firstName lastName role status
              profileImage phone address
              createdAt updatedAt
            }
          }
        `,
        variables: { id }
      })
      return response.data.getUser
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await client.graphql({
        query: `
          query UserByEmail($email: String!) {
            userByEmail(email: $email) {
              items {
                id email firstName lastName role status
                profileImage phone address
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { email }
      })
      return response.data.userByEmail.items[0] || null
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  },

  async updateUser(id: string, input: Partial<User>): Promise<User | null> {
    try {
      const response = await client.graphql({
        query: `
          mutation UpdateUser($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id email firstName lastName role status
              profileImage phone address
              createdAt updatedAt
            }
          }
        `,
        variables: { input: { id, ...input } }
      })
      return response.data.updateUser
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }
}

// Member API functions
export const memberAPI = {
  async getMembers(limit: number = 50, nextToken?: string) {
    try {
      const response = await client.graphql({
        query: `
          query ListMembers($limit: Int, $nextToken: String) {
            listMembers(limit: $limit, nextToken: $nextToken) {
              items {
                id membershipType memberNumber dues paymentStatus
                inductionDate alumniDate isActive
                user { id firstName lastName email }
                chapter { id name code }
                createdAt updatedAt
              }
              nextToken
            }
          }
        `,
        variables: { limit, nextToken }
      })
      return response.data.listMembers
    } catch (error) {
      console.error('Error fetching members:', error)
      return { items: [], nextToken: null }
    }
  },

  async getMemberByNumber(memberNumber: string): Promise<Member | null> {
    try {
      const response = await client.graphql({
        query: `
          query MemberByNumber($memberNumber: String!) {
            memberByNumber(memberNumber: $memberNumber) {
              items {
                id membershipType memberNumber dues paymentStatus
                inductionDate alumniDate isActive emergencyContact
                user { id firstName lastName email phone }
                chapter { id name code }
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { memberNumber }
      })
      return response.data.memberByNumber.items[0] || null
    } catch (error) {
      console.error('Error fetching member by number:', error)
      return null
    }
  },

  async createMember(input: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member | null> {
    try {
      const response = await client.graphql({
        query: `
          mutation CreateMember($input: CreateMemberInput!) {
            createMember(input: $input) {
              id membershipType memberNumber dues paymentStatus
              inductionDate alumniDate isActive
              user { id firstName lastName email }
              chapter { id name code }
              createdAt updatedAt
            }
          }
        `,
        variables: { input }
      })
      return response.data.createMember
    } catch (error) {
      console.error('Error creating member:', error)
      return null
    }
  }
}

// Chapter API functions
export const chapterAPI = {
  async getChapters() {
    try {
      const response = await client.graphql({
        query: `
          query ListChapters {
            listChapters {
              items {
                id name code location establishedDate status
                contactEmail website description
                school { id name }
                createdAt updatedAt
              }
            }
          }
        `
      })
      return response.data.listChapters.items
    } catch (error) {
      console.error('Error fetching chapters:', error)
      return []
    }
  },

  async getChapterByCode(code: string): Promise<Chapter | null> {
    try {
      const response = await client.graphql({
        query: `
          query ChapterByCode($code: String!) {
            chapterByCode(code: $code) {
              items {
                id name code location establishedDate status
                contactEmail website description
                school { id name }
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { code }
      })
      return response.data.chapterByCode.items[0] || null
    } catch (error) {
      console.error('Error fetching chapter by code:', error)
      return null
    }
  }
}

// Induction API functions
export const inductionAPI = {
  async getInductions(chapterId?: string) {
    try {
      const response = await client.graphql({
        query: `
          query ListInductions($filter: ModelInductionFilterInput) {
            listInductions(filter: $filter) {
              items {
                id title description inductionDate location
                capacity registrationCode isActive
                chapter { id name code }
                createdAt updatedAt
              }
            }
          }
        `,
        variables: chapterId ? { filter: { chapterID: { eq: chapterId } } } : {}
      })
      return response.data.listInductions.items
    } catch (error) {
      console.error('Error fetching inductions:', error)
      return []
    }
  },

  async getInductionByCode(code: string): Promise<Induction | null> {
    try {
      const response = await client.graphql({
        query: `
          query InductionByCode($code: String!) {
            inductionByCode(registrationCode: $code) {
              items {
                id title description inductionDate location
                capacity registrationCode isActive
                chapter { id name code }
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { code }
      })
      return response.data.inductionByCode.items[0] || null
    } catch (error) {
      console.error('Error fetching induction by code:', error)
      return null
    }
  }
}

// Payment API functions
export const paymentAPI = {
  async getUserPayments(userId: string) {
    try {
      const response = await client.graphql({
        query: `
          query GetUserPayments($userId: ID!) {
            getUser(id: $userId) {
              payments {
                items {
                  id amount currency type status
                  description dueDate paidAt
                  createdAt updatedAt
                }
              }
            }
          }
        `,
        variables: { userId }
      })
      return response.data.getUser?.payments?.items || []
    } catch (error) {
      console.error('Error fetching user payments:', error)
      return []
    }
  },

  async createPayment(input: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment | null> {
    try {
      const response = await client.graphql({
        query: `
          mutation CreatePayment($input: CreatePaymentInput!) {
            createPayment(input: $input) {
              id amount currency type status
              description dueDate paidAt
              createdAt updatedAt
            }
          }
        `,
        variables: { input }
      })
      return response.data.createPayment
    } catch (error) {
      console.error('Error creating payment:', error)
      return null
    }
  }
}

// Event API functions
export const eventAPI = {
  async getEvents(published: boolean = true) {
    try {
      const response = await client.graphql({
        query: `
          query ListEvents($filter: ModelEventFilterInput) {
            listEvents(filter: $filter) {
              items {
                id title description date endDate location
                capacity registrationRequired registrationDeadline
                price isPublished
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { filter: { isPublished: { eq: published } } }
      })
      return response.data.listEvents.items
    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  }
}

// Content API functions
export const contentAPI = {
  async getPages(published: boolean = true) {
    try {
      const response = await client.graphql({
        query: `
          query ListPages($filter: ModelPageFilterInput) {
            listPages(filter: $filter) {
              items {
                id slug title content metaDescription published
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { filter: { published: { eq: published } } }
      })
      return response.data.listPages.items
    } catch (error) {
      console.error('Error fetching pages:', error)
      return []
    }
  },

  async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      const response = await client.graphql({
        query: `
          query PageBySlug($slug: String!) {
            pageBySlug(slug: $slug) {
              items {
                id slug title content metaDescription published
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { slug }
      })
      return response.data.pageBySlug.items[0] || null
    } catch (error) {
      console.error('Error fetching page by slug:', error)
      return null
    }
  },

  async getNewsPosts(published: boolean = true) {
    try {
      const response = await client.graphql({
        query: `
          query ListNewsPosts($filter: ModelNewsPostFilterInput) {
            listNewsPosts(filter: $filter) {
              items {
                id title content excerpt featuredImage
                published publishedAt tags
                createdAt updatedAt
              }
            }
          }
        `,
        variables: { filter: { published: { eq: published } } }
      })
      return response.data.listNewsPosts.items
    } catch (error) {
      console.error('Error fetching news posts:', error)
      return []
    }
  }
}

