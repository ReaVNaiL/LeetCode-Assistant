# LeetCode-Assistant Discord API Endpoints

This document outlines the API endpoints provided by the LeetCode-Assistant Discord Bot. These endpoints allow the bot to fetch daily coding challenges, retrieve problem counts, and more.

## Daily Problem

Fetches the daily problem that the bot will assign. 

- **Endpoint:** `https://leetcode-api.klenir.com/daily`
- **Method:** `GET`
- **Response:**

```json
{
    "title": "Last Stone Weight",
    "type": "Heap / Priority Queue",
    "difficulty": "Easy",
    "link": "https://leetcode.com/problems/last-stone-weight/"
}
```

## Daily Problem Count

Fetches the total count of daily problems that have been assigned so far. 

- **Endpoint:** `https://leetcode-api.klenir.com/daily/count`
- **Method:** `GET`
- **Response:**

```json
{
    "count": 64
}
```

## Daily Problem Link

Fetches the direct link to the daily problem on LeetCode.

- **Endpoint:** `https://leetcode-api.klenir.com/daily/link`
- **Method:** `GET`
- **Response:**

```json
{
    "link": "https://leetcode.com/problems/last-stone-weight/"
}
```

## Daily Bonus Problem

Fetches a bonus problem for additional challenge.

- **Endpoint:** `https://leetcode-api.klenir.com/daily/bonus`
- **Method:** `GET`
- **Response:**

```json
{
    "title": "Kth Largest Element in a Stream",
    "type": "???",
    "difficulty": "Easy",
    "link": "https://leetcode.com/problems/kth-largest-element-in-a-stream/"
}
```

## Refresh Problems

Refreshes the list of problems for a user session.

- **Endpoint:** `https://leetcode-api.klenir.com/problems/refresh?userSession=enabled`
- **Method:** `GET`
- **Response:**

```json
{
    "user_name": "",
    "num_solved": 0,
    "num_total": 2700,
    "ac_easy": 0,
    "ac_medium": 0,
    "ac_hard": 0,
    "stat_status_pairs": [
        {
            "stat": {
                "question_id": 2843,
                "question__title": "Extract Kth Character From The Rope Tree",
                "question__title_slug": "extract-kth-character-from-the-rope-tree",
                "question__hide": false,
                "total_acs": 318,
                "total_submitted": 419,
                "frontend_question_id": 2689,
                "is_new_question": true
            }
        }
    ],
    "frequency_high": 0,
    "frequency_mid": 0,
    "category_slug": "all"
}
```

## All Problems

Fetches a list of all problems.

- **Endpoint:** `https://leetcode-api.klenir.com/problems/all`
- **Method:** `GET`
- **Response:**

```json
{
    "completedProblemList": [
        [
            {
                "name": "Best Time to Buy and Sell Stock",
                "problemId": 121,
                "difficulty": 1,
                "progress": 94.71223482562193,
                "isCompleted": true,
                "questionUrl": "best-time-to-buy-and-sell-stock",
                "isNewQuestion": false,
                "paidOnly": false
            },
        ]
    ]
}
```