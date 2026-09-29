import React, { useState } from 'react'
import {
  Provider,
  defaultTheme,
  View,
  Flex,
  Heading,
  Content,
  Text,
  TextField,
  Button,
  ProgressCircle,
  InlineAlert,
  Well
} from '@adobe/react-spectrum'
import actions from '../config.json'

export default function App ({ runtime, ims }) {
  // Do NOT call runtime.done() here — index.js calls it in the ready handler
  const helloUrl = actions.hello // empty string until deployed or sandbox running

  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function sayHello () {
    setError(null)
    setGreeting(null)

    if (!helloUrl) {
      setError('The "hello" action URL is not available yet. Deploy the app (aio app deploy) or start the preview to populate config.json.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(helloUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ims.token}`,
          'x-gw-ims-org-id': ims.org
        },
        body: JSON.stringify({ name: name || undefined })
      })
      if (!res.ok) throw new Error(`Action failed: ${res.status}`)
      const data = await res.json()
      setGreeting(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <View
        UNSAFE_style={{ backgroundColor: '#1473E6', minHeight: '100vh' }}
        padding="size-400"
      >
        <Flex direction="column" gap="size-300" maxWidth="size-6000" margin="0 auto">
          <Heading level={1}>Hello World</Heading>
          <Content>
            <Text>
              Enter a name and call the <code>hello</code> action running on Adobe I/O Runtime.
            </Text>
          </Content>

          <Flex direction="row" gap="size-200" alignItems="end" wrap>
            <TextField
              label="Your name"
              value={name}
              onChange={setName}
              placeholder="World"
              width="size-3000"
              onKeyDown={(e) => { if (e.key === 'Enter') sayHello() }}
            />
            <Button variant="accent" onPress={sayHello} isPending={isLoading}>
              Say hello
            </Button>
          </Flex>

          {isLoading && (
            <Flex alignItems="center" justifyContent="center" height="size-2000">
              <ProgressCircle aria-label="Calling action" isIndeterminate size="L" />
            </Flex>
          )}

          {error && (
            <InlineAlert variant="negative">
              <Heading>Something went wrong</Heading>
              <Content>{error}</Content>
            </InlineAlert>
          )}

          {greeting && !isLoading && (
            <Well>
              <Flex direction="column" gap="size-100">
                <Heading level={3} margin={0}>{greeting.message}</Heading>
                <Text>
                  <small>Responded at {greeting.timestamp}</small>
                </Text>
              </Flex>
            </Well>
          )}
        </Flex>
      </View>
    </Provider>
  )
}
