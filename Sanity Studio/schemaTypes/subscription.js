export default {
    name: 'subscription',
    title: 'Push Subscription',
    type: 'document',
    fields: [
        {
            name: 'endpoint',
            title: 'Endpoint',
            type: 'string',
        },
        {
            name: 'keys',
            title: 'Keys',
            type: 'object',
            fields: [
                { name: 'p256dh', type: 'string', title: 'P256dh' },
                { name: 'auth', type: 'string', title: 'Auth' }
            ]
        },
        {
            name: 'userAgent',
            title: 'User Agent',
            type: 'string',
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        }
    ]
}
