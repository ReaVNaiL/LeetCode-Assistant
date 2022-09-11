const ajax = require("ajax")


$ajax.ajax({
    type: "GET",
    url: "http://leetcode.com/api/problems/all/",
    headers: {
        Cookie: "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiNDg5NTE2MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImExYzg1YWI4MTEwYzZlMDUzZWZkMTdmZjA0MzhlZGM2NzU5OTU2NzciLCJpZCI6NDg5NTE2MywiZW1haWwiOiJkYW5pZGQwMjEzQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic29ycm93X2RhZGEiLCJ1c2VyX3NsdWciOiJzb3Jyb3dfZGFkYSIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNvbS91c2Vycy9hdmF0YXJzL2F2YXRhcl8xNjQ0MjY5NzUxLnBuZyIsInJlZnJlc2hlZF9hdCI6MTY2Mjc2Njk2NiwiaXAiOiI3NC4xMzIuMjE5LjU1IiwiaWRlbnRpdHkiOiIyNjUxY2U3Y2Q4ZTc2ZmVlY2E1NTIzMWU4Y2Y4YTZjNSIsInNlc3Npb25faWQiOjI3NDY3Nzc2LCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.Wy___6UEw7Bo9wfamwBeRAPv5KDwBlq1oax9uEHOXgo; NEW_PROBLEMLIST_PAGE=1",
    },
    success: function (response) {
        console.log(response);
    },
});
