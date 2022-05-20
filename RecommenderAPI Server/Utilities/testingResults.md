# Test Results

These are the results obtained after testing the API server:

1. In the /genre_game_rec endpoint, if merge_by_and parameter is False (merger is done by 'OR'), response time is considerably higher than the case when merger is done by 'AND'.
> With 'AND' merger, mean response time on localhost was 770ms, with 'OR' merger, it was almost 3.5s.
2. Refresh request's result is sent once the server refreshes. It may take 10-12 secs, based on data size.