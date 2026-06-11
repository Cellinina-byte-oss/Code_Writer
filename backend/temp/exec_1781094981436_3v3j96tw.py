import sys
sys.setrecursionlimit(10000)
n, m = map(int, input().split())
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)
s = int(input())
visited = [False] * (n + 1)
result = []

def dfs(u):
    visited[u] = True
    result.append(u)
    for v in sorted(graph[u]):
        if not visited[v]:
            dfs(v)

dfs(s)
print(' '.join(map(str, result)))