const BaseFetchRetry = require('../../services/BaseFetchRetry');
// Mocking the global fetch
global.fetch = jest.fn();

describe('TC-19 BaseFetchRetry', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const url = 'https://www.google.com';
    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    };

    it('TC-19: The request is not retried on a successful response', async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ data: 'success' }),
        });

        const fetchRetry = new BaseFetchRetry(url, options);
        fetchRetry.maxRetries = 5;

        const data = await fetchRetry.fetchWithRetry();
        expect(data).toEqual({ data: 'success' });
        expect(fetch).toHaveBeenCalledTimes(1);
    });


    it('TC-19: The request is retried until max retries is reached', async () => {
        fetch
            .mockResolvedValueOnce({ ok: false, status: 429 }) // First attempt: rate limit error
            .mockResolvedValueOnce({ ok: false, status: 500 }) // Second attempt: server error
            .mockResolvedValueOnce({ ok: false, status: 429 }) // Third attempt: rate limit error
            .mockResolvedValueOnce({ ok: false, status: 500 }) // Fourth attempt: server error
            .mockResolvedValueOnce({ ok: false, status: 429 }); // Fifth attempt: rate limit error

        const fetchRetry = new BaseFetchRetry(url, options);
        fetchRetry.maxRetries = 5;

        await expect(fetchRetry.fetchWithRetry()).rejects.toThrow('Failed after 5 retries without success.');
        expect(fetch).toHaveBeenCalledTimes(5);
    }, 100000);


    it('TC-19: The request is not retried with client error', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: jest.fn().mockResolvedValue({ error: 'Not Found' }),
        });

        const fetchRetry = new BaseFetchRetry(url, options);
        fetchRetry.maxRetries = 5;

        await expect(fetchRetry.fetchWithRetry()).rejects.toThrow('Request failed with status 404');
        expect(fetch).toHaveBeenCalledTimes(1); // Fetch should only be called once because 404 is not a retryable error.
    });


    it('TC-19: The request is not retried with server error and max retried reached', async () => {

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });


        const fetchRetry = new BaseFetchRetry(url, options);
        fetchRetry.maxRetries = 1;

        await expect(fetchRetry.fetchWithRetry()).rejects.toThrow('Failed after 1 retries without success');
        expect(fetch).toHaveBeenCalledTimes(1);
    }, 100000);




});
