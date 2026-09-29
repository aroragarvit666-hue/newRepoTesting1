// Dummy Comment Change

const { Core } = require('@adobe/aio-sdk')

async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  try {
    logger.info('Hello action invoked')
    logger.debug('Params:', JSON.stringify(params))

    // Optional caller name; defaults to "World"
    const name = params.name || 'World'

    // IMS token is injected by ExC Shell when require-adobe-auth: true
    const token = params.__ow_headers?.authorization?.replace('Bearer ', '')
    if (token) {
      logger.debug('Received an IMS token')
    }

    const result = {
      message: `Hello, ${name}! 👋 Your App Builder action is running on Adobe I/O Runtime.`,
      timestamp: new Date().toISOString()
    }

    logger.info('Hello action completed successfully')
    return { statusCode: 200, body: result }
  } catch (error) {
    logger.error('Hello action failed:', error.message)
    return { statusCode: 500, body: { error: error.message } }
  }
}

exports.main = main
