n, W = map(int, input().split())
weights = list(map(int, input().split()))
values = list(map(int, input().split()))
dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for w in range(W + 1):
        dp[i][w] = dp[i-1][w]
        if weights[i-1] <= w:
            dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
print(dp[n][W])