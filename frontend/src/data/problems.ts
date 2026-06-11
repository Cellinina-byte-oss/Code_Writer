export interface Problem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  inputFormat: string
  outputFormat: string
  sampleInput?: string
  sampleOutput?: string
  hints: string[]
  referenceAnswer?: string
  template: Record<string, string>
  complexity?: {
    time: string
    space: string
  }
}

export const problems: Problem[] = [
  {
    id: '1',
    title: 'Hello World',
    difficulty: 'easy',
    description: '请编写程序输出 "Hello, World!" 以及 "欢迎使用在线代码编辑器"。',
    inputFormat: '无输入',
    outputFormat: 'Hello, World!\n欢迎使用在线代码编辑器',
    hints: [
      'Python 使用 print() 函数输出',
      'C/C++ 使用 cout 或 printf()',
      'Java 使用 System.out.println()'
    ],
    referenceAnswer: `print("Hello, World!")
print("欢迎使用在线代码编辑器")`,
    complexity: {
      time: 'O(1)',
      space: 'O(1)'
    },
    template: {
      python: `print("Hello, World!")
print("欢迎使用在线代码编辑器")`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "欢迎使用在线代码编辑器" << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("欢迎使用在线代码编辑器\\n");
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("欢迎使用在线代码编辑器");
    }
}`
    }
  },
  {
    id: '2',
    title: '两数之和',
    difficulty: 'easy',
    description: '给定两个整数 a 和 b，计算它们的和并输出结果。',
    inputFormat: '输入包含两个整数 a 和 b，用空格分隔。',
    outputFormat: '输出一个整数，表示 a 和 b 的和。',
    sampleInput: '3 5',
    sampleOutput: '8',
    hints: [
      '注意输入格式，使用合适的方法读取输入',
      'Python 可以使用 input().split() 读取',
      'C/C++ 使用 cin 或 scanf',
      'Java 使用 Scanner 类'
    ],
    referenceAnswer: `a, b = map(int, input().split())
print(a + b)`,
    complexity: {
      time: 'O(1)',
      space: 'O(1)'
    },
    template: {
      python: `a, b = map(int, input().split())
print(a + b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
    }
}`
    }
  },
  {
    id: '3',
    title: '求阶乘',
    difficulty: 'medium',
    description: '给定一个正整数 n，计算 n 的阶乘。阶乘定义为：n! = n × (n-1) × ... × 1，其中 0! = 1。',
    inputFormat: '输入包含一个正整数 n（0 ≤ n ≤ 12）。',
    outputFormat: '输出 n 的阶乘结果。',
    sampleInput: '5',
    sampleOutput: '120',
    hints: [
      '可以使用循环或递归实现',
      '注意 0 的阶乘是 1',
      '递归实现要注意栈溢出问题'
    ],
    referenceAnswer: `n = int(input())
result = 1
for i in range(1, n + 1):
    result *= i
print(result)`,
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    template: {
      python: `n = int(input())
result = 1
for i in range(1, n + 1):
    result *= i
print(result)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    cout << result << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    printf("%d\\n", result);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        System.out.println(result);
    }
}`
    }
  },
  {
    id: '4',
    title: '斐波那契数列',
    difficulty: 'medium',
    description: '给定一个正整数 n，输出斐波那契数列的第 n 项。斐波那契数列定义为：F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)（n ≥ 2）。',
    inputFormat: '输入包含一个正整数 n（0 ≤ n ≤ 40）。',
    outputFormat: '输出斐波那契数列的第 n 项。',
    sampleInput: '10',
    sampleOutput: '55',
    hints: [
      '使用循环比递归更高效',
      '注意边界条件：F(0)=0, F(1)=1',
      '可以用数组存储中间结果'
    ],
    referenceAnswer: `n = int(input())
if n == 0:
    print(0)
elif n == 1:
    print(1)
else:
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    print(b)`,
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    template: {
      python: `n = int(input())
if n == 0:
    print(0)
elif n == 1:
    print(1)
else:
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    print(b)`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n == 0) {
        cout << 0 << endl;
        return 0;
    }
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = b;
        b = a + b;
        a = temp;
    }
    cout << b << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n == 0) {
        printf("0\\n");
        return 0;
    }
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = b;
        b = a + b;
        a = temp;
    }
    printf("%d\\n", b);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        if (n == 0) {
            System.out.println(0);
            return;
        }
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int temp = b;
            b = a + b;
            a = temp;
        }
        System.out.println(b);
    }
}`
    }
  },
  {
    id: '5',
    title: '质数判断',
    difficulty: 'medium',
    description: '给定一个正整数 n，判断它是否为质数。质数定义为大于 1 的自然数，除了 1 和它本身外，不能被其他自然数整除。',
    inputFormat: '输入包含一个正整数 n（1 ≤ n ≤ 10^6）。',
    outputFormat: '如果 n 是质数，输出 "YES"；否则输出 "NO"。',
    sampleInput: '17',
    sampleOutput: 'YES',
    hints: [
      '质数必须大于 1',
      '只需要检查到 sqrt(n) 即可',
      '偶数除了 2 都不是质数'
    ],
    referenceAnswer: `n = int(input())
if n < 2:
    print("NO")
elif n == 2:
    print("YES")
elif n % 2 == 0:
    print("NO")
else:
    is_prime = True
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            is_prime = False
            break
    print("YES" if is_prime else "NO")`,
    complexity: {
      time: 'O(√n)',
      space: 'O(1)'
    },
    template: {
      python: `n = int(input())
if n < 2:
    print("NO")
elif n == 2:
    print("YES")
elif n % 2 == 0:
    print("NO")
else:
    is_prime = True
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            is_prime = False
            break
    print("YES" if is_prime else "NO")`,
      cpp: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n < 2) {
        cout << "NO" << endl;
        return 0;
    }
    if (n == 2) {
        cout << "YES" << endl;
        return 0;
    }
    if (n % 2 == 0) {
        cout << "NO" << endl;
        return 0;
    }
    for (int i = 3; i <= sqrt(n); i += 2) {
        if (n % i == 0) {
            cout << "NO" << endl;
            return 0;
        }
    }
    cout << "YES" << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <math.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n < 2) {
        printf("NO\\n");
        return 0;
    }
    if (n == 2) {
        printf("YES\\n");
        return 0;
    }
    if (n % 2 == 0) {
        printf("NO\\n");
        return 0;
    }
    for (int i = 3; i <= sqrt(n); i += 2) {
        if (n % i == 0) {
            printf("NO\\n");
            return 0;
        }
    }
    printf("YES\\n");
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        if (n < 2) {
            System.out.println("NO");
            return;
        }
        if (n == 2) {
            System.out.println("YES");
            return;
        }
        if (n % 2 == 0) {
            System.out.println("NO");
            return;
        }
        for (int i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i == 0) {
                System.out.println("NO");
                return;
            }
        }
        System.out.println("YES");
    }
}`
    }
  },
  {
    id: '6',
    title: '快速排序',
    difficulty: 'hard',
    description: '实现快速排序算法，对给定的整数数组进行升序排序。',
    inputFormat: '第一行输入一个整数 n（1 ≤ n ≤ 1000），表示数组长度。第二行输入 n 个整数。',
    outputFormat: '输出排序后的数组，元素之间用空格分隔。',
    sampleInput: '5\n3 1 4 1 5',
    sampleOutput: '1 1 3 4 5',
    hints: [
      '选择一个基准元素',
      '将数组分成小于基准和大于基准两部分',
      '递归排序两部分'
    ],
    referenceAnswer: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

n = int(input())
arr = list(map(int, input().split()))
sorted_arr = quick_sort(arr)
print(' '.join(map(str, sorted_arr)))`,
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)'
    },
    template: {
      python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

n = int(input())
arr = list(map(int, input().split()))
sorted_arr = quick_sort(arr)
print(' '.join(map(str, sorted_arr)))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        int pi = i + 1;
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    quickSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    return 0;
}`,
      c: `#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    quickSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        quickSort(arr, 0, n - 1);
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}`
    }
  },
  {
    id: '7',
    title: '奇偶数判断',
    difficulty: 'easy',
    description: '给定一个整数 n，判断它是奇数还是偶数。',
    inputFormat: '输入包含一个整数 n（-10^9 ≤ n ≤ 10^9）。',
    outputFormat: '如果 n 是偶数，输出 "Even"；如果是奇数，输出 "Odd"。',
    sampleInput: '4',
    sampleOutput: 'Even',
    hints: [
      '使用取模运算符 %',
      '偶数除以2余数为0',
      '注意0是偶数'
    ],
    referenceAnswer: `n = int(input())
if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
    complexity: {
      time: 'O(1)',
      space: 'O(1)'
    },
    template: {
      python: `n = int(input())
if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    if (n % 2 == 0) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    long long n;
    scanf("%lld", &n);
    if (n % 2 == 0) {
        printf("Even\\n");
    } else {
        printf("Odd\\n");
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long n = scanner.nextLong();
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`
    }
  },
  {
    id: '8',
    title: '最大值与最小值',
    difficulty: 'easy',
    description: '给定三个整数，找出其中的最大值和最小值。',
    inputFormat: '输入包含三个整数，用空格分隔。',
    outputFormat: '输出最大值和最小值，用空格分隔。先输出最大值，再输出最小值。',
    sampleInput: '3 8 2',
    sampleOutput: '8 2',
    hints: [
      '可以使用 Math.max/Math.min 或条件判断',
      '注意比较的顺序',
      '也可以先将三个数存入数组再排序'
    ],
    referenceAnswer: `a, b, c = map(int, input().split())
max_val = max(a, b, c)
min_val = min(a, b, c)
print(max_val, min_val)`,
    complexity: {
      time: 'O(1)',
      space: 'O(1)'
    },
    template: {
      python: `a, b, c = map(int, input().split())
max_val = max(a, b, c)
min_val = min(a, b, c)
print(max_val, min_val)`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int max_val = max({a, b, c});
    int min_val = min({a, b, c});
    cout << max_val << " " << min_val << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    int max_val = a > b ? (a > c ? a : c) : (b > c ? b : c);
    int min_val = a < b ? (a < c ? a : c) : (b < c ? b : c);
    printf("%d %d\\n", max_val, min_val);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = scanner.nextInt();
        int max_val = Math.max(a, Math.max(b, c));
        int min_val = Math.min(a, Math.min(b, c));
        System.out.println(max_val + " " + min_val);
    }
}`
    }
  },
  {
    id: '9',
    title: '回文数判断',
    difficulty: 'medium',
    description: '给定一个正整数，判断它是否是回文数。回文数是指正序和倒序读都相同的数。',
    inputFormat: '输入包含一个正整数 n（1 ≤ n ≤ 10^9）。',
    outputFormat: '如果 n 是回文数，输出 "YES"；否则输出 "NO"。',
    sampleInput: '121',
    sampleOutput: 'YES',
    hints: [
      '可以将数字反转后与原数比较',
      '注意处理负数情况',
      '反转数字时可能溢出，需要考虑'
    ],
    referenceAnswer: `n = int(input())
original = n
reverse = 0
while n > 0:
    reverse = reverse * 10 + n % 10
    n //= 10
if original == reverse:
    print("YES")
else:
    print("NO")`,
    complexity: {
      time: 'O(log n)',
      space: 'O(1)'
    },
    template: {
      python: `n = int(input())
original = n
reverse = 0
while n > 0:
    reverse = reverse * 10 + n % 10
    n //= 10
if original == reverse:
    print("YES")
else:
    print("NO")`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long original = n, reverse = 0;
    while (n > 0) {
        reverse = reverse * 10 + n % 10;
        n /= 10;
    }
    if (original == reverse) {
        cout << "YES" << endl;
    } else {
        cout << "NO" << endl;
    }
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    long long n;
    scanf("%lld", &n);
    long long original = n, reverse = 0;
    while (n > 0) {
        reverse = reverse * 10 + n % 10;
        n /= 10;
    }
    if (original == reverse) {
        printf("YES\\n");
    } else {
        printf("NO\\n");
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long n = scanner.nextLong();
        long original = n, reverse = 0;
        while (n > 0) {
            reverse = reverse * 10 + n % 10;
            n /= 10;
        }
        if (original == reverse) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
    }
}`
    }
  },
  {
    id: '10',
    title: '数组反转',
    difficulty: 'medium',
    description: '给定一个整数数组，将其反转后输出。',
    inputFormat: '第一行输入整数 n（1 ≤ n ≤ 100），表示数组长度。第二行输入 n 个整数。',
    outputFormat: '输出反转后的数组，元素之间用空格分隔。',
    sampleInput: '5\n1 2 3 4 5',
    sampleOutput: '5 4 3 2 1',
    hints: [
      '可以使用双指针交换',
      'Python 可以直接使用切片反转 [::-1]',
      '注意原地反转和新建数组的区别'
    ],
    referenceAnswer: `n = int(input())
arr = list(map(int, input().split()))
print(' '.join(map(str, arr[::-1])))`,
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    template: {
      python: `n = int(input())
arr = list(map(int, input().split()))
print(' '.join(map(str, arr[::-1])))`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    reverse(arr, arr + n);
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
      java: `import java.util.Scanner;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Integer[] arr = new Integer[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        Collections.reverse(java.util.Arrays.asList(arr));
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}`
    }
  },
  {
    id: '11',
    title: '杨辉三角',
    difficulty: 'medium',
    description: '给定一个整数 n，输出前 n 行杨辉三角。',
    inputFormat: '输入包含一个整数 n（1 ≤ n ≤ 10）。',
    outputFormat: '输出前 n 行杨辉三角。每行数字用空格分隔，数字之间用一个空格。',
    sampleInput: '5',
    sampleOutput: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1',
    hints: [
      '杨辉三角每个数是它上方两数之和',
      '注意边界处理',
      '可以用二维数组或一维数组实现'
    ],
    referenceAnswer: `n = int(input())
triangle = []
for i in range(n):
    row = [1] * (i + 1)
    for j in range(1, i):
        row[j] = triangle[i-1][j-1] + triangle[i-1][j]
    triangle.append(row)
for row in triangle:
    print(' '.join(map(str, row)))`,
    complexity: {
      time: 'O(n²)',
      space: 'O(n²)'
    },
    template: {
      python: `n = int(input())
triangle = []
for i in range(n):
    row = [1] * (i + 1)
    for j in range(1, i):
        row[j] = triangle[i-1][j-1] + triangle[i-1][j]
    triangle.append(row)
for row in triangle:
    print(' '.join(map(str, row)))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<vector<int>> triangle(n);
    for (int i = 0; i < n; i++) {
        triangle[i].resize(i + 1);
        triangle[i][0] = triangle[i][i] = 1;
        for (int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            cout << triangle[i][j];
            if (j < i) cout << " ";
        }
        cout << endl;
    }
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int triangle[n][n];
    for (int i = 0; i < n; i++) {
        triangle[i][0] = triangle[i][i] = 1;
        for (int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            printf("%d", triangle[i][j]);
            if (j < i) printf(" ");
        }
        printf("\\n");
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] triangle = new int[n][n];
        for (int i = 0; i < n; i++) {
            triangle[i][0] = triangle[i][i] = 1;
            for (int j = 1; j < i; j++) {
                triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
            }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= i; j++) {
                System.out.print(triangle[i][j]);
                if (j < i) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`
    }
  },
  {
    id: '12',
    title: '最长公共子序列',
    difficulty: 'hard',
    description: '给定两个字符串，找出它们的最长公共子序列（LCS）的长度。',
    inputFormat: '输入两行，每行一个字符串（只包含小写字母，长度 ≤ 1000）。',
    outputFormat: '输出最长公共子序列的长度。',
    sampleInput: 'abcde\nace',
    sampleOutput: '3',
    hints: [
      '使用动态规划',
      '创建二维dp数组',
      'dp[i][j] 表示第一个字符串前i个字符和第二个字符串前j个字符的LCS长度'
    ],
    referenceAnswer: `s1 = input().strip()
s2 = input().strip()
n, m = len(s1), len(s2)
dp = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
print(dp[n][m])`,
    complexity: {
      time: 'O(n × m)',
      space: 'O(n × m)'
    },
    template: {
      python: `s1 = input().strip()
s2 = input().strip()
n, m = len(s1), len(s2)
dp = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
print(dp[n][m])`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s1, s2;
    cin >> s1 >> s2;
    int n = s1.size(), m = s2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    cout << dp[n][m] << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <string.h>

int max(int a, int b) {
    return a > b ? a : b;
}

int main() {
    char s1[1001], s2[1001];
    scanf("%s %s", s1, s2);
    int n = strlen(s1), m = strlen(s2);
    int dp[1001][1001];
    memset(dp, 0, sizeof(dp));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    printf("%d\\n", dp[n][m]);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine().trim();
        String s2 = scanner.nextLine().trim();
        int n = s1.length(), m = s2.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        System.out.println(dp[n][m]);
    }
}`
    }
  },
  {
    id: '13',
    title: '01背包问题',
    difficulty: 'hard',
    description: '给定 n 件物品和一个容量为 W 的背包，每件物品有重量和价值。找出使装入背包的物品价值最大的方式。',
    inputFormat: '第一行包含两个整数 n 和 W。第二行包含 n 个整数表示物品重量。第三行包含 n 个整数表示物品价值。',
    outputFormat: '输出能够装入背包的最大价值。',
    sampleInput: '3 10\n3 4 5\n4 5 6',
    sampleOutput: '11',
    hints: [
      '使用动态规划',
      'dp[i][j] 表示前i件物品、容量为j时的最大价值',
      '每个物品可以选择装入或不装入'
    ],
    referenceAnswer: `n, W = map(int, input().split())
weights = list(map(int, input().split()))
values = list(map(int, input().split()))
dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for w in range(W + 1):
        dp[i][w] = dp[i-1][w]
        if weights[i-1] <= w:
            dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
print(dp[n][W])`,
    complexity: {
      time: 'O(n × W)',
      space: 'O(n × W)'
    },
    template: {
      python: `n, W = map(int, input().split())
weights = list(map(int, input().split()))
values = list(map(int, input().split()))
dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for w in range(W + 1):
        dp[i][w] = dp[i-1][w]
        if weights[i-1] <= w:
            dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
print(dp[n][W])`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, W;
    cin >> n >> W;
    vector<int> weight(n), value(n);
    for (int i = 0; i < n; i++) cin >> weight[i];
    for (int i = 0; i < n; i++) cin >> value[i];
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (weight[i-1] <= w) {
                dp[i][w] = max(dp[i][w], dp[i-1][w-weight[i-1]] + value[i-1]);
            }
        }
    }
    cout << dp[n][W] << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <string.h>

int max(int a, int b) {
    return a > b ? a : b;
}

int main() {
    int n, W;
    scanf("%d %d", &n, &W);
    int weight[n], value[n];
    for (int i = 0; i < n; i++) scanf("%d", &weight[i]);
    for (int i = 0; i < n; i++) scanf("%d", &value[i]);
    int dp[n+1][W+1];
    memset(dp, 0, sizeof(dp));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (weight[i-1] <= w) {
                dp[i][w] = max(dp[i][w], dp[i-1][w-weight[i-1]] + value[i-1]);
            }
        }
    }
    printf("%d\\n", dp[n][W]);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int W = scanner.nextInt();
        int[] weight = new int[n];
        int[] value = new int[n];
        for (int i = 0; i < n; i++) weight[i] = scanner.nextInt();
        for (int i = 0; i < n; i++) value[i] = scanner.nextInt();
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                dp[i][w] = dp[i - 1][w];
                if (weight[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weight[i - 1]] + value[i - 1]);
                }
            }
        }
        System.out.println(dp[n][W]);
    }
}`
    }
  },
  {
    id: '14',
    title: '图的深度优先搜索',
    difficulty: 'hard',
    description: '给定一个无向图和起始节点，使用深度优先搜索（DFS）遍历图，输出遍历顺序。',
    inputFormat: '第一行包含两个整数 n 和 m（节点数和边数）。接下来 m 行，每行两个整数 u, v 表示一条无向边。最后一行是起始节点 s。',
    outputFormat: '输出 DFS 遍历顺序，节点编号之间用空格分隔。',
    sampleInput: '5 4\n1 2\n1 3\n2 4\n2 5\n1',
    sampleOutput: '1 2 4 5 3',
    hints: [
      '使用递归或栈实现 DFS',
      '注意标记已访问的节点',
      '节点编号从1开始'
    ],
    referenceAnswer: `import sys
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
print(' '.join(map(str, result)))`,
    complexity: {
      time: 'O(n + m)',
      space: 'O(n)'
    },
    template: {
      python: `import sys
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
print(' '.join(map(str, result)))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int n, m, s;
vector<vector<int>> graph;
vector<bool> visited;
vector<int> result;

void dfs(int u) {
    visited[u] = true;
    result.push_back(u);
    sort(graph[u].begin(), graph[u].end());
    for (int v : graph[u]) {
        if (!visited[v]) {
            dfs(v);
        }
    }
}

int main() {
    cin >> n >> m;
    graph.resize(n + 1);
    visited.resize(n + 1, false);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    cin >> s;
    dfs(s);
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int n, m, s;
int** graph;
int* visited;
int* result;
int resultSize;

void dfs(int u) {
    visited[u] = 1;
    result[resultSize++] = u;
    for (int i = 0; i < graph[u][0]; i++) {
        int v = graph[u][i + 1];
        if (!visited[v]) {
            dfs(v);
        }
    }
}

int cmp(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

int main() {
    scanf("%d %d", &n, &m);
    graph = (int**)malloc((n + 1) * sizeof(int*));
    for (int i = 0; i <= n; i++) {
        graph[i] = (int*)malloc((m + 1) * sizeof(int));
        graph[i][0] = 0;
    }
    visited = (int*)calloc(n + 1, sizeof(int));
    result = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u][++graph[u][0]] = v;
        graph[v][++graph[v][0]] = u;
    }
    scanf("%d", &s);
    for (int i = 1; i <= n; i++) {
        qsort(graph[i] + 1, graph[i][0], sizeof(int), cmp);
    }
    dfs(s);
    for (int i = 0; i < resultSize; i++) {
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }
    printf("\\n");
    return 0;
}`,
      java: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    static int n, m, s;
    static ArrayList<Integer>[] graph;
    static boolean[] visited;
    static ArrayList<Integer> result = new ArrayList<>();
    
    static void dfs(int u) {
        visited[u] = true;
        result.add(u);
        Collections.sort(graph[u]);
        for (int v : graph[u]) {
            if (!visited[v]) {
                dfs(v);
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        n = scanner.nextInt();
        m = scanner.nextInt();
        graph = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) graph[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            graph[u].add(v);
            graph[v].add(u);
        }
        s = scanner.nextInt();
        visited = new boolean[n + 1];
        dfs(s);
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result.get(i));
        }
        System.out.println();
    }
}`
    }
  }
]

export const getProblemsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Problem[] => {
  return problems.filter(p => p.difficulty === difficulty)
}

export const getProblemById = (id: string): Problem | undefined => {
  return problems.find(p => p.id === id)
}
