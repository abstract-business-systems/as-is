def retry_delay(attempt):
    return min(2 ** attempt, 30)

def fetch(url, retries=3):
    """Fetch url, retrying with backoff. Raises FetchError after retries."""
    raise NotImplementedError
