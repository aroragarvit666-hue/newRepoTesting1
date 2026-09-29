jest.mock('@adobe/aio-sdk', () => ({
  Core: { Logger: jest.fn(() => ({ info: jest.fn(), debug: jest.fn(), error: jest.fn() })) }
}))

const { Core } = require('@adobe/aio-sdk')
const { main } = require('../actions/hello/index.js')

beforeEach(() => jest.clearAllMocks())

describe('hello action', () => {
  it('returns 200 with a default greeting when no name is given', async () => {
    const res = await main({})
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toContain('Hello, World!')
    expect(res.body.timestamp).toBeDefined()
  })

  it('returns 200 and greets the provided name', async () => {
    const res = await main({ name: 'Ada' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toContain('Hello, Ada!')
  })

  it('reads the IMS token from the authorization header without failing', async () => {
    const res = await main({
      name: 'Grace',
      __ow_headers: { authorization: 'Bearer fake-token' }
    })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toContain('Hello, Grace!')
  })

  it('returns 500 when the logger throws', async () => {
    Core.Logger.mockImplementationOnce(() => { throw new Error('logger boom') })
    const res = await main({ name: 'X' })
    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('logger boom')
  })
})
