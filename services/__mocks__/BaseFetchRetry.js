
module.exports = jest.fn().mockImplementation((url, options) => {
    return {
        url,
        options,
        maxRetries: 5,
        retryDelayMilliseconds: 1000,
        fetchWithRetry: jest.fn(() =>
            Promise.resolve(
                {
                    ok: true,
                    json: () => Promise.resolve({ data: 'mocked data' }),
                })
        ),
    };
});